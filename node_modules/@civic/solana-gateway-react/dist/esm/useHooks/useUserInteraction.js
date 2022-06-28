"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const logger_1 = __importDefault(require("../logger"));
const useUserInteraction = ({ wallet }, state, dispatch) => {
    const { refreshIntervalId } = state;
    /**
     * handle the user initiating an issuance request
     */
    const requestGatewayToken = (0, react_1.useCallback)(async () => {
        logger_1.default.debug('requestGatewayToken called');
        if (!wallet || !wallet.publicKey) {
            logger_1.default.error('No wallet connected');
            return;
        }
        // We should stop polling when showing a modal dialog
        // and restart the polling when the user taps ok
        // or cancel
        if (refreshIntervalId) {
            dispatch({ type: 'refresh_clear_interval' });
            clearInterval(refreshIntervalId);
        }
        dispatch({ type: 'userInteraction_check_gatewayToken_status', token: state.gatewayToken });
    }, [refreshIntervalId, state.gatewayToken]);
    return {
        requestGatewayToken,
    };
};
exports.default = useUserInteraction;
