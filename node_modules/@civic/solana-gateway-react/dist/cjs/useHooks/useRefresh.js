"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
const react_1 = require("react");
const utils_1 = require("../useReducer/utils");
const logger_1 = __importDefault(require("../logger"));
const types_1 = require("../types");
const tokenUtils_1 = require("../utils/tokenUtils");
const reducer = (state, action) => {
    switch (action.type) {
        case 'refresh_status_check': {
            return Object.assign(Object.assign({}, state), { walletPowoInProgress: false, powoFinished: false, powoRequested: undefined, refreshInProgress: true, refreshIntervalId: action.refreshIntervalId, walletToRefresh: action.walletToRefresh, refreshTokenState: types_1.RefreshTokenState.CHECK_TOKEN_EXPIRATION });
        }
        case 'refresh_start': {
            return Object.assign(Object.assign({}, state), { gatewayStatus: types_1.GatewayStatus.REFRESH_TOKEN_REQUIRED, refreshTokenState: types_1.RefreshTokenState.IN_PROGRESS });
        }
        case 'refresh_complete': {
            return Object.assign(Object.assign({}, state), { refreshTokenState: types_1.RefreshTokenState.COMPLETED, gatewayStatus: (0, utils_1.statusFromToken)(state, state.gatewayToken), civicPass: Object.assign(Object.assign({}, state.civicPass), { responsePayload: undefined }) });
        }
        case 'refresh_with_powo_in_progress': {
            return Object.assign(Object.assign({}, state), { renderIframe: false, iframeMinimized: true, gatewayStatus: types_1.GatewayStatus.CHECKING });
        }
        case 'refresh_clear_interval':
            return Object.assign(Object.assign({}, state), { refreshIntervalId: undefined });
        case 'refresh_set_interval':
            return Object.assign(Object.assign({}, state), { refreshIntervalId: action.refreshIntervalId });
        case 'refresh_token_success':
            return Object.assign(Object.assign({}, state), { refreshTokenState: types_1.RefreshTokenState.WAIT_FOR_ON_CHAIN });
        default:
            return state;
    }
};
exports.reducer = reducer;
const useRefresh = ({ stage, gatekeeperClient, networkConfig, }, state, dispatch) => {
    const { refreshIntervalId, gatewayToken, gatekeeperNetworkAddress } = state;
    const logDebug = (message, obj = null) => logger_1.default.debug(`[useRefresh] ${message}`, obj);
    const logError = (message, obj = null) => logger_1.default.error(`[useRefresh] ${message}`, obj);
    const setTimeoutForRefresh = (0, react_1.useRef)(null);
    /**
     * if a refresh interval hasn't already been set, create one that will dispatch the startRefresh
     * event, triggering the refreshFlow
     */
    const setRefreshPoll = (0, react_1.useCallback)((connectedWallet) => {
        const { tokenExpirationMarginSeconds } = networkConfig;
        if (!refreshIntervalId && (gatewayToken === null || gatewayToken === void 0 ? void 0 : gatewayToken.expiryTime)) {
            const checkForExpirationIntervalMilliseconds = (0, tokenUtils_1.getTokenRefreshIntervalMilliseconds)(gatewayToken === null || gatewayToken === void 0 ? void 0 : gatewayToken.expiryTime, tokenExpirationMarginSeconds);
            const interval = setInterval(() => {
                dispatch({
                    type: 'refresh_status_check',
                    refreshIntervalId: interval,
                    walletToRefresh: connectedWallet,
                });
            }, checkForExpirationIntervalMilliseconds); // this will be cleared on completion
            logDebug('Setting refresh token interval', {
                expiring: gatewayToken.expiryTime,
                checkForExpirationIntervalMilliseconds,
                margin: tokenExpirationMarginSeconds,
            });
            // We need to know that the interval was set even if it has not fired yet.
            // to avoid setting duplicate intervals.
            dispatch({
                type: 'refresh_set_interval',
                refreshIntervalId: interval,
            });
        }
    }, [refreshIntervalId, stage, gatewayToken, networkConfig.tokenExpirationMarginSeconds]);
    /**
     * use the passed proof of wallet ownership string to call the gatekeeper refresh token
     * endpoint.
     * On server error (5xx), retry with backoff.
     * On all other errors, e.g. 400, move to a REFRESH_FAILED state.
     */
    const refreshTokenWithProof = (0, react_1.useCallback)((useWallet) => ({ proof, payload }) => {
        return new Promise((resolve, reject) => {
            logDebug('Refresh token with proof', proof);
            if (gatewayToken) {
                dispatch({ type: 'refresh_with_powo_in_progress' });
                gatekeeperClient()
                    .refreshToken(gatewayToken.identifier, useWallet.publicKey, payload, proof)
                    .then(() => {
                    dispatch({ type: 'refresh_token_success' });
                    resolve();
                })
                    .catch((error) => {
                    logError('Error refreshing token with proof', error);
                    reject(error);
                });
            }
        });
    }, [gatewayToken, gatekeeperClient, setRefreshPoll]);
    /**
     * wait until a gateway token exists in state before resolving the promise
     */
    const waitForUnexpiredGatewayToken = (0, react_1.useCallback)(() => {
        return new Promise((resolve, reject) => {
            logDebug('Waiting for unexpired token');
            if (setTimeoutForRefresh.current) {
                logDebug('Clearing interval for gatewayToken', setTimeoutForRefresh.current);
                clearTimeout(setTimeoutForRefresh.current);
                setTimeoutForRefresh.current = null;
            }
            const isExpired = (gatewayToken === null || gatewayToken === void 0 ? void 0 : gatewayToken.expiryTime) && (0, tokenUtils_1.hasExpired)(gatewayToken.expiryTime);
            if (!isExpired) {
                logDebug('Gateway token is unexpired', gatewayToken);
                resolve();
                return;
            }
            setTimeoutForRefresh.current = setTimeout(() => {
                reject(new Error('Gateway token refresh has not been updated onChain'));
            }, networkConfig.waitForTokenRefreshTimoutMilliseconds);
            logDebug('Starting check for Gateway token expiration timeout with identifier', setTimeoutForRefresh.current);
        });
    }, [gatewayToken, setTimeoutForRefresh, gatekeeperNetworkAddress]);
    return {
        setRefreshPoll,
        refreshTokenWithProof,
        waitForUnexpiredGatewayToken,
    };
};
exports.default = useRefresh;
