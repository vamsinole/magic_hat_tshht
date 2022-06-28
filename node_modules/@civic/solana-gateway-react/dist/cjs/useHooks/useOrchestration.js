"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRefreshTokenForRecordState = void 0;
const react_1 = require("react");
const config_1 = require("../solana/config");
const tokenUtils_1 = require("../utils/tokenUtils");
const logger_1 = __importDefault(require("../logger"));
const types_1 = require("../types");
const useChain_1 = __importDefault(require("./useChain"));
const useRefresh_1 = __importDefault(require("./useRefresh"));
const useWalletHooks_1 = __importDefault(require("./useWalletHooks"));
const actionCreator_1 = require("../actionCreator");
const usePOWO_1 = __importDefault(require("./usePOWO"));
const useGatekeeper_1 = __importDefault(require("./useGatekeeper"));
const useGatekeeperRecord_1 = __importDefault(require("./useGatekeeperRecord"));
const networkConfig_1 = __importDefault(require("../networkConfig"));
const useCivicPass_1 = __importDefault(require("./useCivicPass"));
const useCivicPassEventListener_1 = __importDefault(require("./useCivicPassEventListener"));
const shouldRefreshTokenForRecordState = (state, gatewayToken, useWallet, powoRequested) => {
    if (!gatewayToken)
        return false;
    if (gatewayToken.state !== types_1.State.ACTIVE)
        return false;
    if (!useWallet || !useWallet.publicKey || powoRequested)
        return false;
    return state !== types_1.GatekeeperRecordState.ISSUED;
};
exports.shouldRefreshTokenForRecordState = shouldRefreshTokenForRecordState;
/**
 * The orchestrator hook handles the main business logic of the component handling 2 main scenarios:
 * 1. the creation of a new gateway token for a new user
 * 2. the refreshing of an existing token for an existing user
 *
 * The orchestrator triggers uses effects to trigger flows for these two scenarios
 *
 * @param {{ wallet: WalletAdapter | undefined; clusterUrl: string; gatekeeperNetworkAddress: string | undefined; stage: string }} param0
 * @param {Partial<RootState>} state
 * @param {React.Dispatch<Action>} dispatch
 * @returns void
 */
