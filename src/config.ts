import { PublicKey, clusterApiUrl } from "@solana/web3.js";

export const MAGIC_HAT_PROGRAM_V2_ID = new PublicKey(
  "JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha"
);

export const MAGIC_HAT_CREATOR_KEYPAIR: any = [];

export const MAGIC_HAT_CREATOR = new PublicKey(
  "H18mLh2oW73KBqRZ53La54qBafEaXBm9bXVefhKnMfXH"
);

export const SYSVAR_CLOCK_PUBKEY = new PublicKey(
  "SysvarC1ock11111111111111111111111111111111"
);

export const SYSVAR_EPOCH_SCHEDULE_PUBKEY = new PublicKey(
  "SysvarEpochSchedu1e111111111111111111111111"
);

export const SYSVAR_INSTRUCTIONS_PUBKEY = new PublicKey(
  "Sysvar1nstructions1111111111111111111111111"
);

export const SYSVAR_RECENT_BLOCKHASHES_PUBKEY = new PublicKey(
  "SysvarRecentB1ockHashes11111111111111111111"
);

export const SYSVAR_RENT_PUBKEY = new PublicKey(
  "SysvarRent111111111111111111111111111111111"
);

export const SYSVAR_REWARDS_PUBKEY = new PublicKey(
  "SysvarRewards111111111111111111111111111111"
);

export const SYSVAR_SLOT_HASHES_PUBKEY = new PublicKey(
  "SysvarRecentB1ockHashes11111111111111111111"
);

export const SYSVAR_SLOT_HISTORY_PUBKEY = new PublicKey(
  "SysvarS1otHistory11111111111111111111111111"
);

export const SYSVAR_STAKE_HISTORY_PUBKEY = new PublicKey(
  "SysvarStakeHistory1111111111111111111111111"
);

export const MAGIC_HAT_ID = new PublicKey(
  "86Yz2W2gh8gyupVhGuX9VxhNV6JoGQqD3RZzixajc4TZ"
);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const pdaSeed = "wallet-whitelist";

export const pdaWhitelistSeed = "whitelist-config";

export const network = clusterApiUrl("mainnet-beta");

export const connectionsOptions = {
  preflightCommitment: "processed",
};

export const GOG_TIME = 1656435600;
export const WL_TIME = 1656437400;
export const PUBLIC_TIME = 1656442800;
export const COMMUNITY_TIME = 1656434400;

export const GOG_PRICE = 1.69;
export const OG_PRICE = 1.9;
export const WL_PRICE = 1.9;
export const PUBLIC_PRICE = 2.29;
export const COMMUNITY_PRICE = 0.01;