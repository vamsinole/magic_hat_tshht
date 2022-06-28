import { PublicKey, clusterApiUrl } from "@solana/web3.js";

export const MAGIC_HAT_PROGRAM_V2_ID = new PublicKey(
    'AGydXrbh2V9RH3h3cDzpws51tRDs2HbTtUXnCkq58bwH',
);

export const MAGIC_HAT_CREATOR_KEYPAIR:any = Uint8Array.from([9,148,84,119,156,88,245,36,86,216,49,118,176,163,100,47,160,41,82,222,95,17,155,11,166,13,68,40,91,248,164,34,193,38,30,236,231,226,37,186,51,51,255,25,120,144,213,110,185,12,165,73,213,136,110,248,59,31,116,171,205,115,130,192]);

export const MAGIC_HAT_CREATOR = new PublicKey(
  'DzyQCG4GP6uyL6V6jQUNE5WAPrrbCk9NB4A9hxYYG4T9',
);

export const SYSVAR_CLOCK_PUBKEY = new PublicKey(
    'SysvarC1ock11111111111111111111111111111111',
  );
  
  export const SYSVAR_EPOCH_SCHEDULE_PUBKEY = new PublicKey(
    'SysvarEpochSchedu1e111111111111111111111111',
  );
  
  export const SYSVAR_INSTRUCTIONS_PUBKEY = new PublicKey(
    'Sysvar1nstructions1111111111111111111111111',
  );
  
  export const SYSVAR_RECENT_BLOCKHASHES_PUBKEY = new PublicKey(
    'SysvarRecentB1ockHashes11111111111111111111',
  );
  
  export const SYSVAR_RENT_PUBKEY = new PublicKey(
    'SysvarRent111111111111111111111111111111111',
  );
  
  export const SYSVAR_REWARDS_PUBKEY = new PublicKey(
    'SysvarRewards111111111111111111111111111111',
  );
  
  export const SYSVAR_SLOT_HASHES_PUBKEY = new PublicKey(
    'SysvarRecentB1ockHashes11111111111111111111',
  );
  
  export const SYSVAR_SLOT_HISTORY_PUBKEY = new PublicKey(
    'SysvarS1otHistory11111111111111111111111111',
  );
  
  export const SYSVAR_STAKE_HISTORY_PUBKEY = new PublicKey(
    'SysvarStakeHistory1111111111111111111111111',
  );

export const MAGIC_HAT_ID = new PublicKey(
    'AVYoGnCbYHjEgL13RhkfZBp1199xWaFYky42sK3pRW1z'
);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export const TOKEN_PROGRAM_ID = new PublicKey(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);
  
export const pdaSeed = 'wallet-whitelist';

export const pdaWhitelistSeed = 'whitelist-config';
  
export const network = clusterApiUrl('devnet');
  
export const connectionsOptions = {
    preflightCommitment: 'processed',
};

export const GOG_TIME = 1656435600;
export const WL_TIME = 1656437400;
export const PUBLIC_TIME = 1656442800;
export const COMMUNITY_TIME = 1656434400;

export const GOG_PRICE = 1.69;
export const OG_PRICE = 1.69;
export const WL_PRICE = 1.90;
export const PUBLIC_PRICE = 2.29;

export const WHITELIST_WALLETS = [{
  wallet_address : "Dt4vt9vBttgeLaQ1dueGK1ykTBaeRGFVq2UN9jve3RBV",
  type: 'Three'
}, {
  wallet_address : "7b5UteeQ8aXULUJuPet66sXQ37XH4s8DZHSGj8BCC2Ec",
  type: 'Two'
}]