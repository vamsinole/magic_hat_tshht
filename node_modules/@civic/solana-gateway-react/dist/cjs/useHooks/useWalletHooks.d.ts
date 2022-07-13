import type { Action } from '../useReducer';
import { RootState, WalletAdapter } from '../types';
declare const useWallet: (wallet: WalletAdapter | undefined, { refreshIntervalId }: Partial<RootState>, dispatch: React.Dispatch<Action>) => {
    expectWalletConnected: () => WalletAdapter;
};
export default useWallet;
