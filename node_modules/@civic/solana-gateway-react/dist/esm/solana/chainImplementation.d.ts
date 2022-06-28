import { PublicKey, Transaction } from '@solana/web3.js';
import { Chain } from '../types';
import { SolanaGatewayProps } from './types';
export declare const chainImplementation: ({ clusterUrl, publicKey, signTransaction, gatekeeperNetworkAddress, stage, }: {
    clusterUrl: string;
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    gatekeeperNetworkAddress: PublicKey;
    stage: string;
}) => Chain;
export declare const useSolanaGateway: () => SolanaGatewayProps;
