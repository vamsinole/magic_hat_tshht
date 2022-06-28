import { PublicKey, clusterApiUrl } from "@solana/web3.js";

export const MAGIC_HAT_PROGRAM_V2_ID = new PublicKey(
  "JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha"
);

export const MAGIC_HAT_CREATOR_KEYPAIR: any = Uint8Array.from([
  9, 148, 84, 119, 156, 88, 245, 36, 86, 216, 49, 118, 176, 163, 100, 47, 160,
  41, 82, 222, 95, 17, 155, 11, 166, 13, 68, 40, 91, 248, 164, 34, 193, 38, 30,
  236, 231, 226, 37, 186, 51, 51, 255, 25, 120, 144, 213, 110, 185, 12, 165, 73,
  213, 136, 110, 248, 59, 31, 116, 171, 205, 115, 130, 192,
]);

export const MAGIC_HAT_CREATOR = new PublicKey(
  "DzyQCG4GP6uyL6V6jQUNE5WAPrrbCk9NB4A9hxYYG4T9"
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

export const network = clusterApiUrl("devnet");

export const connectionsOptions = {
  preflightCommitment: "processed",
};

export const GOG_TIME = 1656435600;
export const WL_TIME = 1656437400;
export const PUBLIC_TIME = 1656442800;
export const COMMUNITY_TIME = 1656434400;

export const GOG_PRICE = 1.69;
export const OG_PRICE = 1.69;
export const WL_PRICE = 1.9;
export const PUBLIC_PRICE = 2.29;

export const WHITELIST_WALLETS = [
  {
    wallet_address: "2F7ZwZKxLMZj8ddqo1v97MwkYFiZ936NZyhC4vrcRbkK",
    type: "Three",
  },
  {
    wallet_address: "2hnET38XHigN8zAH4ipc5YPQXEqgF2JR5SQZAfjUx9Qz",
    type: "Three",
  },
  {
    wallet_address: "2p5d6Nxv9eGMmfXgCEUBwGYQNj86zXTB25X4QD3KUnoW",
    type: "Three",
  },
  {
    wallet_address: "2pWYbqvWwXryzxW81EL7bZvLDWFZK4ehMzFX417JhqBh",
    type: "Three",
  },
  {
    wallet_address: "331XMs73QBYJTCEyJPJB37p69q7ee6ewuVNwTDHbfVPH",
    type: "Three",
  },
  {
    wallet_address: "344h7SyPpgF6dUAa7XEqjn9unjGvcZyqLvKiwQ9G3q8e",
    type: "Three",
  },
  {
    wallet_address: "3LV7E2GR8B5zcmQD9y3DL8RCNShRieV6R666VgoB5mq2",
    type: "Three",
  },
  {
    wallet_address: "3WAVCsVUjZMsF6d2sKeEj9U94Zv4QYyNz8y3gkkDuqyc",
    type: "Three",
  },
  {
    wallet_address: "4cDZZ1fu3WntRxpDeXhuUhnVPnktjwgoVBUhCKdYEPug",
    type: "Three",
  },
  {
    wallet_address: "4kqjUDdcXVqnxmp9w3ECWaZcDuz2pjJFokgwB7Rj2CeP",
    type: "Three",
  },
  {
    wallet_address: "53J1CBkvF9bP1GLYW9LhpaXWYaCtU92azeZTJPRz3io5",
    type: "Three",
  },
  {
    wallet_address: "5H95vECE2kJYpKf1aoEqihpcKjdFZSjge2Cc19PM4XYH",
    type: "Three",
  },
  {
    wallet_address: "5q2jPVhpdyRdJDLRTq1gCKNsypcgEm3nMBkK5ZjtgUyF",
    type: "Three",
  },
  {
    wallet_address: "5Z8rojp5zdtPFXY4vqjMyTc4veUttbT726pGy8hwDsYA",
    type: "Three",
  },
  {
    wallet_address: "68fc6Egm9F942thJuqPzMvQoT7sSGVpS5w6QfHivnY2o",
    type: "Three",
  },
  {
    wallet_address: "6bjjwhRVE1fBZi89NbGCR3yGkozutfCp92jWCMZDeWvw",
    type: "Three",
  },
  {
    wallet_address: "6ggS2AAXmK1BCut6EVMY4KjDQGSfx84wMBsZvi9yD1Yu",
    type: "Three",
  },
  {
    wallet_address: "6hRgLCxZxeV8jh3MTDSDuKCXrWQ2uhwegzYtHpYfExPu",
    type: "Three",
  },
  {
    wallet_address: "6oMyMMipioGtcLQ3JscqN8rmVX83rxTiGdBGZgVc7yRa",
    type: "Three",
  },
  {
    wallet_address: "6UeDNxhdkqNKWqEHweqLrc2bc696csx457LAETzThMZz",
    type: "Three",
  },
  {
    wallet_address: "6XJoMD9TwKQzUa8ik9uwRAVdLVnbG486B6P7uGk52rik",
    type: "Three",
  },
  {
    wallet_address: "7br4iejNzEdKBNyJ399e84MA6x8CakkxAHE5vHjwLavj",
    type: "Three",
  },
  {
    wallet_address: "7M29PeVb2ehojYK6jZGPGH6NBCq1jTv6yZ2KYAxF59iT",
    type: "Three",
  },
  {
    wallet_address: "7pmWyp5FFCf6rAQMUscCUBJkJPDRLGTYVPV4pGNmcWhS",
    type: "Three",
  },
  {
    wallet_address: "85Qfy1KrJGt72Lw4NQwUhMmr31wdALBkUU3QsaNA1C4b",
    type: "Three",
  },
  {
    wallet_address: "8eoTWszwZVUFuCvH2d1vymGdaqvPaqCSBxGLeZS7kvfV",
    type: "Three",
  },
  {
    wallet_address: "8KZfF4Epj43ozuYPrnpNMtwviyhYGNAXhagdNoezDb6c",
    type: "Three",
  },
  {
    wallet_address: "8Xo3jDTZr2fAkoE4STsio8PBXCHt9M3hwXjnefJD9fHE",
    type: "Three",
  },
  {
    wallet_address: "99s7VziomwhwbiYJirMXu9Ls7LS3MJRFXZnSEK132TvQ",
    type: "Three",
  },
  {
    wallet_address: "9LwK9Z9jgw8cQRCWp6AWigdA8yh54pfMtF5Txrytha7J",
    type: "Three",
  },
  {
    wallet_address: "9myLGkAzJqyc1LbTLJDPKCnLN628XwPYkEKzpBhKGuX",
    type: "Three",
  },
  {
    wallet_address: "9outR6sNj1pL3ufkB5uUFurMsMMcrcLcffMmFMXN4AzY",
    type: "Three",
  },
  {
    wallet_address: "9R22xbX1JGyiLxrrchwvXF5PixuWqwvA3ZGaWnY9eQKv",
    type: "Three",
  },
  {
    wallet_address: "9rcvy42HAZs9KMNie1MiMo1UnqZnnhqACabnyF8RFvHQ",
    type: "Three",
  },
  {
    wallet_address: "9tQSR4QtZ8W7Pddf25mFzFQFYcpyW34hpqG34eayrZ4a",
    type: "Three",
  },
  {
    wallet_address: "9Upy14ZZiBs4WQ4kKSguhdC1fwf37Yagv2cB2dYRRRNJ",
    type: "Three",
  },
  {
    wallet_address: "AXEc35JefRG3Tpqz6vmPHpL6BYpmZcitdvyh3jiHQkx1",
    type: "Three",
  },
  {
    wallet_address: "B2FNMp6vyFG2EwsceTRxD7aDz1e4C2WeMC1ivc4U89RX",
    type: "Three",
  },
  {
    wallet_address: "BRiD72sskwDaHnQDFWdyWW2c1xceTjUDEBbPKoEGcE3Q",
    type: "Three",
  },
  {
    wallet_address: "Bw8kzsCggiRw1ZoyZSEhXcR9CChqpiT4Htn4d36Pgnsz",
    type: "Three",
  },
  {
    wallet_address: "BxAQE3JJ8g3rXzYt6bzBBQjRmvePy1VCA1kWbgyDodhQ",
    type: "Three",
  },
  {
    wallet_address: "CbKGHuVZS1QmptstZHoSKrMYJfz3tK5WcEqBKgjvLDfv",
    type: "Three",
  },
  {
    wallet_address: "CfoExJGvoJaxs1ZFbS55d6XBJszw1MNsEjae4txyhn28",
    type: "Three",
  },
  {
    wallet_address: "CGKUoaNjYUmoDg6sjWXd81WkHYqANfS1UguAh4tgDUxf",
    type: "Three",
  },
  {
    wallet_address: "CgUxHvRBYcArvKpVZrbDZwbWZuwhBK2j3JfJiytDJUpm",
    type: "Three",
  },
  {
    wallet_address: "CgZtfu13eNqzHtdGigrWv4ssBUv7fWJ1LWsG14NQQetP",
    type: "Three",
  },
  {
    wallet_address: "CqKpscivCWxsoHYFkEhzZYB3MDSE5KnwgqjeZ8zRq5oo",
    type: "Three",
  },
  {
    wallet_address: "CRXNaVDgFTU59V5MfbQFJxJt6JBEfkZPLkfbgWGfpeim",
    type: "Three",
  },
  {
    wallet_address: "CsRYYstbV5HJxiyQeeoqjCodj18cGUiRyGrdYTgkLFSS",
    type: "Three",
  },
  {
    wallet_address: "Cwo37T9sbKsLSKEMaNCrckwitDEftgRBGLghyDKn1vUC",
    type: "Three",
  },
  {
    wallet_address: "CyeubDLYAtGF2Ma2v8sAGWCX2C23ANbXTL8QTqyvziQ9",
    type: "Three",
  },
  {
    wallet_address: "D1arJyaJSmfeHD3TBhm2R6Rj3u7SSfTs2eQimka9bBvq",
    type: "Three",
  },
  {
    wallet_address: "DdY4cBchTVsUTvauitQUYmbfNT8gkb5qtaFzg6g2CpLb",
    type: "Three",
  },
  {
    wallet_address: "DN1kL3achgMVH391Em3GEw4nwJQLiT9qLL2zePZYmujj",
    type: "Three",
  },
  {
    wallet_address: "DNRS9S2r8ikFSUJ1dBM5v1uKhrenZfhBSQhsHmmxDpZz",
    type: "Three",
  },
  {
    wallet_address: "DsckXFnNz1gkgGzYYZ4Rza815CN8juiPERJWR4PpdeKD",
    type: "Three",
  },
  {
    wallet_address: "E346u9GdsFStk9dcYYGAefXixSUFXhNKKcbdWaGXwLtq",
    type: "Three",
  },
  {
    wallet_address: "E7sTQmAfm9ypGRYgZcgCN6vMENxeqiYCagNdVXYQJb22",
    type: "Three",
  },
  {
    wallet_address: "Em8A9Cnn4tAxxxomgMJQME6gmj5y6CYCbxVc23d2w2iQ",
    type: "Three",
  },
  {
    wallet_address: "EPksxWUgQVitePhUoRfXnXyAQ1ArQAwjdBDMNyd5DU5C",
    type: "Three",
  },
  {
    wallet_address: "EwJ7kHYH3znMiCdpvp23U7uef8ykzVVu59aUVrGMhckE",
    type: "Three",
  },
  {
    wallet_address: "EYDtUHKXeMzNDJJBkuADEegxKdcBXzHurMfyE98GZf4v",
    type: "Three",
  },
  {
    wallet_address: "EykGzJQXtkcrGcCHiXPdk2uhFLi4RnEZy6f6Jgc59hu8",
    type: "Three",
  },
  {
    wallet_address: "FFT6EMGSUXEjUNcfLoyGGjuZebRXGb8ztEcBXqsVw34h",
    type: "Three",
  },
  {
    wallet_address: "Fjf62CkfhxaoUbHa413QrhTJnEbn6bFGSX7wKCNsdkwL",
    type: "Three",
  },
  {
    wallet_address: "FSNXisbGh32ZKHa5h9ZsocawTu5X859FkqNmC5dKRjcC",
    type: "Three",
  },
  {
    wallet_address: "FzsAjFDc6a5WJy2pF3YwGgKLpubh2uyD9DJhfDoLLc3j",
    type: "Three",
  },
  {
    wallet_address: "GAW9AN76s8VJk5N3AyuSsHctbyRehgqixTFH5FJyT4Rt",
    type: "Three",
  },
  {
    wallet_address: "GKmV3qQjqoxmFtqVvuZKfggRV5oYDZ9HayoRyQSQ51Tc",
    type: "Three",
  },
  {
    wallet_address: "GPtyydZWJMiSp6zixMaSYMC4TEMzYKM3ioiF84BwqR7T",
    type: "Three",
  },
  {
    wallet_address: "GpyT8DHKpC6bifXdam87YqFD25ChDvWXk4kr9MnEbmxR",
    type: "Three",
  },
  {
    wallet_address: "H66zghePn1JDBM4p2JHttoM75hiLUJL9fHyBnZsaTC3Q",
    type: "Three",
  },
  {
    wallet_address: "HDCD4h2y1YCjhDLYDu9EeejRL3KasCdD3zuSgUAsH4cJ",
    type: "Three",
  },
  {
    wallet_address: "HhTRCjgdzFoXF3KniVhvSQMughWb6gXHJsnkBAZTy64X",
    type: "Three",
  },
  {
    wallet_address: "MNKTgMAFHRgZoxoPyBPYTEWLYPTz7VSwCUH67t9zbiw",
    type: "Three",
  },
  {
    wallet_address: "pLikPj7UZh4QY2HSzbewcAeNQpWeesUfr85n53QFw6N",
    type: "Three",
  },
  {
    wallet_address: "QVfGLugyx888bhFHm9LBvAXaJ58X6JdvGU4PoGwWQzy",
    type: "Three",
  },
  {
    wallet_address: "TDtQrEi3J7z8M4WQppvFu99HXqitWwzYtos9emkNo7H",
    type: "Three",
  },
  {
    wallet_address: "udxyWVmv7yvGEypMj7kUPjvNNgvQDt2wHEsKykfNmjK",
    type: "Three",
  },
  {
    wallet_address: "YUNYh7DhzdAzY9Jb6SFrbVoZsX2zmwFUj92yZunLxyY",
    type: "Three",
  },
  {
    wallet_address: "44TLzZFo2Dop4SfkU8MEniCtLVCDPtrF6iAynPYXVo52",
    type: "Three",
  },
  {
    wallet_address: "4Wv79K565rc88Rc5WmbLP4z1Nhfb43CUya5KX962rWoS",
    type: "Three",
  },
  {
    wallet_address: "5gTxtHki5Y2GvE6vgKfRegDBejWzXWScmj3oKB9q9UQy",
    type: "Three",
  },
  {
    wallet_address: "5YxQpGLuSHq9Bmd5pCzmpdsgWAiAJagLNCaFUTBqC47k",
    type: "Three",
  },
  {
    wallet_address: "6iw14V6SNLvZZi2J8xkjssQ8ZTwMxxHJWR3DgkWcPmDh",
    type: "Three",
  },
  {
    wallet_address: "7dotC9iSWkur2QJQGtdHenfLsekCWHNXJhzSWtxHsFFe",
    type: "Three",
  },
  {
    wallet_address: "7MnGgdXn3MxdVwk4rHHNeLLhn1YU6yBi8dawefuA69Tn",
    type: "Three",
  },
  {
    wallet_address: "7wqF8rVVsr5D1rGeaSqUPvzTdtgzSGisrzQjE22fFs1V",
    type: "Three",
  },
  {
    wallet_address: "8GSHYw7MvmA1gMPmHnSozARbq893XAwFxaKfy8KAcbyP",
    type: "Three",
  },
  {
    wallet_address: "9S3jKVHZFeMeWrh9ZvGPZJ19CnqsQc9BDJYXNNKA4Qyz",
    type: "Three",
  },
  {
    wallet_address: "9s8q9rVaKS9DfyfmZYV81CuJnDbvtiv9GK8KdSrsSV47",
    type: "Three",
  },
  {
    wallet_address: "9UV583ULFdbVjTjeqEsdnFuJQmSX2omM9jeaSde2WPKh",
    type: "Three",
  },
  {
    wallet_address: "9zeWm51vnxBGpdt4F9USF5YRckk33VQLGAcSE7ktTXke",
    type: "Three",
  },
  {
    wallet_address: "9zUvaRTwceqnNJ5ePsEAPaNwrrvT5iMeRU1RidGH3CWv",
    type: "Three",
  },
  {
    wallet_address: "AEbEreSmeahJvd97dbCGwtxQNHc2sQcvhE7B3bMV9uoC",
    type: "Three",
  },
  {
    wallet_address: "AKe33xRTKzprZFjK88SmcMFThQkUfTR2RSdymJHtdp82",
    type: "Three",
  },
  {
    wallet_address: "ARhwtjysfEt53PJZpu481DxZNmdKT9gMGonbUwJfkJZe",
    type: "Three",
  },
  {
    wallet_address: "Bd4iMazcfzAEHGPi1C5Ww9ydwNngWczUnGVF716QuLAN",
    type: "Three",
  },
  {
    wallet_address: "Bxgi3ewGeyyN1YT5RDNstyUg8XC8tgTjnZy2BdfhmiFW",
    type: "Three",
  },
  {
    wallet_address: "C1wvWe9eKmH8151pKPLesPjq5Ywdmf2zRbSa6SQoZygt",
    type: "Three",
  },
  {
    wallet_address: "C2SVT9zLQEHnzJPKVA387Au5wVbvTzKw614PsgvAyAZ4",
    type: "Three",
  },
  {
    wallet_address: "C3pGFm4RRuAcSEE1De4BLMKLFmudh4xznjkGBirifG1B",
    type: "Three",
  },
  {
    wallet_address: "CJhamdPk8373uhgpNfTdLSfG4PXtCVeDRzZPc5xGi419",
    type: "Three",
  },
  {
    wallet_address: "ERMrffAq7f9iQnCXBFCNhTc9zFWxZwuMehDtau3csxyD",
    type: "Three",
  },
  {
    wallet_address: "F8yvTQbZg1fRriKgVTkeXeVnQrNdrY1Z6t45G5LwKkyy",
    type: "Three",
  },
  {
    wallet_address: "FhdkDgk72jnT832Xwx8aeYLj8EqpKTnwZRdYVjbfpNfZ",
    type: "Three",
  },
  {
    wallet_address: "G4Z8fcKqvz44TTN2arBbYHk6R84Gz5nSJS2ZrRRuWd67",
    type: "Three",
  },
  {
    wallet_address: "GoisjVSLpBQKhmDhenyDxzN7geEh2GRA6LMdYxjdBo78",
    type: "Three",
  },
  {
    wallet_address: "GsBBJEToHNNEtWRXbbYmghgGmJ9TQgJPnTKCapy81Rhw",
    type: "Three",
  },
  {
    wallet_address: "HSChuYKJJ6AsvBHpGz76bX1wnEas84dWkypkgnte799Q",
    type: "Three",
  },
  {
    wallet_address: "JGr241LRYbBC5KKqJc7MRCuXCshksLXGyAGjL8iTw3T",
    type: "Three",
  },
  {
    wallet_address: "vsQG7rEskteDrF1gYjtzSLkHHhBM2UV1KACnsBupKEE",
    type: "Three",
  },
  {
    wallet_address: "zYRsn8S1yw79RQ8AqK5r6tHp287AXTn8RTsYvyF6jqJ",
    type: "Three",
  },
  {
    wallet_address: "F5GWL3RwVtXfFDXL85PGUNP26YH2cyhLCq5kPPwBdw2F",
    type: "Three",
  },
  {
    wallet_address: "JAuAJNCctNyf1Zv6NeT7piBS3DP24M5oL7Z3EHBnWRhv",
    type: "Three",
  },
  {
    wallet_address: "Lnmv19UVQdPkEFXDkcqZ9nPQjxaPs2yGnRgqHQ9ScyF",
    type: "Three",
  },
];
