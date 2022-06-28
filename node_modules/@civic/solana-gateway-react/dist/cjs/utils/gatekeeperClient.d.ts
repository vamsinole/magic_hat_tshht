import { CreateTokenRequest, GatekeeperRecordState } from '../types';
export declare type GatekeeperClientConfig = {
    baseUrl: string;
    queryParams?: Record<string, string>;
    stage: string;
    fetchImplementation?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
    numRetries?: number;
};
export declare type GatekeeperRecordResponse = {
    state: GatekeeperRecordState;
    payload?: unknown;
};
export default class GatekeeperClient {
    private baseUrl;
    private queryParams;
    private stage;
    private defaultRetryParams;
    private fetchImplementation;
    private fetchWithRetry;
    constructor(gatekeeperClientConfig: GatekeeperClientConfig);
    private addQueryParams;
    private urlForWallet;
    getGatekeeperRecordWithPayload(walletAddress: string): Promise<GatekeeperRecordResponse>;
    getGatekeeperStatus(walletAddress: string): Promise<GatekeeperRecordState>;
    requestGatewayTokenFromGatekeeper({ wallet, payload, proof }: CreateTokenRequest): Promise<Response>;
    /**
     * Tries to refresh a token.
     * If it fails with a 5xx, handleFetchError will retry a number of times.
     */
    refreshToken(gatewayTokenKey: string, walletPublicKey: string, payload: unknown, proof?: string): Promise<Response>;
}
