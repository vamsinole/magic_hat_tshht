import { PublicKey, clusterApiUrl } from "@solana/web3.js";

export const MAGIC_HAT_PROGRAM_V2_ID = new PublicKey(
  "JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha"
);

export const MAGIC_HAT_CREATOR_KEYPAIR: any = [];

export const MAGIC_HAT_CREATOR = new PublicKey(
  "H18mLh2oW73KBqRZ53La54qBafEaXBm9bXVefhKnMfXH"
);

export const MAGIC_STAKE_PROGRAM_ID = new PublicKey("CMftun186ypSsjsZM8eVfDA7AsPZLoScWpTEYBvCzZVQ");

export const FARM_ID = new PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8");

export const MAHANOTHIA_FARM_ID = new PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8");

export const SAN_CHETOS_FARM_ID = new PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8");

export const MAGNEXIA_FARM_ID = new PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8");

export const RAUDCHERI_FARM_ID = new PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8");

export const BASEMENT_FARM_ID = new PublicKey("78yzdAb2quRrZWgQi114jdJrsroscWfV3AdVDQYsTFt8");


export const GEM_BANK = new PublicKey('F4SDKmdyr6pzESeRuew4CkWj2qpTZ1xbn6o7Bvsa9297');

export const REWARD_MINT = new PublicKey('x4zmbszSajZe8Qg8H1J9s1hMsrDTYjPDe4qp8fJcgMa');

export const FEE_WALLET = new PublicKey('Bi4UpEtKxnHwCw7b9xkMCouGT6xLNm8nixs2fTmxTevs');

export const COLLECTION_ID = new PublicKey("BNZy4DXcGZRpkkgnQn5nfqnkMPjjh7NLk1KBTe8qqtmZ");

export const SYSVAR_CLOCK_PUBKEY = new PublicKey(
  "SysvarC1ock11111111111111111111111111111111"
);

export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
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

export const pdaSeed = "wallet-whitelist";

export const pdaWhitelistSeed = "whitelist-config";

export const network = clusterApiUrl("devnet");

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