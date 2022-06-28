import { Chain, GatekeeperRecordState, RootState, WalletAdapter, GatewayToken } from '../types';
import type { Action } from '../useReducer';
import GatekeeperClient from '../utils/gatekeeperClient';
export declare const shouldRefreshTokenForRecordState: (state: GatekeeperRecordState, gatewayToken: GatewayToken | undefined, useWallet: WalletAdapter | undefined, powoRequested: string | undefined) => boolean;
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
declare const useOrchestration: ({ wallet, stage, chainImplementation, gatekeeperClient, }: {
    wallet: WalletAdapter | undefined;
    stage: string;
    chainImplementation: Chain;
    gatekeeperClient: () => GatekeeperClient;
}, state: Partial<RootState>, dispatch: React.Dispatch<Action>) => void;
export default useOrchestration;
