"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const logger_1 = __importDefault(require("../logger"));
const useWallet = (wallet, { refreshIntervalId }, dispatch) => {
    /**
     * detect a wallet disconnecting and dispatch an event
     */
    (0, react_1.useEffect)(() => {
        if (!wallet || !wallet.publicKey) {
            logger_1.default.debug('wallet disconnected');
            if (refreshIntervalId) {
                logger_1.default.debug('useEffect clearInterval', refreshIntervalId);
                clearInterval(refreshIntervalId);
                dispatch({ type: 'refresh_clear_interval' });
            }
            dispatch({ type: 'walletDisconnected' });
        }
    }, [wallet, refreshIntervalId]);
    /**
     * expect a connected wallet, throw an error if a vald wallet isn't in state
     */
    const expectWalletConnected = (0, react_1.useCallback)(() => {
        logger_1.default.debug('expectWalletConnected', wallet);
        if (!wallet || !wallet.publicKey) {
            throw new Error('No wallet connnected');
        }
        return wallet;
    }, [wallet]);
    return {
        expectWalletConnected,
    };
};
exports.default = useWallet;
