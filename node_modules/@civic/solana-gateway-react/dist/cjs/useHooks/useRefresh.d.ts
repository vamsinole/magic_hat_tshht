import { RootState, WalletAdapter } from '../types';
import type { Action } from '../useReducer';
import GatekeeperClient from '../utils/gatekeeperClient';
import { NetworkConfig } from '../networkConfig';
export declare type UseRefreshAction = {
    type: 'refresh_status_check';
    refreshIntervalId: number;
    walletToRefresh: WalletAdapter;
} | {
    type: 'refresh_start';
} | {
    type: 'refresh_with_powo';
} | {
    type: 'refresh_with_powo_in_progress';
} | {
    type: 'refresh_complete';
} | {
    type: 'refresh_clear_interval';
} | {
    type: 'refresh_set_interval';
    refreshIntervalId: number;
} | {
    type: 'refresh_token_success';
};
export declare const reducer: (state: RootState, action: Action) => RootState;
declare const useRefresh: ({ stage, gatekeeperClient, networkConfig, }: {
    stage: string;
    gatekeeperClient: () => GatekeeperClient;
    networkConfig: NetworkConfig;
}, state: Partial<RootState>, dispatch: React.Dispatch<Action>) => {
    setRefreshPoll: (connectedWallet: WalletAdapter | undefined) => void;
    waitForUnexpiredGatewayToken: () => Promise<void>;
    refreshTokenWithProof: (useWallet: WalletAdapter) => ({ proof, payload }: {
        proof?: string | undefined;
        payload?: unknown;
    }) => Promise<void>;
};
export default useRefresh;