const useOrchestration = ({ wallet, stage, chainImplementation, gatekeeperClient, }, state, dispatch) => {
    const { expectWalletConnected } = (0, useWalletHooks_1.default)(wallet, state, dispatch);
    const gatekeeperEndpoint = (0, config_1.getGatekeeperEndpoint)(stage);
    const { gatewayToken, tokenRequested, refreshIntervalId, powoRequested, refreshInProgress, walletToRefresh, civicPass, refreshTokenState, gatewayStatus, gatekeeperNetworkAddress, } = state;
    const networkConfig = (0, networkConfig_1.default)({ gatekeeperNetworkAddress, stage });
    // Register our hooks here
    const { waitForConfirmPOWO, waitForPOWO } = (0, usePOWO_1.default)({ wallet, chainImplementation }, state, dispatch);
    const { waitForGatekeeperIssuanceRequest } = (0, useGatekeeper_1.default)({ wallet, stage, gatekeeperClient }, state, dispatch);
    const { setRefreshPoll, refreshTokenWithProof, waitForUnexpiredGatewayToken } = (0, useRefresh_1.default)({ stage, gatekeeperClient, networkConfig }, state, dispatch);
    (0, useCivicPass_1.default)({ wallet }, state, dispatch);
    (0, useCivicPassEventListener_1.default)({ wallet, chainImplementation });
    (0, useChain_1.default)({ wallet, chainImplementation, networkConfig }, state, dispatch);
    (0, useGatekeeperRecord_1.default)({ wallet, gatekeeperClient, httpConfig: chainImplementation.httpConfig, networkConfig }, state, dispatch);
    /**
     * Refresh Flows ----------------------------------------------------------------
     */
    /**
     * wait until we have a payload that has been emitted by the CivicPass iframe
     * then resolve the promise
     */
    const waitForCivicPassRefreshResponsePayload = (0, react_1.useCallback)(() => {
        expectWalletConnected();
        logger_1.default.debug('waitForCivicPassRefreshResponsePayload');
        const result = new Promise((resolve) => {
            const responsePayload = civicPass === null || civicPass === void 0 ? void 0 : civicPass.responsePayload;
            const refreshPayload = responsePayload && responsePayload[types_1.CivicPassMessageAction.REFRESH];
            logger_1.default.debug('Refresh payload...', {
                refreshPayload,
                refreshPayloadState: refreshPayload === undefined,
            });
            if (refreshPayload !== undefined) {
                logger_1.default.debug('Refreshing token...');
                resolve(refreshPayload);
            }
        });
        return result;
    }, [civicPass === null || civicPass === void 0 ? void 0 : civicPass.responsePayload, expectWalletConnected]);
    /**
     * wait until a gateway token exists in state before resolving the promise
     */
    const waitForGatewayToken = (0, react_1.useCallback)(() => {
        expectWalletConnected();
        return new Promise((resolve) => {
            logger_1.default.debug('waitForGatewayToken gatewayToken', !!gatewayToken);
            if (gatewayToken)
                resolve(gatewayToken);
        });
    }, [gatewayToken, expectWalletConnected]);
    const shouldRefreshToken = async () => {
        if (!gatewayToken)
            return false;
        const { requiresGatekeeperRecordStatusCheck, tokenExpirationMarginSeconds } = networkConfig;
        if (requiresGatekeeperRecordStatusCheck) {
            const useWallet = walletToRefresh || wallet;
            const record = await gatekeeperClient().getGatekeeperRecordWithPayload(gatewayToken.owner);
            dispatch({ type: 'getGatekeeperRecord_success', gatekeeperRecord: record });
            return (0, exports.shouldRefreshTokenForRecordState)(record.state, gatewayToken, useWallet, powoRequested);
        }
        // Check for token expiration locally
        return (0, tokenUtils_1.isTokenRefreshRequired)({ gatewayToken, tokenExpirationMarginSeconds });
    };
    const checkRefreshRequired = (0, react_1.useCallback)(async (connectedWallet) => {
        const useWallet = walletToRefresh || connectedWallet; // prefer the wallet set in state, this handles polling after disconnect
        // Check preconditions for refresh:
        await waitForGatewayToken();
        const shouldRefresh = await shouldRefreshToken();
        if (!shouldRefresh) {
            logger_1.default.debug('Refresh not needed. Skipping this attempt.');
            dispatch({ type: 'refresh_complete' });
            setRefreshPoll(useWallet);
            return;
        }
        logger_1.default.debug('Refresh required. Running the refresh flow.');
        clearInterval(refreshIntervalId);
        dispatch({ type: 'refresh_start' });
        dispatch({ type: 'civicPass_check_token_status' });
        dispatch({ type: 'refresh_clear_interval' });
    }, [gatekeeperEndpoint, gatewayToken, powoRequested, refreshInProgress, refreshIntervalId, wallet, walletToRefresh]);
    /**
     * Check if the user needs to refresh their roken
     */
    (0, react_1.useEffect)(() => {
        if (refreshTokenState === types_1.RefreshTokenState.CHECK_TOKEN_EXPIRATION) {
            logger_1.default.debug('Checking if refresh required');
            checkRefreshRequired();
        }
    }, [refreshTokenState]);
    /**
     * If the user cancels out of the refresh flow start the refresh interval
     */
    (0, react_1.useEffect)(() => {
        if (refreshTokenState === types_1.RefreshTokenState.CANCELLED || refreshTokenState === types_1.RefreshTokenState.FAILED) {
            logger_1.default.debug('User canceled out of the refresh flow');
            setRefreshPoll(wallet);
        }
    }, [refreshTokenState]);
    /**
     * When we have a token start polling to determine the refresh state
     */
    (0, react_1.useEffect)(() => {
        if (gatewayStatus === types_1.GatewayStatus.ACTIVE) {
            logger_1.default.debug('Start polling for the refresh interval');
            setRefreshPoll(wallet);
        }
    }, [gatewayStatus]);
    /**
     * Issuance Flows ----------------------------------------------------------------
     */
    /**
     * poll until a gatekeeper record is found, once active check the chain for a token
     * then dispatch a tokenChange event that will result in the token getting saved to state
     * start token refresh polling once a valid token is set
     */
    const waitForOnChainToken = (0, react_1.useCallback)(async () => {
        if (wallet) {
            logger_1.default.debug('waitForOnChainToken');
            const actionCreator = (0, actionCreator_1.gatewayTokenActionCreator)({
                wallet,
                chainImplementation,
                gatekeeperClient,
                dispatch,
                networkConfig,
            });
            await actionCreator.waitForGatewayToken();
        }
        return null;
    }, [gatekeeperEndpoint, gatekeeperClient, expectWalletConnected]);
    /**
     * wait until a presentation request id has been emitted by the CivicPass iframe
     * then resolve the promise
     */
    const waitForCivicPassIssuanceResponsePayload = (0, react_1.useCallback)(() => {
        expectWalletConnected();
        logger_1.default.debug('waitForCivicPassIssuanceResponsePayload');
        const result = new Promise((resolve) => {
            const responsePayload = civicPass === null || civicPass === void 0 ? void 0 : civicPass.responsePayload;
            const issuancePayload = responsePayload && responsePayload[types_1.CivicPassMessageAction.ISSUANCE];
            logger_1.default.debug('Issuance payload...', issuancePayload);
            if (issuancePayload !== undefined) {
                resolve(issuancePayload);
            }
        });
        return result;
    }, [civicPass === null || civicPass === void 0 ? void 0 : civicPass.responsePayload, expectWalletConnected]);
    /**
     * wait until the user has requested a gateway token before resolving the promise
     */
    const waitForTokenRequested = (0, react_1.useCallback)(() => {
        expectWalletConnected();
        return new Promise((resolve) => {
            logger_1.default.debug('waitForTokenRequested tokenRequested', tokenRequested);
            if (tokenRequested)
                resolve(true);
        });
    }, [tokenRequested, expectWalletConnected]);
    /**
     * wait until the user has requested a gateway token before resolving the promise
     */
    const checkForRequiredProof = (0, react_1.useCallback)(async ({ requiresProofOfWalletOwnership, payload, }) => {
        logger_1.default.debug('Checking for required proof', { requiresProofOfWalletOwnership, payload });
        if (requiresProofOfWalletOwnership) {
            const result = await waitForConfirmPOWO(payload).then(waitForPOWO);
            return result;
        }
        return { payload };
    }, [waitForConfirmPOWO, waitForPOWO]);
    /**
     * New token request flow:
     * wait for the user to request a new token
     * wait for the iframe to return a payload
     * wait for the user to confirm they've read the proof of ownership dialogue
     * wait for the user to provide proof of ownership
     * wait for a call to the gatekeeper to request a new token issuance
     * wait for a gatekeeper record to be created
     * once this flow is complete a new Gatekeeper token should be available and set in state
     */
    (0, react_1.useEffect)(() => {
        waitForTokenRequested()
            .then(waitForCivicPassIssuanceResponsePayload)
            .then(checkForRequiredProof)
            .then(waitForGatekeeperIssuanceRequest)
            .then(waitForOnChainToken)
            .then(() => setRefreshPoll(wallet))
            .catch((error) => logger_1.default.error('ERROR newTokenRequestFlow', error));
    }, [
        waitForTokenRequested,
        waitForCivicPassIssuanceResponsePayload,
        checkForRequiredProof,
        waitForGatekeeperIssuanceRequest,
        waitForOnChainToken,
    ]);
    /**
     * Refresh start flow:
     * Triggered when we have a refreshResponse payload
     * wait refresh to be triggered from the iFrame
     * wait for the iframe to return a payload
     * wait for the user to confirm they've read the proof of ownership dialogue
     * wait for the user to provide proof of ownership
     * wait for a call to the gatekeeper to refresh the token
     * check if token is expired and timeout if token does not update within timeframe
     */
    (0, react_1.useEffect)(() => {
        const useWallet = walletToRefresh || wallet;
        waitForCivicPassRefreshResponsePayload()
            .then(checkForRequiredProof)
            .then(refreshTokenWithProof(useWallet))
            .then(waitForUnexpiredGatewayToken)
            .catch((error) => {
            logger_1.default.error('refreshFlow', error);
            logger_1.default.error('refreshToken error', error);
            dispatch({ type: 'refresh_complete' });
            setRefreshPoll(useWallet);
        });
    }, [civicPass === null || civicPass === void 0 ? void 0 : civicPass.responsePayload, checkForRequiredProof]);
    /**
     * Refresh complete flow:
     * Triggered by token change event
     * Check the refresh token state
     * Check if token is unexpired and clear timeout if token is not expired
     * Complete the refresh event and clear the refresh response payload
     */
    (0, react_1.useEffect)(() => {
        const useWallet = walletToRefresh || wallet;
        if (refreshTokenState === types_1.RefreshTokenState.WAIT_FOR_ON_CHAIN) {
            waitForUnexpiredGatewayToken()
                .then(() => setRefreshPoll(useWallet))
                .then(() => {
                dispatch({ type: 'refresh_complete' });
            })
                .catch((error) => {
                logger_1.default.error('refreshFlow', error);
                logger_1.default.error('refreshToken error', error);
                dispatch({ type: 'refresh_complete' });
                setRefreshPoll(useWallet);
            });
        }
    }, [gatewayToken, refreshTokenState]);
};
exports.default = useOrchestration;
