import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction, Transaction, Connection, GetProgramAccountsFilter, TokenAccountsFilter, clusterApiUrl } from "@solana/web3.js";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import MobileMenu from "./assets/mobile_menu.png";
import OutsideClickHandler from "react-outside-click-handler";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import { AlertState } from "../utils/utils";
import Twitter from "./assets/twitter_copy.png";
import Discord from "./assets/discord.png";
import LogoWhite from "./assets/Logowhite.png";
import LogoWhiteCropped from "./assets/Logowhite_cropped.png";
import KatanaImage from "./assets/katana.png";
import PizzaImage from "./assets/pizza.png";
import FanSpinning from "./assets/fan_spinning.mp4";
import Sopha from "./assets/sopha.png";
import Beanbag from "./assets/bean_bag.png";
import SophaSider from "./assets/sopha_sider.png";
import MenuContent from "../components/menu";
import CloseAlpha from "./assets/turn-back.png";
import Close from "./assets/close.png";
import AlphaScroll from "./assets/down-arrow.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Dev1 from "./assets/dev1.png";
import Dev2 from "./assets/dev2.png";
import Sashi from "./assets/sashi.png";
import Wallace from "./assets/wallace.png";
import Gabriel from "./assets/gabriel.png";
import Kaizer from "./assets/kaizer.png";
import Walter from "./assets/walter.png";
import Yogantar from "./assets/yogantar.png";
import { programs } from "@metaplex/js"
import {
  MAGIC_HAT_ID,
  pdaSeed,
  pdaWhitelistSeed,
  MAGIC_HAT_CREATOR,
  TOKEN_METADATA_PROGRAM_ID,
  MAGIC_HAT_CREATOR_KEYPAIR,
  GOG_TIME,
  WL_TIME,
  PUBLIC_TIME,
  COMMUNITY_TIME,
  GOG_PRICE,
  OG_PRICE,
  WL_PRICE,
  PUBLIC_PRICE,
  COMMUNITY_PRICE,
  MAGIC_STAKE_PROGRAM_ID,
  FARM_ID,
  TOKEN_PROGRAM_ID,
  MAHANOTHIA_FARM_ID,
  BASEMENT_FARM_ID,
  SAN_CHETOS_FARM_ID,
  MAGNEXIA_FARM_ID,
  RAUDCHERI_FARM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  GEM_BANK,
  COLLECTION_ID,
  REWARD_MINT,
  FEE_WALLET
} from "../config/config";
import {
  awaitTransactionSignatureConfirmation,
  MagicHatAccount,
  getMagicHatState,
  mintOneToken,
  mintOneTokenWL,
} from "../programs/candy-machine";
import idl from "./magic_hat.json";
import idlStake from "./magic_stake.json";
import idlBank from "./gem_bank.json";
import { BN, Program } from "@project-serum/anchor";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { sendTransactions } from "../config/connection";
import { getParsedNftAccountsByOwner,isValidSolanaAddress, createConnectionConfig,} from "@nfteyez/sol-rayz";

const MAGIC_HAT_PROGRAM_V2_ID = new anchor.web3.PublicKey(
  "JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha"
);

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

interface NFT {
  pubkey?: PublicKey
  mint: PublicKey
  onchainMetadata: programs.metadata.MetadataData
  externalMetadata: {
    attributes: Array<any>
    collection: any
    description: string
    edition: number
    external_url: string
    image: string
    name: string
    properties: {
      files: Array<string>
      category: string
      creators: Array<string>
    }
    seller_fee_basis_points: number
  }
}

const RewardType = {
  Probable: { probable: {} },
  Fixed: { fixed: {} },
};

const LPType = {
  RESPECT: { respect: {} }
};

interface FarmConfig {
  minStakingPeriodSec: BN;
  cooldownPeriodSec: BN;
  unstakingFeePercent: BN;
}

interface MaxCounts {
  maxFarmers: number;
  maxGems: number;
  maxRarityPoints: number;
}

interface TierConfig {
  rewardRate: BN;
  requiredTenure: BN;
}

interface LpTierConfig {
  lpTierRate: BN;
  lpRequiredTenure: BN;
}

interface ProbTierConfig {
  probableRewardRate: BN;
  probability: BN;
}

interface ProbableRateScheduleStake {
  prob1: ProbTierConfig | null;
  prob2: ProbTierConfig | null;
  prob3: ProbTierConfig | null;
  prob4: ProbTierConfig | null;
  prob5: ProbTierConfig | null;
  denominator: BN;
}

interface FixedRateScheduleStake {
  baseRate: BN;
  tier1: TierConfig | null;
  tier2: TierConfig | null;
  tier3: TierConfig | null;
  denominator: BN;
}

interface LpRateScheduleStake {
  lpBaseRate: BN;
  lpTier1: LpTierConfig | null;
  lpTier2: LpTierConfig | null;
  lpTier3: LpTierConfig | null;
  lpDenominator: BN;
}

interface FixedRateSchedule {
  maxFarmers: number;
  maxGems: number;
  maxRarityPoints: number;
}

interface FixedRateConfig {
  schedule: FixedRateScheduleStake;
  amount: BN;
  durationSec: BN;
}

interface RarityConfig {
  mint: PublicKey;
  rarityPoints: BN;
}

interface LpRateConfig {
  lpSchedule: LpRateScheduleStake;
  lpDurationSec: BN;
}

interface ProbableRateConfig {
  probableSchedule: ProbableRateScheduleStake;
  probableAmount: BN;
  probableDurationSec: BN;
}

interface WhiteListType {
  whitelist_type: string;
  number_of_whitelist_spots_total: any;
  mint_price: any;
  start_time: any;
}

interface WhitelistSchedule {
  wl_start_time_3: WhiteListType;
  wl_start_time_2: WhiteListType;
  wl_start_time_1: WhiteListType;
  public_mint_start_time: WhiteListType;
}

interface WhitelistConfig {
  whitelist_schedule: WhitelistSchedule;
  magic_hat_creator: any;
  bump: any;
}

export interface HomeProps {
  magicHatId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  // const url = window.location.origin;
  // if (!url.includes('https')) {
  //   if (url.split(':')[2]) {
  //     var loc:any = 'https:' + url.split(':')[1] + ':' +  + url.split(':')[2];
  //     window.location = loc;
  //   }
  //   else {
  //     var loc:any = 'https:' + url.split(':')[1];
  //     window.location = loc;
  //   }
  // }
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [magicHat, setMagicHat] = useState<MagicHatAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [classNameState, setClassNameState] = useState<string>(
    "main-bg-after-door-open black-bg"
  );
  const [isMobile, setIsMobile] = useState(false);
  const [logoLoading] = useState(false);
  const [logoAlphaLoading, setLogoAlphaLoading] = useState(true);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showFarming, setShowFarming] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showAlphaRoom, setShowAlphaRoom] = useState(false);
  const [showStakeRoom, setShowStakeRoom] = useState(false);
  const [showTeamRoom, setShowTeamRoom] = useState(false);
  const [showFirstPhil, setShowFirstPhil] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileDoor, setShowMobileDoor] = useState(false);
  const [mobileDoor, setMobileDoor] = useState(null);
  const [showTeamInfo, setShowTeamInfo] = useState(false);
  const [shouldMint, setShouldMint] = useState(false);
  const [teamInfoMember, setTeamInfoMember] = useState<any>(null);
  const [whitelists, setWhitelists] = useState<any>(null);
  const [completed, setCompleted] = useState(0);
  const [mintCount, setMintCount] = useState(1);
  const [currentWl, setCurrentWl] = useState("");
  const [time, setTime] = useState("");
  const [alreadyCalled, setAlreadyCalled] = useState(false);
  const [showMintInfo, setShowMintInfo] = useState(false);
  const [mintSuccessMessage, setMintSuccessMessage] = useState(false);
  const [showWhitelist, setShowWhitelist] = useState(false);
  const [showStakeCity, setShowStakeCity] = useState(false);
  const [showStaking, setShowStaking] = useState(false);
  const [roomOneInfoClass, setRoomOneInfoClass] = useState("stake-room-info-one");
  const [roomTwoInfoClass, setRoomTwoInfoClass] = useState("stake-room-info-one");
  const [roomThreeInfoClass, setRoomThreeInfoClass] = useState("stake-room-info-one");
  const [roomFourInfoClass, setRoomFourInfoClass] = useState("stake-room-info-one");
  const [roomFiveInfoClass, setRoomFiveInfoClass] = useState("stake-room-info-one");
  const [createdWlCounts, setCreatedWlCounts] = useState(0);
  const [nftStakeStep, setNftStakeStep] = useState(0);
  const [stakingStep, setStakingStep] = useState(0);
  const [currentStakeRoom, setCurrentStakeRoom] = useState(0);
  const [stakedNft, setStakedNft] = useState<any>(null);
  const [unstakedNft, setUnstakedNft] = useState<any>(null);
  const [stakedNfts, setStakedNfts] = useState<any>([]);
  const [stakedTokens, setStakedTokens] = useState<any>(0);
  const [multiplierLevel, setMultiplierLevel] = useState<any>(0);
  const [respectEarned, setRespectEarned] = useState<any>(0);
  const [stakedCity, setStakedCity] = useState("");
  const [mintResponse, setMintResponse] = useState("");
  const [collectionId, setCollectionId] = useState<any>("");
  const [mintResponseType, setMintResponseType] = useState("");
  const [maxCount, setMaxCount] = useState<number>(3);
  const [setBars] = useState([
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
    42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78,
    80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100,
  ]);
  const [gotNfts, setGotNfts] = useState(false);
  const [showStakeDashboard, setShowStakeDashboard] = useState(false);
  const [nfts, setNFts] = useState<any>([]);
  const [farm, setFarm] = useState<any>(null);
  const [mahanothiaFarm, setMahanothiaFarm] = useState<any>(null);
  const [raudcheriFarm, setRaudcheriFarm] = useState<any>(null);
  const [sanChetosFarm, setsanChetosFarm] = useState<any>(null);
  const [magnexiaFarm, setMagnexiaFarm] = useState<any>(null);
  const [basementFarm, setBasementFarm] = useState<any>(null);
  const [farmer, setFarmer] = useState<any>(null);
  const [farmerMahanothia, setFarmerMahanothia] = useState<any>(null);
  const [farmerRaudcheri, setFarmerRaudcheri] = useState<any>(null);
  const [farmerSanChetos, setFarmerSanChetos] = useState<any>(null);
  const [farmerMagnexia, setFarmerMagnexia] = useState<any>(null);
  const [farmerBasement, setFarmerBasement] = useState<any>(null);
  const [funderOne, setFunderOne] = useState<any>("");
  const [funderTwo, setFunderTwo] = useState<any>("");
  const [funderThree, setFunderThree] = useState<any>("");
  const [funderFour, setFunderFour] = useState<any>("");
  const [funderFive, setFunderFive] = useState<any>("");
  const [nftMint, setNftMint] = useState<any>("");
  const [collectionIdInput, setCollectionIdInput] = useState<any>("");
  const [collectionIdInputOne, setCollectionIdInputOne] = useState<any>("");
  const [collectionIdInputTwo, setCollectionIdInputTwo] = useState<any>("");
  const [collectionIdInputThree, setCollectionIdInputThree] = useState<any>("");
  const [collectionIdInputFour, setCollectionIdInputFour] = useState<any>("");
  const [collectionIdInputFive, setCollectionIdInputFive] = useState<any>("");
  const [collectionIdMint, setCollectionIdMint] = useState<any>("");

  const wallet = useWallet();
  wallet.connect();

  const citys = [{
    name: "MAHANOTHIA",
    link: Dev1
  },{
    name: "RAUDCHERI",
    link: Dev1
  },{
    name: "SAN CHETOS",
    link: Dev1
  },{
    name: "MAGNEXIA",
    link: Dev1
  },{
    name: "THE BASEMENT",
    link: Dev1
  }]

  const anchorWallet = useMemo(() => {
    // wallet.connect();
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const refreshMagicHatState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.magicHatId) {
      try {
        const cndy = await getMagicHatState(
          anchorWallet,
          props.magicHatId,
          props.connection
        );
        console.log(JSON.stringify(cndy.state, null, 4));
        const k: any = cndy?.state.itemsRedeemed.toString()!;
        const l: any = cndy?.state.itemsAvailable.toString()!;
        const completed_c: any = ((parseInt(k) / parseInt(l)) * 100).toFixed(0);
        setCompleted(completed_c);
        setMagicHat(cndy);
      } catch (e) {
        console.log("There was a problem fetching Candy Machine state");
        console.log(e);
      }
    }
  }, [anchorWallet, props.magicHatId, props.connection]);

  const onMint = async (id: number) => {
    try {
      setIsUserMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && magicHat?.program && wallet.publicKey) {
        const mintTxId: any = [];
        console.log(magicHat.id.toBase58());
        mintTxId[0] = (
          await mintOneToken(magicHat, wallet.publicKey, wallet, id)
        )[0];
        if (id >= 2) {
          mintTxId[1] = (
            await mintOneToken(magicHat, wallet.publicKey, wallet, id)
          )[0];
        }
        if (id >= 3) {
          mintTxId[2] = (
            await mintOneToken(magicHat, wallet.publicKey, wallet, id)
          )[0];
        }
        let status: any = [];
        // const wallet_t:any = wallet;
        // const provider = new anchor.Provider(props.connection, wallet_t, anchor.Provider.defaultOptions())
        // const meta_idl:any = anchor.Program.fetchIdl(TOKEN_METADATA_PROGRAM_ID, provider);
        // const [metadata_pda] = await PublicKey.findProgramAddress(
        //   [Buffer.from('metadata'),
        //   TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        //   mint.publicKey.toBuffer(),],
        //   MAGIC_HAT_PROGRAM_V2_ID
        // )
        // const program = new anchor.Program(meta_idl, TOKEN_METADATA_PROGRAM_ID, provider);
        // const state: any = await program.account.magicHat.fetch(magicHatId);
        // console.log(state.authority.toBase58());
        if (mintTxId[0]) {
          status[0] = await awaitTransactionSignatureConfirmation(
            mintTxId[0],
            props.txTimeout,
            props.connection,
            true
          );
        }
        if (mintTxId[1]) {
          status[1] = await awaitTransactionSignatureConfirmation(
            mintTxId[1],
            props.txTimeout,
            props.connection,
            true
          );
        }
        if (mintTxId[2]) {
          status[2] = await awaitTransactionSignatureConfirmation(
            mintTxId[2],
            props.txTimeout,
            props.connection,
            true
          );
        }
        if (status[0] && !status[0].err && id >= 1) {
          setMintSuccessMessage(true);
          setMintResponseType("success");
          setMintResponse("YOU'VE SHHUCCESSFULLY MINTED A HOODRAT!");
          setTimeout(function () {
            setMintSuccessMessage(true);
            setMintSuccessMessage(false);
            setMintResponseType("");
            setMintResponse("");
          }, 6000);
        } else {
          setMintSuccessMessage(true);
          setMintResponseType("error");
          setMintResponse("Mint failed! Please try again!");
          setTimeout(function () {
            setMintSuccessMessage(true);
            setMintSuccessMessage(false);
            setMintResponseType("");
            setMintResponse("");
          }, 6000);
          // setAlertState({
          //   open: true,
          //   message: "Mint failed! Please try again!",
          //   severity: "error",
          // });
        }
        if (id >= 2) {
          if (status[1] && !status[1].err) {
            // setAlertState({
            //   open: true,
            //   message: "Congratulations! Mint succeeded!",
            //   severity: "success",
            // });
            setMintSuccessMessage(true);
            setMintResponseType("success");
            setMintResponse("YOU'VE SHHUCCESSFULLY MINTED A HOODRAT!");
            setTimeout(function () {
              setMintSuccessMessage(true);
              setMintSuccessMessage(false);
              setMintResponseType("");
              setMintResponse("");
            }, 6000);
          } else {
            // setAlertState({
            //   open: true,
            //   message: "Mint failed! Please try again!",
            //   severity: "error",
            // });
            setMintSuccessMessage(true);
            setMintResponseType("error");
            setMintResponse("Mint failed! Please try again!");
            setTimeout(function () {
              setMintSuccessMessage(true);
              setMintSuccessMessage(false);
              setMintResponseType("");
              setMintResponse("");
            }, 6000);
          }
        }
        if (id >= 3) {
          if (status[2] && !status[2].err) {
            // setAlertState({
            //   open: true,
            //   message: "Congratulations! Mint succeeded!",
            //   severity: "success",
            // });
            setMintSuccessMessage(true);
            setMintResponseType("success");
            setMintResponse("YOU'VE SHHUCCESSFULLY MINTED A HOODRAT!");
            setTimeout(function () {
              setMintSuccessMessage(true);
              setMintSuccessMessage(false);
              setMintResponseType("");
              setMintResponse("");
            }, 6000);
          } else {
            // setAlertState({
            //   open: true,
            //   message: "Mint failed! Please try again!",
            //   severity: "error",
            // });
            setMintSuccessMessage(true);
            setMintResponseType("error");
            setMintResponse("Mint failed! Please try again!");
            setTimeout(function () {
              setMintSuccessMessage(true);
              setMintSuccessMessage(false);
              setMintResponseType("");
              setMintResponse("");
            }, 6000);
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          setMintResponse("Transaction Timeout! Please try again.");
        } else if (error.message.indexOf("0x137")) {
          setMintResponse(`SOLD OUT!`);
        } else if (error.message.indexOf("0x135")) {
          setMintResponse(
            `Insufficient funds to mint. Please fund your wallet.`
          );
        }
      } else {
        if (error.code === 311) {
          setMintResponse(`SOLD OUT!`);
          window.location.reload();
        } else if (error.code === 312) {
          setMintResponse(`Minting period hasn't started yet.`);
        }
      }
      setMintResponseType("error");
      setMintSuccessMessage(true);
      setTimeout(function () {
        setMintResponseType("");
        setMintSuccessMessage(false);
        setMintResponse("");
      }, 6000);
      // setAlertState({
      //   open: true,
      //   message,
      //   severity: "error",
      // });
    } finally {
      setIsUserMinting(false);
    }
  };

  const onMintWL = async (id: any, wallet_pda: any) => {
    try {
      setIsUserMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && magicHat?.program && wallet.publicKey) {
        const mintTxId: any = [];
        console.log(magicHat.id.toBase58());
        mintTxId[0] = (
          await mintOneTokenWL(magicHat, wallet.publicKey, wallet_pda)
        )[0];
        if (id >= 2) {
          mintTxId[1] = (
            await mintOneTokenWL(magicHat, wallet.publicKey, wallet_pda)
          )[0];
        }
        if (id >= 3) {
          mintTxId[2] = (
            await mintOneTokenWL(magicHat, wallet.publicKey, wallet_pda)
          )[0];
        }
        let status: any = [];
        if (mintTxId[0]) {
          status[0] = await awaitTransactionSignatureConfirmation(
            mintTxId[0],
            props.txTimeout,
            props.connection,
            true
          );
        }
        if (mintTxId[1]) {
          status[1] = await awaitTransactionSignatureConfirmation(
            mintTxId[1],
            props.txTimeout,
            props.connection,
            true
          );
        }
        if (mintTxId[2]) {
          status[2] = await awaitTransactionSignatureConfirmation(
            mintTxId[2],
            props.txTimeout,
            props.connection,
            true
          );
        }
        if (status[0] && !status[0].err && id >= 1) {
          // setAlertState({
          //   open: true,
          //   message: "Congratulations! Mint succeeded!",
          //   severity: "success",
          // });
          setMintSuccessMessage(true);
          setMintResponseType("success");
          setMintResponse("YOU'VE SHHUCCESSFULLY MINTED A HOODRAT!");
          setTimeout(function () {
            setMintSuccessMessage(true);
            setMintSuccessMessage(false);
            setMintResponseType("");
            setMintResponse("");
          }, 6000);
        } else {
          // setAlertState({
          //   open: true,
          //   message: "Mint failed! Please try again!",
          //   severity: "error",
          // });
          setMintSuccessMessage(true);
          setMintResponseType("error");
          setMintResponse("Mint failed! Please try again!");
          setTimeout(function () {
            setMintSuccessMessage(true);
            setMintSuccessMessage(false);
            setMintResponseType("");
            setMintResponse("");
          }, 6000);
        }
        if (id >= 2) {
          if (status[1] && !status[1].err) {
            // setAlertState({
            //   open: true,
            //   message: "Congratulations! Mint succeeded!",
            //   severity: "success",
            // });
            setMintSuccessMessage(true);
            setMintResponseType("success");
            setMintResponse("YOU'VE SHHUCCESSFULLY MINTED A HOODRAT!");
            setTimeout(function () {
              setMintSuccessMessage(true);
              setMintSuccessMessage(false);
              setMintResponseType("");
              setMintResponse("");
            }, 6000);
          } else {
            // setAlertState({
            //   open: true,
            //   message: "Mint failed! Please try again!",
            //   severity: "error",
            // });
            setMintSuccessMessage(true);
            setMintResponseType("error");
            setMintResponse("Mint failed! Please try again!");
            setTimeout(function () {
              setMintSuccessMessage(true);
              setMintSuccessMessage(false);
              setMintResponseType("");
              setMintResponse("");
            }, 6000);
          }
        }
        if (id >= 3) {
          if (status[2] && !status[2].err) {
            // setAlertState({
            //   open: true,
            //   message: "Congratulations! Mint succeeded!",
            //   severity: "success",
            // });
            setMintSuccessMessage(true);
            setMintResponseType("success");
            setMintResponse("YOU'VE SHHUCCESSFULLY MINTED A HOODRAT!");
            setTimeout(function () {
              setMintSuccessMessage(true);
              setMintSuccessMessage(false);
              setMintResponseType("");
              setMintResponse("");
            }, 6000);
          } else {
            // setAlertState({
            //   open: true,
            //   message: "Mint failed! Please try again!",
            //   severity: "error",
            // });
            setMintSuccessMessage(true);
            setMintResponseType("error");
            setMintResponse("Mint failed! Please try again!");
            setTimeout(function () {
              setMintSuccessMessage(true);
              setMintSuccessMessage(false);
              setMintResponseType("");
              setMintResponse("");
            }, 6000);
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      let message = error.msg || "Minting failed! Please try again!";
      if (error.InstructionError) {
        if (
          error.InstructionError[1].Custom &&
          error.InstructionError[1].Custom == 6042
        ) {
          setMintResponse("Whitelist has not started yet!!!");
        } else if (
          error.InstructionError[1].Custom &&
          error.InstructionError[1].Custom == 6043
        ) {
          setMintResponse("No whitelist spots left");
        } else if (
          error.InstructionError[1].Custom &&
          error.InstructionError[1].Custom == 2001
        ) {
          setMintResponse("Please try again later");
        }
      } else if (!error.msg) {
        if (!error.message) {
          setMintResponse("Transaction Timeout! Please try again.");
        } else if (error.message.indexOf("0x137")) {
          setMintResponse(`SOLD OUT!`);
        } else if (error.message.indexOf("0x135")) {
          setMintResponse(
            `Insufficient funds to mint. Please fund your wallet.`
          );
        }
      } else {
        if (error.code === 311) {
          setMintResponse(`SOLD OUT!`);
          window.location.reload();
        } else if (error.code === 312) {
          setMintResponse(`Minting period hasn't started yet.`);
        }
      }
      setMintResponseType("error");
      setMintSuccessMessage(true);
      setTimeout(function () {
        setMintResponseType("");
        setMintSuccessMessage(false);
        setMintResponse("");
      }, 6000);
      // setAlertState({
      //   open: true,
      //   message,
      //   severity: "error",
      // });
    } finally {
      setIsUserMinting(false);
    }
  };

  // const createVRFAccount = async () => {
  //   let payer = anchor.web3.Keypair.generate();
  //   const program = await loadSwitchboardProgram("devnet", undefined, payer);
  //   const queueAccount = new queueAccount({ program, publicKey: queueKey });
  //   const queue = await queueAccount.loadData();

  //   // load client program used for callback
  //   const vrfClientProgram = anchor.workspace
  //     .AnchorVrfParser as anchor.Program<AnchorVrfParser>;
  //   const vrfSecret = anchor.web3.Keypair.generate();

  //   const vrfIxCoder = new anchor.BorshInstructionCoder(vrfClientProgram.idl);
  //   const vrfClientCallback: Callback = {
  //     programId: vrfClientProgram.programId,
  //     accounts: [
  //       // ensure all accounts in updateResult are populated
  //       { pubkey: vrfClientKey, isSigner: false, isWritable: true },
  //       { pubkey: vrfSecret.publicKey, isSigner: false, isWritable: false },
  //     ],
  //     ixData: vrfIxCoder.encode("updateResult", ""), // pass any params for instruction here
  //   };

  //   // create VRF
  //   const vrfAccount = await VrfAccount.create(program, {
  //     queue: queueAccount,
  //     callback: vrfClientCallback,
  //     authority: vrfClientKey, // vrf authority
  //     keypair: vrfSecret,
  //   });

  //   // create permission
  //   const permissionAccount = await PermissionAccount.create(program, {
  //     authority: queue.authority,
  //     granter: queue.publicKey,
  //     grantee: vrfAccount.publicKey,
  //   });

  //   // if queue has not enabled unpermissionedVrfEnabled, queue will need to grant permission
  //   let queueAuthority: anchor.web3.Keypair;
  //   await permissionAccount.set({
  //     authority: queueAuthority,
  //     permission: SwitchboardPermission.PERMIT_VRF_REQUESTS,
  //     enable: true,
  //   });
  // }

  const openStaking = async () => {
    setShowStaking(true);
  }

  const hideStaking = async () => {
    setNftStakeStep(0);
    setStakedCity("");
    setStakedNft(null);
    setShowStakeRoom(true);
    setShowStaking(false);
  }

  let nftStakeStepCount = 0;

  const nextStepStake = async () => {
    nftStakeStepCount = nftStakeStep;
    if(nftStakeStepCount == 1) {
      nftStakeStepCount = nftStakeStepCount + 1;
      setNftStakeStep(nftStakeStepCount);
      completeStake();
    }
    else {
      if (stakedCity && stakedCity.length > 0 && nftStakeStepCount == 0) {
        nftStakeStepCount = nftStakeStepCount + 2;
        setNftStakeStep(nftStakeStepCount);
        completeStake();
      }
      else {
        nftStakeStepCount = nftStakeStepCount + 1;
        setNftStakeStep(nftStakeStepCount);
      }
    }
  }

  const closeStaking = async () => {
    setNftStakeStep(0);
    setStakedNft(null);
    setStakedCity("");
    setShowStaking(false);
  }

  const getWhitelistAccounts = async () => {
    if (
      wallet &&
      wallet.publicKey &&
      wallet.publicKey.toBase58().length > 0 &&
      !shouldMint &&
      whitelists != null
    ) {
      const whitelistAccounts = Object.keys(whitelists);
      console.log(whitelists);
      if (whitelistAccounts && whitelistAccounts.length > 0) {
        for (let index = 0; index < whitelistAccounts.length; index++) {
          const element = whitelistAccounts[index];
          if (wallet.publicKey?.toBase58() === element) {
            if (
              whitelists[element].numberOfWhitelistSpotsPerUser.toNumber() > 0
            ) {
              setShouldMint(true);
              break;
            } else {
              setShouldMint(true);
            }
          }
        }
      }
    }
  };

  const decreaseWhitelistCount = async (count: any) => {
    var obj: any = {
      wallet: wallet.publicKey?.toBase58(),
      count: count,
    };
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.parse(JSON.parse(this.responseText).data));
        setWhitelists(JSON.parse(JSON.parse(this.responseText).data));
      }
    });
    xhr.open("POST", "https://www.secretalpha.io:8000/decreaseCount");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(obj));
  };

  const getWhitelists = async () => {
    if (whitelists === null && wallet && wallet.publicKey) {
      try {
        const walletProgram = await getProgram();
        const [whitelist_pda, bump] = await PublicKey.findProgramAddress(
          [
            Buffer.from(pdaSeed),
            wallet.publicKey!.toBuffer(),
            MAGIC_HAT_CREATOR.toBuffer(),
          ],
          MAGIC_HAT_PROGRAM_V2_ID
        );
        if (!alreadyCalled) {
          setAlreadyCalled(true);
          setInterval(function () {
            getTimeToMInt();
          }, 1000);
        }

        const whitelistAccounts: any =
          await walletProgram.account.walletWhitelist.fetch(whitelist_pda);
        console.log(whitelistAccounts);
        if (whitelistAccounts) {
          let wl_type = Object.keys(whitelistAccounts.whitelistType)[0];
          if (
            wl_type &&
            (wl_type == "three" ||
              wl_type == "two" ||
              wl_type == "one" ||
              wl_type == "four")
          ) {
            let spots =
              whitelistAccounts.numberOfWhitelistSpotsPerUser.toNumber();
            if (spots == 0) {
              spots = 1;
              setMaxCount(5);
            }
            setShouldMint(true);
            setMintCount(spots);
          } else {
            setMaxCount(1);
            setMintCount(1);
          }
        } else {
          setMaxCount(1);
          setMintCount(1);
        }
        setWhitelists(whitelistAccounts);
      } catch (error) {
        setShouldMint(true);
        setMaxCount(5);
        setMintCount(1);
      }
      // var xhr = new XMLHttpRequest();
      // xhr.addEventListener("readystatechange", function () {
      //   if (this.readyState === 4) {
      //     setWhitelists(JSON.parse(this.responseText));
      //   }
      // });
      // xhr.open("GET",
      //   "https://www.secretalpha.io:8000/getInfo?wallet=" +wallet.publicKey?.toBase58()
      // );
      // xhr.setRequestHeader("Content-Type", "application/json");
      // xhr.send();
    }
  };

  const increaseMintCount = async () => {
    if (currentWl == 'GOG + OG') {
      setMaxCount(3);
    } else if (currentWl == 'WL') {
      setMaxCount(1);
    } else if(currentWl == 'PUBLIC') {
      setMaxCount(5);
    } else if(currentWl == 'COMMUNITY') {
      setMaxCount(4);
    }
    if (mintCount >= maxCount) {
    } else {
      var k = mintCount + 1;
      setMintCount(k);
    }
  };

  const decreaseMintCount = async () => {
    let l;
    if (currentWl == 'GOG + OG') {
      l = 3;
    } else if (currentWl == 'WL') {
      l = 1;
    } else if(currentWl == 'PUBLIC') {
      l = 5;
    } else if(currentWl == 'COMMUNITY') {
      l = 4;
    }
    if (mintCount <= 1) {
    } else {
      var k = mintCount - 1;
      setMintCount(k);
    }
  };

  useEffect(() => {
    // anchor.Wallet.C;
    // refreshMagicHatState();
    var elem: HTMLElement | null = document.getElementById("main");
    if (elem!.clientWidth < 480) {
      setIsMobile(true);
    }
    // console.log(currentWl);
    getWhitelists();
    setTimeout(function () {
      setClassNameState("main-bg-after-door-open");
      setLogoAlphaLoading(false);
      getWhitelistAccounts();
      getNFTs();
      getStakedNfts();
      getFarms();
      getFarmers();
      getTimeToMInt();
    }, 900);
  }, [
    anchorWallet,
    props.magicHatId,
    props.connection,
    refreshMagicHatState,
    wallet,
    whitelists,
    shouldMint,
    currentWl,
  ]);

  const showToaster = async (id: any) => {
    if (id === 1) {
      setShowMessage(true);
      setMessageText("Wonder how that binary cheese tastes like?");
      setTimeout(function () {
        setShowMessage(false);
        setMessageText("");
      }, 900);
    } else if (id === 2) {
      setShowMessage(true);
      setMessageText("Better if you let jesse handle that");
      setTimeout(function () {
        setShowMessage(false);
        setMessageText("");
      }, 900);
    } else if (id === 3) {
      setShowMessage(true);
      setMessageText("WAGShhh, hide it back again");
      setTimeout(function () {
        setShowMessage(false);
        setMessageText("");
      }, 900);
    } else if (id === 4) {
      setShowMessage(true);
      setMessageText("Holy shit this is comfy af");

      setTimeout(function () {
        setShowMessage(false);
        setMessageText("");
      }, 900);
    } else if (id === 5) {
      var arr = [
        "Patience is key",
        "Shh...",
        "Not yet, the time will come",
        "Calm down man",
        "It's locked, come back later.",
      ];
      var k = Math.floor(Math.random() * 5);
      // k = k - 1;
      setShowMessage(true);
      setMessageText(arr[k]);

      setTimeout(function () {
        setShowMessage(false);
        setMessageText("");
      }, 900);
    }
  };

  const getProgram = async () => {
    const wallet_t: any = wallet;
    const provider = new anchor.Provider(
      props.connection,
      wallet_t,
      anchor.Provider.defaultOptions()
    );
    const idl_o: any = idl;
    return new Program(idl_o, MAGIC_HAT_PROGRAM_V2_ID, provider);
  };

  const getStakeProgram = async () => {
    const wallet_t: any = wallet;
    const provider = new anchor.Provider(
      props.connection,
      wallet_t,
      anchor.Provider.defaultOptions()
    );
    const idl_o: any = idlStake;
    console.log(MAGIC_STAKE_PROGRAM_ID.toBase58())
    return new Program(idl_o, MAGIC_STAKE_PROGRAM_ID, provider);
  };

  const getBankProgram = async () => {
    const wallet_t: any = wallet;
    const provider = new anchor.Provider(
      props.connection,
      wallet_t,
      anchor.Provider.defaultOptions()
    );
    const idl_o: any = idlBank;
    return new Program(idl_o, GEM_BANK, provider);
  };

  const findFarmAuthorityPDA = async (farm: PublicKey) => {
    return PublicKey.findProgramAddress([farm.toBytes()], MAGIC_STAKE_PROGRAM_ID);
  };

  const findFarmTreasuryPDA = (farm: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('treasury'), farm.toBytes()],
      MAGIC_STAKE_PROGRAM_ID
    );
  };

  const findRewardsPotPDA = (farm: PublicKey, rewardMint: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('reward_pot'), farm.toBytes(), rewardMint.toBytes()],
      MAGIC_STAKE_PROGRAM_ID
    );
  };

  const findFarmTreasuryTokenPDA = (farm: PublicKey, rewardMint: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('token_treasury'), farm.toBytes(), rewardMint.toBytes()],
      MAGIC_STAKE_PROGRAM_ID
    );
  };

  const funderToAuthorizePDA = (farm: PublicKey, funder_to_authorize: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('authorization'), farm.toBytes(), funder_to_authorize.toBytes()],
      MAGIC_STAKE_PROGRAM_ID
    );
  };

  const farmerPDA = (farm: PublicKey, farmer: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('farmer'), farm.toBytes(), farmer.toBytes()],
      MAGIC_STAKE_PROGRAM_ID
    );
  };

  const farmerVaultPDA = (bank: PublicKey, creator: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('vault'), bank.toBytes(), creator.toBytes()],
      GEM_BANK
    );
  };

  const gemBoxPda = (vault: PublicKey, gem_mint: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('gem_box'), vault.toBytes(), gem_mint.toBytes()],
      GEM_BANK
    );
  };

  const gemDepositBoxPda = (vault: PublicKey, gem_mint: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('gem_deposit_receipt'), vault.toBytes(), gem_mint.toBytes()],
      GEM_BANK
    );
  };

  const gemBoxRarityPda = (bank: PublicKey, gem_mint: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('gem_rarity'), bank.toBytes(), gem_mint.toBytes()],
      GEM_BANK
    );
  };
  
  const vaultAuthorityPda = (valut: PublicKey) => {
    return PublicKey.findProgramAddress(
      [valut.toBytes()],
      GEM_BANK
    );
  };
  
  const whitelistProofPda = (bank: PublicKey, address_to_whitelist: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('whitelist'),bank.toBytes(), address_to_whitelist.toBytes()],
      GEM_BANK
    );
  };

  const tokenMetadataPda = (mint: PublicKey) => {
    return PublicKey.findProgramAddress(
      [Buffer.from('metadata'),TOKEN_METADATA_PROGRAM_ID.toBytes(), mint.toBytes()],
      TOKEN_METADATA_PROGRAM_ID
    );
  };

  async function getTokensByOwner(owner: any) {
    let conn:any = props.connection;
    const tokens = await conn.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    });
  
    // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
    return tokens.value
      .filter((t:any) => {
        const amount = t.account.data.parsed.info.tokenAmount;
        return amount.decimals === 0 && amount.uiAmount === 1;
      })
      .map((t:any) => {
        return { pubkey: t.pubkey, mint: t.account.data.parsed.info.mint };
      });
  }

  async function getTokensByOwnerAll(owner: any) {
    let conn:any = props.connection;
    const tokens = await conn.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    });
    console.log(tokens);
  }

  async function getStakedNfts() {
    if (wallet && wallet.connected) {
      const bankProgram = await getBankProgram();
      const stakeProgram = await getStakeProgram();
      const farms:any = await stakeProgram.account.farm.fetch(FARM_ID);
      // const [farmerVaultPda] = await farmerVaultPDA(
      //   farms.bank,
      //   wallet.publicKey!
      // );
      const gdprs:any = await bankProgram.account.gemDepositReceipt.all();
      // console.log(gdprs);
      var array:any = [];
      for (let index = 0; index < gdprs.length; index++) {
        const element = gdprs[index];
        let tokenmetaPubkey = await programs.metadata.Metadata.getPDA(element.account.gemMint);
        const tokenmeta = await programs.metadata.Metadata.load(props.connection, tokenmetaPubkey);
        if (tokenmeta.data.updateAuthority == "2LpGioZAG2GkzBpTye4e3jqQWiEL7mFBo74B6yvCmTaw" && tokenmeta!.data!.data!.creators![0].address == "BNZy4DXcGZRpkkgnQn5nfqnkMPjjh7NLk1KBTe8qqtmZ") {
          var xhr = new XMLHttpRequest();
          xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
              var obj:any = {
                name: tokenmeta.data.data.name,
                link: JSON.parse(this.responseText).image,
              }
              // console.log(obj);
              array.push(obj);
            }
          });
          xhr.open("GET", tokenmeta.data.data.uri);
          xhr.send();
        }
      }
      if (array && array.length > 0) {
        setStakedNfts(array);
        // setStakedTokens(array.length * 100);
        // setRespectEarned(array.length * 100);
        // setMultiplierLevel(array.length);
      }
    }
  }

  const findAssociatedTokenAddress = async(walletAddress: PublicKey, tokenMintAddress: PublicKey) => {
    return (await PublicKey.findProgramAddress([
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    ))[0];
  }

  // Farm Manager Should call this
  const initFixedFarm = async (id:any) => {
    // getFarms();
    const stakeProgram = await getStakeProgram();
    try {
      const farm = anchor.web3.Keypair.generate();
      const bank = anchor.web3.Keypair.generate();
      const [farmAuth, farmAuthBump] = await findFarmAuthorityPDA(farm.publicKey);
      const [farmTreasury, farmTreasuryBump] = await findFarmTreasuryPDA(
        farm.publicKey
      );
      const [rewardAPot, rewardAPotBump] = await findRewardsPotPDA(
        farm.publicKey,
        REWARD_MINT
      );
      const [farmTreasuryToken, farmTreasuryTokenBump] = await findFarmTreasuryTokenPDA(
        farm.publicKey,
        REWARD_MINT
      );
      const farm_config:FarmConfig = {
        minStakingPeriodSec: new BN(600),
        cooldownPeriodSec: new BN(600),
        unstakingFeePercent: new BN(5)
      }
      const max_counts:MaxCounts = {
        maxFarmers: Number(4200),
        maxGems: Number(4200),
        maxRarityPoints: Number(65000)
      }
      // console.log(farm.publicKey.toBase58());
      // console.log(bank.publicKey.toBase58());
      const signers = [farm, bank];
      // let config_t:any = Borsh.struct(JSON.stringify(config));
      const wallet_create = await stakeProgram.rpc.initFixedFarm(farmAuthBump,farmTreasuryBump,LPType.RESPECT,farm_config,max_counts,
        {
          accounts: {
            farm: farm.publicKey,
            farmManager: wallet.publicKey,
            farmAuthority: farmAuth,
            rewardAPot: rewardAPot,
            rewardAMint: REWARD_MINT,
            farmTreasuryToken: farmTreasuryToken,
            bank: bank.publicKey,
            gemBank: GEM_BANK,
            payer: wallet.publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          },
          signers: signers
        }
      );
      let farm_str = '';
      if(id == 1) {
        farm_str = 'MAHANOTHIA';
      }
      else if(id == 4) {
        farm_str = 'MAGNEXIA';
      }
      else if(id == 5) {
        farm_str = 'THE BASEMENT';
      }
      setAlertState({
        open: true,
        message: farm_str + "Farm has been created successfully at " + farm.publicKey.toBase58() + "\nPlease copy this id into the config file.",
        severity: "success",
      });
      // const whitelistConfigAccounts = await stakeProgram.account.farm.fetch(farm.publicKey);
      // console.log(whitelistConfigAccounts);
      console.log('init farm signature : ' + wallet_create);
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  // Farm Manager Should call this
  const initProbableFarm = async (id:any) => {
    // getFarms();
    const stakeProgram = await getStakeProgram();
    try {
      const farm = anchor.web3.Keypair.generate();
      const bank = anchor.web3.Keypair.generate();
      const [farmAuth, farmAuthBump] = await findFarmAuthorityPDA(farm.publicKey);
      const [farmTreasury, farmTreasuryBump] = await findFarmTreasuryPDA(
        farm.publicKey
      );
      const [rewardAPot, rewardAPotBump] = await findRewardsPotPDA(
        farm.publicKey,
        REWARD_MINT
      );
      const [farmTreasuryToken, farmTreasuryTokenBump] = await findFarmTreasuryTokenPDA(
        farm.publicKey,
        REWARD_MINT
      );
      const farm_config:FarmConfig = {
        minStakingPeriodSec: new BN(600),
        cooldownPeriodSec: new BN(600),
        unstakingFeePercent: new BN(5)
      }
      const max_counts:MaxCounts = {
        maxFarmers: Number(4200),
        maxGems: Number(4200),
        maxRarityPoints: Number(65000)
      }
      // console.log(farm.publicKey.toBase58());
      // console.log(bank.publicKey.toBase58());
      const signers = [farm, bank];
      // let config_t:any = Borsh.struct(JSON.stringify(config));
      const wallet_create = await stakeProgram.rpc.initProbableFarm(farmAuthBump,farmTreasuryBump,LPType.RESPECT,farm_config,max_counts,
        {
          accounts: {
            farm: farm.publicKey,
            farmManager: wallet.publicKey,
            farmAuthority: farmAuth,
            rewardAPot: rewardAPot,
            rewardAMint: REWARD_MINT,
            farmTreasuryToken: farmTreasuryToken,
            bank: bank.publicKey,
            gemBank: GEM_BANK,
            payer: wallet.publicKey,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          },
          signers: signers
        }
      );
      let farm_str = '';
      if(id == 2) {
        farm_str = 'RAUDCHERI';
      }
      else if(id == 3) {
        farm_str = 'SAN CHETOS';
      }
      setAlertState({
        open: true,
        message: farm_str + "Farm has been created successfully at " + farm.publicKey.toBase58() + "\nPlease copy this id into the config file.",
        severity: "success",
      });
      // const whitelistConfigAccounts = await stakeProgram.account.farm.fetch(farm.publicKey);
      // console.log(whitelistConfigAccounts);
      console.log('init farm signature : ' + wallet_create);
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }


  const closeFarming = async () => {
    setShowFarming(false);
    setFunderOne('');
    setFunderTwo('');
    setFunderThree('');
    setFunderFour('');
    setFunderFive('');
  }

  // Farm Manager should call this
  const authorizeFunder = async (id:any) => {
    let funder_var = '';
    let farm_id:any;
    if (id == 1) {
      funder_var = funderOne;
      farm_id = MAHANOTHIA_FARM_ID;
    }
    else if (id == 2) {
      funder_var = funderTwo;
      farm_id = RAUDCHERI_FARM_ID;
    }
    else if (id == 3) {
      funder_var = funderThree;
      farm_id = SAN_CHETOS_FARM_ID;
    }
    else if (id == 4) {
      funder_var = funderFour;
      farm_id = MAGNEXIA_FARM_ID;
    }
    else if (id == 5) {
      funder_var = funderFive;
      farm_id = BASEMENT_FARM_ID;
    }
    if (funder_var && funder_var.length > 0) {
      try {
        const funder_to_authorize = new PublicKey(funder_var);
        if (funder_to_authorize) {
          const stakeProgram = await getStakeProgram();
          try {
            const [authorizationProof] = await funderToAuthorizePDA(
              farm_id,
              funder_to_authorize
            );
            console.log(authorizationProof.toBase58());
            const farms = await stakeProgram.account.farm.fetch(farm_id);
            console.log('farm with ' + farm_id.toBase58() + ' ' + farms);
            console.log(farms);
            const wallet_create = await stakeProgram.rpc.authorizeFunder(
              {
                accounts: {
                  farm: farm_id,
                  farmManager: wallet.publicKey,
                  funderToAuthorize: funder_to_authorize,
                  authorizationProof: authorizationProof,
                  systemProgram: SystemProgram.programId,
                }
              }
            );
            setAlertState({
              open: true,
              message: "Funder has been authorized successfully",
              severity: "success",
            });
            console.log('authorize funder signature : ' + wallet_create);
            setFunderOne('');
            setFunderTwo('');
            setFunderThree('');
            setFunderFour('');
            setFunderFive('');
          } catch (error) {
            console.log("Transaction error: ", error);
          }
        }
        else {
          setAlertState({
            open: true,
            message: "Funder is not a valid public key",
            severity: "error",
          });
        }
      } catch (error) {
        setAlertState({
          open: true,
          message: "Funder is not a valid public key",
          severity: "error",
        });
      }
    }
    else {
      setAlertState({
        open: true,
        message: "Funder is empty",
        severity: "error",
      });
    }
  }

  // funder to authorize should call this
  const fundReward = async (id:any) => {
    const stakeProgram = await getStakeProgram();
    try {
      let farm_id:any;
      if (id == 1) {
        farm_id = MAHANOTHIA_FARM_ID;
      }
      else if (id == 2) {
        farm_id = RAUDCHERI_FARM_ID;
      }
      else if (id == 3) {
        farm_id = SAN_CHETOS_FARM_ID;
      }
      else if (id == 4) {
        farm_id = MAGNEXIA_FARM_ID;
      }
      else if (id == 5) {
        farm_id = BASEMENT_FARM_ID;
      }
      const [rewardAPot, rewardAPotBump] = await findRewardsPotPDA(
        farm_id,
        REWARD_MINT
      );
      // const funder_to_authorize = new PublicKey("4QrQYy1MVK6xBKAQKbvX3TjznnhU3vZfvaAbKJ9ZNjS4");
      const [authorizationProof, authorizationProofBump] = await funderToAuthorizePDA(
        farm_id,
        wallet.publicKey!
      );
      console.log(authorizationProof.toBase58());
      const rewardSource = await findAssociatedTokenAddress(wallet.publicKey!,REWARD_MINT);
      console.log(rewardSource.toBase58());
      // const rewardSource = new PublicKey("511ZCh4sKsZhAtytqiVheeK2KZK6Tr96S8sTabudL2aT");
      const farms = await stakeProgram.account.farm.fetch(farm_id);
      console.log('farm with ' + farm_id.toBase58() + ' ' + farms);
      console.log(farms);
      // tier1: t1RewardRate
          //   ? {
          //       rewardRate: new BN(t1RewardRate),
          //       requiredTenure: new BN(t1RequiredTenure!),
          //     }
          //   : null,
          // tier2: t2RewardRate
          //   ? {
          //       rewardRate: new BN(t2RewardRate),
          //       requiredTenure: new BN(t2RequiredTenure!),
          //     }
          //   : null,
          // tier3: t3RewardRate
          //   ? {
          //       rewardRate: new BN(t3RewardRate),
          //       requiredTenure: new BN(t3RequiredTenure!),
          //     }
          //   : null,
      const fixedrateConfigMahanothia: FixedRateConfig = {
        schedule: {
          baseRate: new BN(10),
          tier1: null,
          tier2:null,
          tier3:null,
          denominator: new BN(600)
        },
        amount: new BN(4.2 * 1000000 * 1000000),
        durationSec: new BN(8640000),
      };
      const fixedrateConfigMagnexia: FixedRateConfig = {
        schedule: {
          baseRate: new BN(6),
          tier1: null,
          tier2:null,
          tier3:null,
          denominator: new BN(600)
        },
        amount: new BN(2.52 * 1000000 * 1000000),
        durationSec: new BN(8640000),
      };
      const fixedrateConfigBasement: FixedRateConfig = {
        schedule: {
          baseRate: new BN(0),
          tier1: null,
          tier2:null,
          tier3:null,
          denominator: new BN(600)
        },
        amount: new BN(0),
        durationSec: new BN(8640000),
      };
      const lpRateConfigMahanothia: LpRateConfig = {
        lpSchedule: {
          lpBaseRate: new BN(100),
          lpTier1: null,
          lpTier2:null,
          lpTier3:null,
          lpDenominator: new BN(600)
        },
        lpDurationSec: new BN(8640000),
      };
      const lpRateConfigRaudcheri: LpRateConfig = {
        lpSchedule: {
          lpBaseRate: new BN(100),
          lpTier1: null,
          lpTier2:null,
          lpTier3:null,
          lpDenominator: new BN(600)
        },
        lpDurationSec: new BN(8640000),
      };
      const lpRateConfigSanChetos: LpRateConfig = {
        lpSchedule: {
          lpBaseRate: new BN(100),
          lpTier1: null,
          lpTier2:null,
          lpTier3:null,
          lpDenominator: new BN(600)
        },
        lpDurationSec: new BN(8640000),
      };
      const lpRateConfigMagnexia: LpRateConfig = {
        lpSchedule: {
          lpBaseRate: new BN(200),
          lpTier1: null,
          lpTier2:null,
          lpTier3:null,
          lpDenominator: new BN(600)
        },
        lpDurationSec: new BN(8640000),
      };
      const lpRateConfigBasement: LpRateConfig = {
        lpSchedule: {
          lpBaseRate: new BN(420),
          lpTier1: null,
          lpTier2:null,
          lpTier3:null,
          lpDenominator: new BN(600)
        },
        lpDurationSec: new BN(8640000),
      };
      const prob1Config: ProbTierConfig = {
        probableRewardRate: new BN(1),
        probability: new BN(1)
      }
      const probConfigFixed: ProbableRateConfig = {
        probableSchedule: {
          prob1:null,
          prob2:null,
          prob3:null,
          prob4:null,
          prob5:null,
          denominator: new BN(1)
        },
        probableAmount: new BN(4.2 * 1000000 * 1000000),
        probableDurationSec: new BN(8640000),
      };
      const prob1ConfigRaudcheri: ProbTierConfig = {
        probableRewardRate: new BN(40),
        probability: new BN(5)
      }
      const prob2ConfigRaudcheri: ProbTierConfig = {
        probableRewardRate: new BN(20),
        probability: new BN(20)
      }
      const prob3ConfigRaudcheri: ProbTierConfig = {
        probableRewardRate: new BN(6),
        probability: new BN(25)
      }
      const prob4ConfigRaudcheri: ProbTierConfig = {
        probableRewardRate: new BN(5),
        probability: new BN(50)
      }
      const prob1ConfigSanChetos: ProbTierConfig = {
        probableRewardRate: new BN(100),
        probability: new BN(2)
      }
      const prob2ConfigSanChetos: ProbTierConfig = {
        probableRewardRate: new BN(50),
        probability: new BN(5)
      }
      const prob3ConfigSanChetos: ProbTierConfig = {
        probableRewardRate: new BN(25),
        probability: new BN(10)
      }
      const prob4ConfigSanChetos: ProbTierConfig = {
        probableRewardRate: new BN(15),
        probability: new BN(20)
      }
      const prob5ConfigSanChetos: ProbTierConfig = {
        probableRewardRate: new BN(0),
        probability: new BN(50)
      }
      const probConfigRaudcheri: ProbableRateConfig = {
        probableSchedule: {
          prob1:prob1ConfigRaudcheri,
          prob2:prob2ConfigRaudcheri,
          prob3:prob3ConfigRaudcheri,
          prob4:prob4ConfigRaudcheri,
          prob5:null,
          denominator: new BN(1)
        },
        probableAmount: new BN(4.2 * 1000000 * 1000000),
        probableDurationSec: new BN(8640000),
      };
      const probConfigSanChetos: ProbableRateConfig = {
        probableSchedule: {
          prob1:prob1ConfigSanChetos,
          prob2:prob2ConfigSanChetos,
          prob3:prob3ConfigSanChetos,
          prob4:prob4ConfigSanChetos,
          prob5:prob5ConfigSanChetos,
          denominator: new BN(1)
        },
        probableAmount: new BN(4.2 * 1000000 * 1000000),
        probableDurationSec: new BN(8640000),
      };
      if (id == 1) {
        const wallet_create = await stakeProgram.rpc.fundReward(authorizationProofBump, rewardAPotBump, fixedrateConfigMahanothia, probConfigFixed,lpRateConfigMahanothia,
          {
            accounts: {
              farm: MAHANOTHIA_FARM_ID,
              authorizationProof: authorizationProof,
              authorizedFunder: wallet.publicKey,
              rewardPot: rewardAPot,
              rewardSource: rewardSource,
              rewardMint: REWARD_MINT,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            }
          }
        );
        console.log('fund reward signature : ' + wallet_create);
      }
      else if (id == 4) {
        const wallet_create = await stakeProgram.rpc.fundReward(authorizationProofBump, rewardAPotBump, fixedrateConfigMagnexia, probConfigFixed,lpRateConfigMagnexia,
          {
            accounts: {
              farm: MAGNEXIA_FARM_ID,
              authorizationProof: authorizationProof,
              authorizedFunder: wallet.publicKey,
              rewardPot: rewardAPot,
              rewardSource: rewardSource,
              rewardMint: REWARD_MINT,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            }
          }
        );
        console.log('fund reward signature : ' + wallet_create);
      }
      else if (id == 5) {
        const wallet_create = await stakeProgram.rpc.fundReward(authorizationProofBump, rewardAPotBump, fixedrateConfigBasement, probConfigFixed,lpRateConfigBasement,
          {
            accounts: {
              farm: BASEMENT_FARM_ID,
              authorizationProof: authorizationProof,
              authorizedFunder: wallet.publicKey,
              rewardPot: rewardAPot,
              rewardSource: rewardSource,
              rewardMint: REWARD_MINT,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            }
          }
        );
        console.log('fund reward signature : ' + wallet_create);
      }
      else if (id == 2) {
        const wallet_create = await stakeProgram.rpc.fundReward(authorizationProofBump, rewardAPotBump, fixedrateConfigBasement, probConfigRaudcheri,lpRateConfigRaudcheri,
          {
            accounts: {
              farm: RAUDCHERI_FARM_ID,
              authorizationProof: authorizationProof,
              authorizedFunder: wallet.publicKey,
              rewardPot: rewardAPot,
              rewardSource: rewardSource,
              rewardMint: REWARD_MINT,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            }
          }
        );
        console.log('fund reward signature : ' + wallet_create);
      }
      else if (id == 3) {
        const wallet_create = await stakeProgram.rpc.fundReward(authorizationProofBump, rewardAPotBump, fixedrateConfigBasement, probConfigSanChetos,lpRateConfigSanChetos,
          {
            accounts: {
              farm: SAN_CHETOS_FARM_ID,
              authorizationProof: authorizationProof,
              authorizedFunder: wallet.publicKey,
              rewardPot: rewardAPot,
              rewardSource: rewardSource,
              rewardMint: REWARD_MINT,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            }
          }
        );
        console.log('fund reward signature : ' + wallet_create);
      }
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  const getFarmers = async () => {
    if(wallet && wallet.connected) {
      const stakeProgram = await getStakeProgram();
      try {
        const [mahanothiaFarmerVar] = await farmerPDA(
          MAHANOTHIA_FARM_ID,
          wallet.publicKey!
        );
        const farmersMahanothia:any = await stakeProgram.account.farmer.fetch(mahanothiaFarmerVar);
        if (farmersMahanothia != null) {
          console.log('Farmer ');
          console.log(farmersMahanothia);
          setStakedTokens(farmersMahanothia.gemsStaked!.toNumber());
          setRespectEarned(farmersMahanothia.lpPoints.lpAccrued.toNumber());
          setMultiplierLevel(farmersMahanothia.lpPoints.lpLevel.toNumber());
          setFarmerMahanothia(farmersMahanothia);
        }
      } catch (error) {
        setStakedTokens(0);
        setRespectEarned(0);
        setMultiplierLevel(0);
        setFarmerMahanothia(null);
      }
      
      try {
        const [raudcheriFarmerVar] = await farmerPDA(
          RAUDCHERI_FARM_ID,
          wallet.publicKey!
        );
        const farmersRaudcheri:any = await stakeProgram.account.farmer.fetch(raudcheriFarmerVar);
        if (farmersRaudcheri != null) {
          console.log('Farmer ');
          console.log(farmersRaudcheri);
          setStakedTokens(farmersRaudcheri.gemsStaked!.toNumber());
          setRespectEarned(farmersRaudcheri.lpPoints.lpAccrued.toNumber());
          setMultiplierLevel(farmersRaudcheri.lpPoints.lpLevel.toNumber());
          setFarmerRaudcheri(farmersRaudcheri);
        }
      } catch (error) {
        setStakedTokens(0);
        setRespectEarned(0);
        setMultiplierLevel(0);
        setFarmerRaudcheri(null);
      }

      try {
        const [sanChetosFarmerVar] = await farmerPDA(
          SAN_CHETOS_FARM_ID,
          wallet.publicKey!
        );
        const farmersSanChetos:any = await stakeProgram.account.farmer.fetch(sanChetosFarmerVar);
        if (farmersSanChetos != null) {
          console.log('Farmer ');
          console.log(farmersSanChetos);
          setStakedTokens(farmersSanChetos.gemsStaked!.toNumber());
          setRespectEarned(farmersSanChetos.lpPoints.lpAccrued.toNumber());
          setMultiplierLevel(farmersSanChetos.lpPoints.lpLevel.toNumber());
          setFarmerSanChetos(farmersSanChetos);
        }
      } catch (error) {
        setStakedTokens(0);
        setRespectEarned(0);
        setMultiplierLevel(0);
        setFarmerSanChetos(null);
      }
      
      try {
        const [magnexiaFarmerVar] = await farmerPDA(
          MAGNEXIA_FARM_ID,
          wallet.publicKey!
        );
        const farmersMagnexia:any = await stakeProgram.account.farmer.fetch(magnexiaFarmerVar);
        if (farmersMagnexia != null) {
          console.log('Farmer ');
          console.log(farmersMagnexia);
          setStakedTokens(farmersMagnexia.gemsStaked!.toNumber());
          setRespectEarned(farmersMagnexia.lpPoints.lpAccrued.toNumber());
          setMultiplierLevel(farmersMagnexia.lpPoints.lpLevel.toNumber());
          setFarmerMagnexia(farmersMagnexia);
        }
      } catch (error) {
        setStakedTokens(0);
        setRespectEarned(0);
        setMultiplierLevel(0);
        setFarmerMagnexia(null);
      }

      try {
        const [basementFarmerVar] = await farmerPDA(
          BASEMENT_FARM_ID,
          wallet.publicKey!
        );
        const farmersBasement:any = await stakeProgram.account.farmer.fetch(basementFarmerVar);
        if (farmersBasement != null) {
          console.log('Farmer ');
          console.log(farmersBasement);
          setStakedTokens(farmersBasement.gemsStaked!.toNumber());
          setRespectEarned(farmersBasement.lpPoints.lpAccrued.toNumber());
          setMultiplierLevel(farmersBasement.lpPoints.lpLevel.toNumber());
          setFarmerBasement(farmersBasement);
        }
      } catch (error) {
        setStakedTokens(0);
        setRespectEarned(0);
        setMultiplierLevel(0);
        setFarmerBasement(null);
      }
    }
  }

  const getFarms = async () => {
    if(wallet && wallet.connected) {
      const stakeProgram = await getStakeProgram();
      try {
        const mahanothiaFarmVar:any = await stakeProgram.account.farm.fetch(MAHANOTHIA_FARM_ID);
        console.log('Mahanothia Farm ');
        console.log(mahanothiaFarmVar);
        setMahanothiaFarm(mahanothiaFarmVar);
      } catch (error) {
        setMahanothiaFarm(null);
      }
      try {
        const raudcheriFarmVar:any = await stakeProgram.account.farm.fetch(RAUDCHERI_FARM_ID);
        console.log('Raudcheri Farm ');
        console.log(raudcheriFarmVar);
        setRaudcheriFarm(raudcheriFarmVar);
      } catch (error) {
        setRaudcheriFarm(null);
      }
      try {
        const sanChetosFarmVar:any = await stakeProgram.account.farm.fetch(SAN_CHETOS_FARM_ID);
        console.log('San Chetos Farm ');
        console.log(sanChetosFarmVar);
        setsanChetosFarm(sanChetosFarmVar);
      } catch (error) {
        setsanChetosFarm(null);
      }
      try {
        const magnexiaFarmVar:any = await stakeProgram.account.farm.fetch(MAGNEXIA_FARM_ID);
        console.log('Magnexia Farm ');
        console.log(magnexiaFarmVar);
        setMagnexiaFarm(magnexiaFarmVar);
      } catch (error) {
        setMagnexiaFarm(null);
      }
      try {
        const basementFarmVar:any = await stakeProgram.account.farm.fetch(BASEMENT_FARM_ID);
        console.log('Basemnet Farm ');
        console.log(basementFarmVar);
        setBasementFarm(basementFarmVar);
      } catch (error) {
        setBasementFarm(null);
      }
    }
  }

  const getNFTs = async () => {
    // const connectionMetaplex = new Connection(
    //   "https://api.metaplex.solana.com",
    //   "confirmed"
    // );
    // const metadata:any = Metadata;
    // // const walletAddress = "6vRx1iVZo3xfrBHdpvuwArL2jucVj9j9nLpd2VUTTGMG"
    // const nftsmetadata = await metadata.findDataByOwner(connectionMetaplex, wallet.publicKey?.toBase58());
    // console.log(nftsmetadata);
    // const connection = new Connection(clusterApiUrl("devnet"));
    // const wallet = anchor.web3.Keypair.generate();

    // const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));
    // const myNfts = await metaplex.nfts().findAllByOwner(wallet.publicKey);
    // console.log(myNfts);
    // const nftsmetadata = await Metadata.findDataByOwner(props.connection, wallet.publicKey);
    // console.log(nftsmetadata)
    setCollectionId(COLLECTION_ID);
    if (wallet && wallet.connected && !gotNfts) {
      const wallet_t:any = wallet;
      const connect = createConnectionConfig(clusterApiUrl("devnet"));
      const provider = new anchor.Provider(
        props.connection,
        wallet_t,
        anchor.Provider.defaultOptions()
      );
      // const provider = getProvider();
      let ownerToken = wallet_t.publicKey;
      const result = isValidSolanaAddress(ownerToken);
      console.log("result", result);
      const allNfts = await getParsedNftAccountsByOwner({
        publicAddress: ownerToken,
        connection: connect,
        // serialization: true,
      });
      let temp_nfts:any = [];
      // console.log(allNfts);
      for (let index = 0; index < allNfts.length; index++) {
        const nft = allNfts[index];
        var creators = nft.data.creators;
        var is_ours = false;
        if (nft.updateAuthority == "2LpGioZAG2GkzBpTye4e3jqQWiEL7mFBo74B6yvCmTaw") {
          is_ours = true;
          for (let iindex = 0; iindex < creators.length; iindex++) {
            const element = creators[iindex];
            if (element.share == 0) {
              // setCollectionId(element.address);
            }
          }
        }
        if (is_ours) {
          var xhr = new XMLHttpRequest();
          xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
              // console.log(this.responseText);
              var obj:any = {
                id:temp_nfts.length,
                name: nft.data.name,
                link: JSON.parse(this.responseText).image,
                mint: nft.mint,
                updateAuthority: nft.updateAuthority,
                creator: nft.data.creators[0].address
              }
              temp_nfts.push(obj);
              setNFts(temp_nfts!);
              // console.log(allNfts);
            }
          });
          xhr.open("GET", nft.data.uri);
          xhr.send();
        }
      }
      // console.log(temp_nfts);
      setGotNfts(true);
    }
  }

  // Farmer should call this
  const initFixedFarmerInst = async (id:any,stake_instructions:any, stakeProgram:any) => {
    let farm_id:any;
    if (id == 1) {
      farm_id = MAHANOTHIA_FARM_ID;
    }
    else if (id == 4) {
      farm_id = MAGNEXIA_FARM_ID;
    }
    else if (id == 5) {
      farm_id = BASEMENT_FARM_ID;
    }
    if (id == 1) {
      const [farmerPda] = await farmerPDA(
        farm_id,
        wallet.publicKey!
      );
      const farms:any =
        await stakeProgram.account.farm.fetch(farm_id);
      console.log('farm with ' + farm_id.toBase58());
      const [farmerVaultPda] = await farmerVaultPDA(
        farms.bank,
        wallet.publicKey!
      );
      stake_instructions.push(stakeProgram.instruction.initFixedFarmer(
        {
          accounts: {
            farm: farm_id,
            farmer: farmerPda,
            identity: wallet.publicKey,
            bank: farms.bank,
            vault: farmerVaultPda,
            gemBank: GEM_BANK,
            payer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          }
        }
      ));
      return stake_instructions;
    }
    else if (id == 2) {
      const [farmerPda] = await farmerPDA(
        FARM_ID,
        wallet.publicKey!
      );
      const farms:any =
        await stakeProgram.account.farm.fetch(FARM_ID);
      console.log('farm with ' + FARM_ID.toBase58());
      const [farmerVaultPda] = await farmerVaultPDA(
        farms.bank,
        wallet.publicKey!
      );
      stake_instructions.push(stakeProgram.instruction.initFixedFarmer(
        {
          accounts: {
            farm: FARM_ID,
            farmer: farmerPda,
            identity: wallet.publicKey,
            bank: farms.bank,
            vault: farmerVaultPda,
            gemBank: GEM_BANK,
            payer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          }
        }
      ));
      return stake_instructions;
    }
  }

  // Farmer should call this
  const initProbableFarmerInst = async (id:any,stake_instructions:any, stakeProgram:any) => {
    let farm_id:any;
    if (id == 2) {
      farm_id = RAUDCHERI_FARM_ID;
    }
    else if (id == 3) {
      farm_id = SAN_CHETOS_FARM_ID;
    }
    const farmers =await stakeProgram.account.farmer.all();
    // console.log(farmers);
    try {
      const [farmerPda] = await farmerPDA(
        farm_id,
        wallet.publicKey!
      );
      const farms:any =
        await stakeProgram.account.farm.fetch(farm_id);
      console.log('farm with ' + farm_id.toBase58());
      const [farmerVaultPda] = await farmerVaultPDA(
        farms.bank,
        wallet.publicKey!
      );
      // console.log(JSON.parse(farms).bank);
      stake_instructions.push(await stakeProgram.rpc.initProbableFarmer(
        {
          accounts: {
            farm: farm_id,
            farmer: farmerPda,
            identity: wallet.publicKey,
            bank: farms.bank,
            vault: farmerVaultPda,
            gemBank: GEM_BANK,
            payer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          }
        }
      ));
      return stake_instructions;
    } catch (error) {
      return stake_instructions;
      console.log("Transaction error: ", error);
    }
  }

  // Farmer should call this
  const refreshFarmers = async () => {
    const stakeProgram = await getStakeProgram();
    const farmers = await stakeProgram.account.farmer.all();
    console.log(farmers);
    try {

      const [farmerPda, farmerBump] = await farmerPDA(
        FARM_ID,
        wallet.publicKey!
      );
      const farms:any = await stakeProgram.account.farm.fetch(FARM_ID);
      console.log('farm with ' + FARM_ID.toBase58());
      const wallet_create = await stakeProgram.rpc.refreshFarmer(farmerBump,
        {
          accounts: {
            farm: FARM_ID,
            farmer: farmerPda,
            identity: wallet.publicKey
          }
        }
      );
      getFarmers();
      console.log('refresh farmer signature : ' + wallet_create);
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  // Farmer should call this
  const refreshFarmerSigned = async () => {
    const stakeProgram = await getStakeProgram();
    const farmers = await stakeProgram.account.farmer.all();
    console.log(farmers);
    try {
      const [farmerPda, farmerBump] = await farmerPDA(
        FARM_ID,
        wallet.publicKey!
      );
      const farms:any =
        await stakeProgram.account.farm.fetch(FARM_ID);
      console.log('farm with ' + FARM_ID.toBase58());
      const wallet_create = await stakeProgram.rpc.refreshFarmerSigned(farmerBump,true,
        {
          accounts: {
            farm: FARM_ID,
            farmer: farmerPda,
            identity: wallet.publicKey
          }
        }
      );
      getFarmers();
      console.log('refresh farmer signed signature : ' + wallet_create);
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  // Farm Manager should call this
  const addRaritiesToBank = async () => {
    if (nftMint && nftMint.length > 0) {
      const nft_mint = new PublicKey(nftMint);
      try {
        const stakeProgram = await getStakeProgram();
        const farmers = await stakeProgram.account.farmer.all();
        console.log(farmers);
        try {
          const [farmerPda, farmerBump] = await farmerPDA(
            FARM_ID,
            wallet.publicKey!
          );
          let nft;
          if (stakedNft) {
            nft = stakedNft;
          }
          else {
            nft = nfts[0];
          }
          const [farmAuth, farmAuthBump] = await findFarmAuthorityPDA(FARM_ID);
          const farms:any = await stakeProgram.account.farm.fetch(FARM_ID);
          console.log('farm with ' + FARM_ID.toBase58());
          const rarityConfig: RarityConfig = {
            mint: nft_mint,
            rarityPoints: new BN(1)
          }
          const rarityConfigs = [rarityConfig];
          const remainingAccounts = [];
          const [gemRarity] = await gemBoxRarityPda(farms.bank, nft_mint);
          //add mint
          remainingAccounts.push({
            pubkey: nft_mint,
            isWritable: false,
            isSigner: false,
          });
          //add rarity pda
          remainingAccounts.push({
            pubkey: gemRarity,
            isWritable: true,
            isSigner: false,
          });
          const wallet_create = await stakeProgram.rpc.addRaritiesToBank(farmAuthBump,rarityConfigs,
            {
              accounts: {
                farm: FARM_ID,
                farmManager: farms.farmManager,
                farmAuthority: farmAuth,
                bank: farms.bank,
                gemBank: GEM_BANK,
                farmer: farmerPda,
                systemProgram: SystemProgram.programId
              },
              remainingAccounts
            }
          );
          getFarmers();
          setAlertState({
            open: true,
            message: "Rarities has been added to the NFT",
            severity: "success",
          });
          console.log('add rarities to bank signature : ' + wallet_create);
        } catch (error) {
          console.log("Transaction error: ", error);
        }
      } catch (error) {
        setAlertState({
          open: true,
          message: "NFT Mint is not a valid Public key",
          severity: "error",
        });
      }
    }
    else {
      setAlertState({
        open: true,
        message: "NFT Mint is empty",
        severity: "error",
      });
    }
  }

  // Complete Staking NFT
  const completeStake = async () => {
    // let tokens = await getStakedNfts();
    var add_init_mahanothia = true;
    var add_init_raudcheri = true;
    var add_init_san_chetos = true;
    var add_init_magnexia = true;
    var add_init_basement = true;
    if (farmerMahanothia! != null) {
      add_init_mahanothia = false;
    }
    else if (farmerRaudcheri! != null) {
      add_init_raudcheri = false;
    }
    else if (farmerSanChetos! != null) {
      add_init_san_chetos = false;
    }
    else if (farmerMagnexia! != null) {
      add_init_magnexia = false;
    }
    else if (farmerBasement! != null) {
      add_init_basement = false;
    }
    if (stakedNft) {
      if (stakedCity) {
        let farm_id:any;
        if (stakedCity == 'MAHANOTHIA') {
          farm_id = MAHANOTHIA_FARM_ID;
        }
        else if (stakedCity == 'THE BASEMENT') {
          farm_id = BASEMENT_FARM_ID;
        }
        else if (stakedCity == 'SAN CHETOS') {
          farm_id = SAN_CHETOS_FARM_ID;
        }
        else if (stakedCity == 'RAUDCHERI') {
          farm_id = RAUDCHERI_FARM_ID;
        }
        else if (stakedCity == 'MAGNEXIA') {
          farm_id = MAGNEXIA_FARM_ID;
        }
        let stake_instructions:any = [];
        const stakeProgram:any = await getStakeProgram();
        const bankProgram = await getBankProgram();
        let tokens = await getTokensByOwner(wallet.publicKey!);
        const farmers = await stakeProgram.account.farmer.all();
        if (add_init_mahanothia && stakedCity == 'MAHANOTHIA') {
          stake_instructions = initFixedFarmerInst(1,stake_instructions,stakeProgram);
        }
        else if (add_init_basement && stakedCity == 'THE BASEMENT') {
          stake_instructions = initFixedFarmerInst(5,stake_instructions,stakeProgram);
        }
        else if (add_init_san_chetos && stakedCity == 'SAN CHETOS') {
          stake_instructions = initProbableFarmerInst(3,stake_instructions,stakeProgram);
        }
        else if (add_init_raudcheri && stakedCity == 'RAUDCHERI') {
          stake_instructions = initProbableFarmerInst(3,stake_instructions,stakeProgram);
        }
        else if (add_init_magnexia && stakedCity == 'MAGNEXIA') {
          stake_instructions = initFixedFarmerInst(4,stake_instructions,stakeProgram);
        }
        const [farmerPda, farmerBump] = await farmerPDA(
          farm_id,
          wallet.publicKey!
        );
        const farms:any = await stakeProgram.account.farm.fetch(farm_id);
        const [farmerVaultPda, farmerVaultBump] = await farmerVaultPDA(
          farms.bank,
          wallet.publicKey!
        );
        let nft;
        if (stakedNft) {
          nft = stakedNft;
        }
        else {
          nft = nfts[0];
        }
        const vaults = await bankProgram.account.vault.all();
        console.log(vaults[0].account.authoritySeed.toBase58());
        const [gemBoxPdaVal] = await gemBoxPda(
          farmerVaultPda,
          new PublicKey(nft.mint)
        );
        const [gemDepositBoxPdaVal] = await gemDepositBoxPda(
          farmerVaultPda,
          new PublicKey(nft.mint)
        );
        const [gemBoxRarityPdaVal, gemBoxrarityBump] = await gemBoxRarityPda(
          farms.bank,
          new PublicKey(nft.mint)
        );
        const [vaultAuthorityPdaVal, vaultAuthorityBump] = await vaultAuthorityPda(
          farmerVaultPda
        );
        const gem_mint = new PublicKey(nft.mint);
        // const address_to_whitelist = new PublicKey(collectionId);
        // const [whitelistProofPdaVal] = await whitelistProofPda(farms.bank,address_to_whitelist);
        const [mintWhitelistProofPdaVal] = await whitelistProofPda(farms.bank,new PublicKey(nft.mint));
        const [creatorWhitelistProofPdaVal] = await whitelistProofPda(farms.bank,new PublicKey(nft.creator));
        const gem_source_old = await findAssociatedTokenAddress(wallet.publicKey!,new PublicKey(nft.mint));
        const gem_source_obj = await props.connection.getParsedTokenAccountsByOwner(wallet.publicKey!, {
          mint: new PublicKey(nft.mint),
        });
        const gem_source = gem_source_obj.value[0].pubkey;
        const [gem_metadata] = await tokenMetadataPda(gem_mint);
        const remainingAccounts = [];
        if (mintWhitelistProofPdaVal)
        remainingAccounts.push({
          pubkey: mintWhitelistProofPdaVal,
          isWritable: false,
          isSigner: false,
        });
        if (gem_metadata)
        remainingAccounts.push({
          pubkey: gem_metadata,
          isWritable: false,
          isSigner: false,
        });
        console.log(nft.creator);
        // console.log(whitelistProofPdaVal.toBase58());
        if (creatorWhitelistProofPdaVal) {
          remainingAccounts.push({
            pubkey: creatorWhitelistProofPdaVal,
            isWritable: false,
            isSigner: false,
          });
        }
        stake_instructions.push(await stakeProgram.instruction.flashDeposit(farmerBump, vaultAuthorityBump,gemBoxrarityBump, new BN(1), 
          {
            accounts: {
              farm: farm_id,
              farmAuthority: farms.farmAuthority,
              farmer: farmerPda,
              identity: wallet.publicKey,
              bank: farms.bank,
              vault: farmerVaultPda,
              vaultAuthority: vaultAuthorityPdaVal,
              gemBox: gemBoxPdaVal,
              gemDepositReceipt: gemDepositBoxPdaVal,
              gemSource: gem_source,
              gemMint: gem_mint,
              gemRarity: gemBoxRarityPdaVal,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              gemBank: GEM_BANK,
              feeAcc: FEE_WALLET
            },
            remainingAccounts
          }
        ));
        const [farmAuth, farmAuthBump] = await findFarmAuthorityPDA(farm_id);
        const address_to_whitelist = new PublicKey(collectionId);
        const [whitelistProofPdaVal] = await whitelistProofPda(farms.bank,address_to_whitelist);
        stake_instructions.push(stakeProgram.instruction.stake(farmAuthBump, farmerBump, 
          {
            accounts: {
              farm: farm_id,
              farmAuthority: farms.farmAuthority,
              farmer: farmerPda,
              identity: wallet.publicKey,
              bank: farms.bank,
              vault: farmerVaultPda,
              gemBank: GEM_BANK,
              feeAcc: FEE_WALLET,
              systemProgram: SystemProgram.programId,
            }
          }
        ));
        let tr = new Transaction();
        tr.add(stake_instructions);
        const complete_stake = await sendTransactions(
          props.connection,
          wallet,
          [stake_instructions],
          [[]]
        )
        console.log('complete stake signature ',complete_stake);
        nftStakeStepCount = nftStakeStepCount + 1;
        setNftStakeStep(nftStakeStepCount);
        var arr = stakedNfts;
        arr.push(stakedNft);
        setStakedNfts(arr);
        // setStakedTokens(stakedNfts.length * 100);
        // setRespectEarned(stakedNfts.length * 100);
        // setMultiplierLevel(stakedNfts.length);
      }
      else {
        setAlertState({
          open: true,
          message: "Select a City to stake",
          severity: "error",
        });
      }
    }
    else {
      setAlertState({
        open: true,
        message: "Select an NFT to stake",
        severity: "error",
      });
    }
  }

  // Farmer should call this
  const flashDeposit = async () => {
    const stakeProgram = await getStakeProgram();
    const bankProgram = await getBankProgram();
    let tokens = await getTokensByOwner(wallet.publicKey!);
    const farmers = await stakeProgram.account.farmer.all();
    try {
      const [farmerPda, farmerBump] = await farmerPDA(
        FARM_ID,
        wallet.publicKey!
      );
      const farms:any = await stakeProgram.account.farm.fetch(FARM_ID);
      const [farmerVaultPda, farmerVaultBump] = await farmerVaultPDA(
        farms.bank,
        wallet.publicKey!
      );
      let nft;
      if (stakedNft) {
        nft = stakedNft;
      }
      else {
        nft = nfts[0];
      }
      const vaults = await bankProgram.account.vault.all();
      console.log(vaults[0].account.authoritySeed.toBase58());
      const [gemBoxPdaVal] = await gemBoxPda(
        farmerVaultPda,
        new PublicKey(nft.mint)
      );
      const [gemDepositBoxPdaVal] = await gemDepositBoxPda(
        farmerVaultPda,
        new PublicKey(nft.mint)
      );
      const [gemBoxRarityPdaVal, gemBoxrarityBump] = await gemBoxRarityPda(
        farms.bank,
        new PublicKey(nft.mint)
      );
      const [vaultAuthorityPdaVal, vaultAuthorityBump] = await vaultAuthorityPda(
        farmerVaultPda
      );
      const gem_mint = new PublicKey(nft.mint);
      // const address_to_whitelist = new PublicKey(collectionId);
      // const [whitelistProofPdaVal] = await whitelistProofPda(farms.bank,address_to_whitelist);
      const [mintWhitelistProofPdaVal] = await whitelistProofPda(farms.bank,new PublicKey(nft.mint));
      const [creatorWhitelistProofPdaVal] = await whitelistProofPda(farms.bank,new PublicKey(nft.creator));
      const gem_source_old = await findAssociatedTokenAddress(wallet.publicKey!,new PublicKey(nft.mint));
      console.log(gem_source_old.toBase58());
      const gem_source_obj = await props.connection.getParsedTokenAccountsByOwner(wallet.publicKey!, {
        mint: new PublicKey(nft.mint),
      });
      console.log(gem_source_obj.value[0].pubkey.toBase58());
      const gem_source = gem_source_obj.value[0].pubkey;
      const [gem_metadata] = await tokenMetadataPda(gem_mint);
      console.log(gem_metadata);
      const remainingAccounts = [];
      if (mintWhitelistProofPdaVal)
      remainingAccounts.push({
        pubkey: mintWhitelistProofPdaVal,
        isWritable: false,
        isSigner: false,
      });
      if (gem_metadata)
      remainingAccounts.push({
        pubkey: gem_metadata,
        isWritable: false,
        isSigner: false,
      });
      console.log(nft.creator);
      // console.log(whitelistProofPdaVal.toBase58());
      if (creatorWhitelistProofPdaVal) {
        remainingAccounts.push({
          pubkey: creatorWhitelistProofPdaVal,
          isWritable: false,
          isSigner: false,
        });
      }
      console.log(vaults[0].account.authority.toBase58());
      console.log(vaultAuthorityPdaVal.toBase58());
      console.log(farmerBump);
      console.log(vaultAuthorityBump);
      console.log(gemBoxrarityBump);
      const wallet_create = await stakeProgram.rpc.flashDeposit(farmerBump, vaultAuthorityBump,gemBoxrarityBump, new BN(1), 
        {
          accounts: {
            farm: FARM_ID,
            farmAuthority: farms.farmAuthority,
            farmer: farmerPda,
            identity: wallet.publicKey,
            bank: farms.bank,
            vault: farmerVaultPda,
            vaultAuthority: vaultAuthorityPdaVal,
            gemBox: gemBoxPdaVal,
            gemDepositReceipt: gemDepositBoxPdaVal,
            gemSource: gem_source,
            gemMint: gem_mint,
            gemRarity: gemBoxRarityPdaVal,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            gemBank: GEM_BANK,
            feeAcc: FEE_WALLET
          },
          remainingAccounts
        }
      );
      console.log('flash deposit signature : ' + wallet_create);
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  // Farm Manager should call this
  const addToBankWhitelist = async (id:any) => {
    let farm_id:any;
    let collectInputVar = '';
    if (id == 1) {
      farm_id = MAHANOTHIA_FARM_ID;
      collectInputVar = collectionIdInputOne;
    }
    else if (id == 2) {
      farm_id = RAUDCHERI_FARM_ID;
      collectInputVar = collectionIdInputTwo;
    }
    else if (id == 3) {
      farm_id = SAN_CHETOS_FARM_ID;
      collectInputVar = collectionIdInputThree;
    }
    else if (id == 4) {
      farm_id = MAGNEXIA_FARM_ID;
      collectInputVar = collectionIdInputFour;
    }
    else if (id == 5) {
      farm_id = BASEMENT_FARM_ID;
      collectInputVar = collectionIdInputFive;
    }
    if (collectInputVar && collectInputVar.length > 0) {
      try {
        const address_to_whitelist = new PublicKey(collectionId);
        const stakeProgram = await getStakeProgram();
        try {
          const [farmAuth, farmAuthBump] = await findFarmAuthorityPDA(farm_id);
          const farms:any = await stakeProgram.account.farm.fetch(farm_id);
          let nft;
          if (stakedNft) {
            nft = stakedNft;
          }
          else {
            nft = nfts[0];
          }
          const [whitelistProofPdaVal] = await whitelistProofPda(farms.bank,address_to_whitelist);
          const wallet_create = await stakeProgram.rpc.addToBankWhitelist(farmAuthBump, 1, 
            {
              accounts: {
                farm: farm_id,
                farmManager: farms.farmManager,
                farmAuthority: farmAuth,
                bank: farms.bank,
                addressToWhitelist: address_to_whitelist,
                whitelistProof: whitelistProofPdaVal,
                systemProgram: SystemProgram.programId,
                gemBank: GEM_BANK
              }
            }
          );
          console.log('add to whitelist bank signature : ' + wallet_create);
          setAlertState({
            open: true,
            message: "Collection Id has beed added to bank whitelist",
            severity: "success",
          });
        } catch (error) {
          console.log("Transaction error: ", error);
        }
      } catch (error) {
        setAlertState({
          open: true,
          message: "Collection Id is not a valid public key",
          severity: "error",
        });
      }
    }
    else {
      setAlertState({
        open: true,
        message: "Collection Id is empty",
        severity: "error",
      });
    }
  }

  // Farm Manager should call this
  const addToBankWhitelistMint = async () => {
    if (collectionIdMint && collectionIdMint.length > 0) {
      try {
        const address_to_whitelist = new PublicKey(collectionIdMint);
        const stakeProgram = await getStakeProgram();
        try {
          const [farmAuth, farmAuthBump] = await findFarmAuthorityPDA(MAGNEXIA_FARM_ID);
          const farms:any = await stakeProgram.account.farm.fetch(MAGNEXIA_FARM_ID);
          let nft;
          if (stakedNft) {
            nft = stakedNft;
          }
          else {
            nft = nfts[0];
          }
          const [whitelistProofPdaVal] = await whitelistProofPda(farms.bank,address_to_whitelist);
          const wallet_create = await stakeProgram.rpc.addToBankWhitelist(farmAuthBump, 1, 
            {
              accounts: {
                farm: MAGNEXIA_FARM_ID,
                farmManager: farms.farmManager,
                farmAuthority: farmAuth,
                bank: farms.bank,
                addressToWhitelist: address_to_whitelist,
                whitelistProof: whitelistProofPdaVal,
                systemProgram: SystemProgram.programId,
                gemBank: GEM_BANK
              }
            }
          );
          console.log('add to whitelist bank signature : ' + wallet_create);
          setAlertState({
            open: true,
            message: "Collection Id has beed added to bank whitelist",
            severity: "success",
          });
        } catch (error) {
          console.log("Transaction error: ", error);
        }
      } catch (error) {
        setAlertState({
          open: true,
          message: "Collection Id is not a valid public key",
          severity: "error",
        });
      }
    }
    else {
      setAlertState({
        open: true,
        message: "Collection Id is empty",
        severity: "error",
      });
    }
  }

  // Farmer should call this
  const stakeNft = async () => {
    const stakeProgram = await getStakeProgram();
    try {
      const [farmAuth, farmAuthBump] = await findFarmAuthorityPDA(FARM_ID);
      const farms:any = await stakeProgram.account.farm.fetch(FARM_ID);
      let nft;
      if (stakedNft) {
        nft = stakedNft;
      }
      else {
        nft = nfts[0];
      }
      const [farmerPda, farmerBump] = await farmerPDA(
        FARM_ID,
        wallet.publicKey!
      );
      const [farmerVaultPda, farmerVaultBump] = await farmerVaultPDA(
        farms.bank,
        wallet.publicKey!
      );
      const address_to_whitelist = new PublicKey(collectionId);
      const [whitelistProofPdaVal] = await whitelistProofPda(farms.bank,address_to_whitelist);
      const wallet_create = await stakeProgram.rpc.stake(farmAuthBump, farmerBump, 
        {
          accounts: {
            farm: FARM_ID,
            farmAuthority: farms.farmAuthority,
            farmer: farmerPda,
            identity: wallet.publicKey,
            bank: farms.bank,
            vault: farmerVaultPda,
            gemBank: GEM_BANK,
            feeAcc: FEE_WALLET,
            systemProgram: SystemProgram.programId,
          }
        }
      );
      console.log('stake signature : ' + wallet_create);
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  // Farmer should call this
  const UnStakeNft = async () => {
    const stakeProgram = await getStakeProgram();
    const [farmerPda, farmerBump] = await farmerPDA(
      FARM_ID,
      wallet.publicKey!
    );
    const farmers = await stakeProgram.account.farmer.all();
    try {
      const [farmAuth, farmAuthBump] = await findFarmAuthorityPDA(FARM_ID);
      const farms:any = await stakeProgram.account.farm.fetch(FARM_ID);
      let nft;
      if (stakedNft) {
        nft = stakedNft;
      }
      else {
        nft = nfts[0];
      }
      const [farmerPda, farmerBump] = await farmerPDA(
        FARM_ID,
        wallet.publicKey!
      );
      const [farmerVaultPda, farmerVaultBump] = await farmerVaultPDA(
        farms.bank,
        wallet.publicKey!
      );
      const [farmTreasury, farmTreasuryBump] = await findFarmTreasuryPDA(
        FARM_ID
      );
      const [farmTreasuryToken, farmTreasuryTokenBump] = await findFarmTreasuryTokenPDA(
        FARM_ID,
        REWARD_MINT
      );
      const wallet_create = await stakeProgram.rpc.unstake(farmAuthBump, farmTreasuryTokenBump, farmerBump, false,
        {
          accounts: {
            farm: FARM_ID,
            farmAuthority: farms.farmAuthority,
            farmTreasury: farmTreasuryToken,
            farmer: farmerPda,
            identity: wallet.publicKey,
            bank: farms.bank,
            vault: farmerVaultPda,
            gemBank: GEM_BANK,
            feeAcc: FEE_WALLET,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          }
        }
      );
      console.log('unstake signature : ' + wallet_create);
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  const showTeamInfoHover = async (id: any) => {
    setShowTeamInfo(true);
    setTeamInfoMember(id);
  };

  const closeMenu = async (id: any) => {
    if (id && id === "VAULT") {
      setShowMobileDoor(true);
      setMobileDoor(id);
      setMenuOpen(false);
      setClassNameState("main-vault-room-door");
    } else if (id && id === "TEAM") {
      setShowMobileDoor(true);
      setMobileDoor(id);
      setMenuOpen(false);
      setShowTeamRoom(true);
      setClassNameState("main-team-room-door");
    } else if (id && id === "ALPHA") {
      setShowMobileDoor(true);
      setMobileDoor(id);
      setMenuOpen(false);
      setShowAlphaRoom(true);
      setClassNameState("main-alpha-room-door");
    } else if (id && id === "STAKE") {
      setShowMobileDoor(true);
      setMobileDoor(id);
      setMenuOpen(false);
      setShowStakeRoom(true);
      setClassNameState("main-stake-room-door");
    } else {
      setMenuOpen(false);
    }
  };

  const closeAlphaRoom = async () => {
    var n = "";
    if (mobileDoor === "VAULT") {
      n = "main-vault-room-door";
    } else if (mobileDoor === "ALPHA") {
      n = "main-alpha-room-door";
    } else if (mobileDoor === "TEAM") {
      n = "main-team-room-door";
    } else if (mobileDoor === "STAKE") {
      n = "main-stake-room-door";
    }
    if (showMobileDoor) {
      setClassNameState(n);
      setLogoAlphaLoading(false);
      setShowAlphaRoom(false);
      setShowStakeRoom(false);
      setShowTeamRoom(false);
      setShowMobileDoor(true);
    } else {
      setClassNameState("main-bg-after-door-open");
      setLogoAlphaLoading(false);
      setShowAlphaRoom(false);
      setShowStakeRoom(false);
      setShowTeamRoom(false);
    }
  };

  const whiteListCheckMint = async () => {
    try {
      const walletProgram = await getProgram();
      const [wallet_pda, wallet_bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(pdaSeed),
          wallet.publicKey!.toBuffer(),
          MAGIC_HAT_CREATOR!.toBuffer(),
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const whitelistAccounts: any = await walletProgram.account.walletWhitelist.fetch(wallet_pda);
      if (
        wallet &&
        wallet.publicKey &&
        wallet.publicKey.toBase58().length > 0
      ) {
        var k = false;
        if (mintCount > 1) {
        } else {
          setMintCount(1);
        }
        if (whitelistAccounts) {
          let wl_type = Object.keys(whitelistAccounts.whitelistType)[0];
          if (
            wl_type &&
            (wl_type == "three" ||
              wl_type == "two" ||
              wl_type == "one" ||
              wl_type == "four")
          ) {
            let spots =
              whitelistAccounts.numberOfWhitelistSpotsPerUser.toNumber();
            if (spots >= mintCount) {
              setShouldMint(true);
              k = true;
              onMintWL(mintCount, wallet_pda);
            } else {
              const date = new Date();
              const time: any = parseInt((date.getTime() / 1000).toFixed(0));
              if (time >= PUBLIC_TIME) {
                setShouldMint(true);
                k = true;
                onMint(mintCount);
              }
            }
          }
          if (!k) {
            // setAlertState({
            //   open: true,
            //   message: "You are not whitelisted for " + mintCount + " NFTs!!!",
            //   severity: "error",
            // });
            setShouldMint(true);
            k = true;
            onMint(mintCount);
          }
        }
        // const element = whitelists;
        // if (element.number > 0 && mintCount <= element.number) {
        //   setShouldMint(true);
        //   k = true;
        //   onMint(mintCount);
        // }
      }
    } catch (error) {
      console.log(error);
      setShouldMint(true);
      k = true;
      onMint(mintCount);
    }
  };

  const getWhitelistConfig = async () => {
    try {
      const walletProgram = await getProgram();
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const whitelistConfigAccounts = await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda);
    } catch (error) {}
  };

  const createWhitelistConfig = async () => {
    const walletProgram = await getProgram();
    try {
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      // let config_t:any = Borsh.struct(JSON.stringify(config));
      const wallet_create = await walletProgram.rpc.createWhitelistConfig(
        new BN(100),
        new BN(COMMUNITY_PRICE * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        new BN(369),
        new BN(GOG_PRICE * LAMPORTS_PER_SOL),
        new BN(GOG_TIME),
        new BN(1380),
        new BN(OG_PRICE * LAMPORTS_PER_SOL),
        new BN(GOG_TIME),
        new BN(5000),
        new BN(WL_PRICE * LAMPORTS_PER_SOL),
        new BN(WL_TIME),
        {
          accounts: {
            whitelistConfig: whitelist_config_pda,
            magicHatCreator: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        }
      );
      const whitelistConfigAccounts = await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda);
      // return { whitelistConfigAccounts };
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const updateWhitelistConfig = async () => {
    const walletProgram = await getProgram();
    try {
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const wallet_create = await walletProgram.rpc.updateWhitelistConfig(
        new BN(100),
        new BN(COMMUNITY_PRICE * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        new BN(369),
        new BN(GOG_PRICE * LAMPORTS_PER_SOL),
        new BN(GOG_TIME),
        new BN(1380),
        new BN(OG_PRICE * LAMPORTS_PER_SOL),
        new BN(GOG_TIME),
        new BN(5000),
        new BN(WL_PRICE * LAMPORTS_PER_SOL),
        new BN(WL_TIME),
        {
          accounts: {
            whitelistConfig: whitelist_config_pda,
            magicHatCreator: wallet.publicKey,
          },
        }
      );
      const whitelistConfigAccounts = await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda);
      // return { whitelistConfigAccounts };
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const setCollection = async () => {
    const walletProgram = await getProgram();
    try {
      const mint = anchor.web3.Keypair.generate();
      const [collection_pda] = await PublicKey.findProgramAddress(
        [Buffer.from("collection"), MAGIC_HAT_ID.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const [metadata_pda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const [edition_pda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const [collection_authority_pda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
          Buffer.from("collection_authority"),
          wallet.publicKey?.toBuffer()!
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      // let config_t:any = Borsh.struct(JSON.stringify(config));
      const wallet_create = await walletProgram.rpc.setCollection({
        accounts: {
          magicHat: MAGIC_HAT_ID,
          authority: wallet.publicKey,
          collectionPda: collection_pda,
          payer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          metadata: metadata_pda,
          mint: mint.publicKey,
          edition: edition_pda,
          collectionAuthorityRecord: collection_authority_pda,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        },
      });
      // return { whitelistConfigAccounts };
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const setCollectionDuringMint = async () => {
    const walletProgram = await getProgram();
    try {
      const mint = anchor.web3.Keypair.generate();
      const [collection_pda] = await PublicKey.findProgramAddress(
        [Buffer.from("collection"), MAGIC_HAT_ID.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const [metadata_pda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const [edition_pda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      // let config_t:any = Borsh.struct(JSON.stringify(config));
      const wallet_create = await walletProgram.rpc.setCollection({
        accounts: {
          magicHat: MAGIC_HAT_ID,
          metadata: metadata_pda,
          payer: wallet.publicKey,
          collectionPda: collection_pda,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          mint: mint.publicKey,
          edition: edition_pda,
          authority: wallet.publicKey,
          collectionAuthorityRecord: wallet.publicKey,
        },
      });
      // return { whitelistConfigAccounts };
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const createWhitelistAccount = async () => {
    const walletProgram = await getProgram();
    try {
      const whitelisting_address = new PublicKey(
        "UXX91ApKnrc1NyATPYqMJaDeJBQ3r9kSva1a4XTY3FD"
      );
      const [wallet_pda, wallet_bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(pdaSeed),
          whitelisting_address.toBuffer(),
          wallet.publicKey!.toBuffer(),
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const wallet_create = await walletProgram.rpc.createWhitelistAccount(
        "Four",
        {
          accounts: {
            walletWhitelist: wallet_pda,
            whitelistConfig: whitelist_config_pda,
            whitelistedAddress: whitelisting_address,
            magicHatCreator: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        }
      );
      const whitelistAccounts = await walletProgram.account.walletWhitelist.fetch(wallet_pda);
      // return { whitelistAccounts };
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const deleteWhitelistAccount = async () => {
    const walletProgram = await getProgram();
    try {
      const whitelisting_address = new PublicKey(
        "7cinbPtGLyZWkmXUanWJd372gyPQwMTa9vgiJrACaSjW"
      );
      const [wallet_pda, wallet_bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(pdaSeed),
          whitelisting_address.toBuffer(),
          wallet.publicKey!.toBuffer(),
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const wallet_create = await walletProgram.rpc.deleteWhitelistAccount({
        accounts: {
          walletWhitelist: wallet_pda,
          magicHatCreator: wallet.publicKey,
        },
      });
      const whitelistAccounts = await walletProgram.account.walletWhitelist.fetch(wallet_pda);
      // return { whitelistAccounts };
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  let currentWltype: String;

  const getTimeToMInt = async () => {
    const date = new Date();
    const time: any = parseInt((date.getTime() / 1000).toFixed(0));
    let k = date.getTimezoneOffset();
    if (time >= PUBLIC_TIME) {
      setCurrentWl("PUBLIC");
      currentWltype = "PUBLIC";
    } else if (time >= WL_TIME) {
      setCurrentWl("WL");
      currentWltype = "WL";
    } else if (time >= GOG_TIME) {
      setCurrentWl("GOG + OG");
      currentWltype = "GOG + OG";
    } else if (time >= COMMUNITY_TIME) {
      setCurrentWl("COMMUNITY");
      currentWltype = "COMMUNITY";
    }
    if (currentWltype == "PUBLIC") {
      return "";
    } else {
      if (currentWltype == "COMMUNITY") {
        const date = new Date();
        const time: any = parseInt((date.getTime() / 1000).toFixed(0));
        var delta = Math.abs(time - GOG_TIME);
        if (delta <= 0) {
          setCurrentWl("GOG + OG");
          currentWltype = "GOG + OG";
        }
        let days: any = Math.floor(delta / 86400);
        delta -= days * 86400;
        let hours: any = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        let minutes: any = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        let seconds: any = delta % 60;
        hours = Math.abs(hours);
        if (days < 10) {
          days = "0" + days;
        }
        if (hours < 10) {
          hours = "0" + hours;
        }
        minutes = Math.abs(minutes);
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        seconds = Math.abs(seconds);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        setTime(hours + ":" + minutes + ":" + seconds);
      } else if (currentWltype == "GOG + OG") {
        const date = new Date();
        const time: any = parseInt((date.getTime() / 1000).toFixed(0));
        var delta = Math.abs(time - WL_TIME);
        if (delta <= 0) {
          setCurrentWl("WL");
          currentWltype = "WL";
        }
        let days: any = Math.floor(delta / 86400);
        delta -= days * 86400;
        let hours: any = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        let minutes: any = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        let seconds: any = delta % 60;
        hours = Math.abs(hours);
        if (days < 10) {
          days = "0" + days;
        }
        if (hours < 10) {
          hours = "0" + hours;
        }
        minutes = Math.abs(minutes);
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        seconds = Math.abs(seconds);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        setTime(hours + ":" + minutes + ":" + seconds);
      } else if (currentWltype == "WL") {
        const date = new Date();
        const time: any = parseInt((date.getTime() / 1000).toFixed(0));
        var delta = Math.abs(time - PUBLIC_TIME);
        if (delta <= 0) {
          setCurrentWl("PUBLIC");
          currentWltype = "PUBLIC";
        }
        let days: any = Math.floor(delta / 86400);
        delta -= days * 86400;
        let hours: any = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        let minutes: any = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        let seconds: any = delta % 60;
        hours = Math.abs(hours);
        if (days < 10) {
          days = "0" + days;
        }
        if (hours < 10) {
          hours = "0" + hours;
        }
        minutes = Math.abs(minutes);
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        seconds = Math.abs(seconds);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        setTime(hours + ":" + minutes + ":" + seconds);
      } else if (currentWl == "PUBLIC") {
        setTime("");
      } else {
        const date = new Date();
        const time: any = parseInt((date.getTime() / 1000).toFixed(0));
        var delta = Math.abs(time - COMMUNITY_TIME);
        if (delta <= 0) {
          setCurrentWl("COMMUNITY");
          currentWltype = "COMMUNITY";
        }
        let days: any = Math.floor(delta / 86400);
        delta -= days * 86400;
        let hours: any = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        let minutes: any = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        let seconds: any = delta % 60;
        hours = Math.abs(hours);
        if (days < 10) {
          days = "0" + days;
        }
        if (hours < 10) {
          hours = "0" + hours;
        }
        minutes = Math.abs(minutes);
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        seconds = Math.abs(seconds);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        setTime(hours + ":" + minutes + ":" + seconds);
      }
    }
  };

  const deleteWhitelistConfig = async () => {
    const walletProgram = await getProgram();
    try {
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const wallet_create = await walletProgram.rpc.deleteWhitelistConfig({
        accounts: {
          whitelistConfig: whitelist_config_pda,
          magicHatCreator: wallet.publicKey,
        },
      });
      const whitelistConfigAccounts = await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda);
      // return { whitelistConfigAccounts };
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const withdrawFunds = async () => {
    const walletProgram = await getProgram();
    try {
      const [collection_pda] = await PublicKey.findProgramAddress(
        [Buffer.from("collection"), MAGIC_HAT_ID.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const wallet_create = await walletProgram.rpc.withdrawFunds({
        accounts: {
          magicHat: MAGIC_HAT_ID,
          authority: wallet.publicKey,
          collectionPda: collection_pda,
        },
      });
      // return { whitelistConfigAccounts };
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const closeForm = async () => {
    setClassNameState("main-bg-after-door-open");
    setShowAlphaRoom(false);
    setShowTeamRoom(false);
    setShowStakeRoom(false);
    setShowMobileDoor(false);
  };

  const handleMobileHome = async () => {
    if (showAlphaRoom || showTeamRoom || showStakeRoom) {
      closeAlphaRoom();
    } else {
      closeForm();
    }
  };

  const openMenu = async () => {
    setMenuOpen(true);
  };

  const openStakeRoom = async (id:any) => {
    setCurrentStakeRoom(id);
    setShowStakeCity(true);
  };

  const stakeFromCity = async () => {
    if (currentStakeRoom == 1) {
      setStakedCity('MAHANOTHIA')
    } else if (currentStakeRoom == 2) {
      setStakedCity('RAUDCHERI')
    } else if (currentStakeRoom == 3) {
      setStakedCity('SAN CHETOS')
    } else if (currentStakeRoom == 4) {
      setStakedCity('MAGNEXIA')
    } else if (currentStakeRoom == 5) {
      setStakedCity('THE BASEMENT')
    }
    setShowStakeCity(false);
    setShowStaking(true);
  }

  const closeStakeRoom = async (id:any) => {
    setShowStakeCity(false);
    setShowStaking(false);
  };

  const closeStakeCity = async (id:any) => {
    setShowStakeCity(false);
    setShowStaking(false);
  };

  const openAlphaRoom = async (key:string) => {
    if (isMobile) {
      if (mobileDoor === "ALPHA") {
        setClassNameState("main-bg-after-door-open black-bg");
        setLogoAlphaLoading(true);
        setTimeout(function () {
          setLogoAlphaLoading(false);
          setClassNameState("alpha-room");
          setShowTeamRoom(false);
          setShowAlphaRoom(true);
          setShowStakeRoom(false);
          setShowMobileDoor(false);
        }, 600);
      } 
      else if (mobileDoor === "TEAM") {
        setClassNameState("main-bg-after-door-open black-bg");
        setLogoAlphaLoading(true);
        setTimeout(function () {
          setLogoAlphaLoading(false);
          setClassNameState("team-room");
          setShowTeamRoom(true);
          setShowAlphaRoom(false);
          setShowStakeRoom(false);
          setShowMobileDoor(false);
        }, 600);
      }
      else if (mobileDoor === "STAKE") {
        setClassNameState("main-bg-after-door-open black-bg");
        setLogoAlphaLoading(true);
        setTimeout(function () {
          setLogoAlphaLoading(false);
          setClassNameState("team-room");
          setShowTeamRoom(false);
          setShowAlphaRoom(false);
          setShowStakeRoom(true);
          setShowMobileDoor(false);
        }, 600);
      }
      else {
        var arr = [
          "Patience is key",
          "Shh...",
          "Not yet, the time will come",
          "Calm down man",
          "It's locked, come back later.",
        ];
        const k: number | undefined = Math.floor(Math.random() * 5);
        setShowMessage(true);
        setMessageText(arr[k as number]);
        setTimeout(function () {
          setShowMessage(false);
          setMessageText("");
        }, 900);
      }
    } else {
      if (key == 'alpha') {
        setClassNameState("main-bg-after-door-open black-bg");
        setLogoAlphaLoading(true);
        setTimeout(function () {
          setClassNameState("alpha-room");
          setLogoAlphaLoading(false);
          setShowAlphaRoom(true);
          setShowStakeRoom(false);
          setShowMobileDoor(false);
        }, 600);
      }
      else if (key == 'team') {
        setClassNameState("main-bg-after-door-open black-bg");
        setLogoAlphaLoading(true);
        setTimeout(function () {
          setClassNameState("team-room");
          setLogoAlphaLoading(false);
          setShowAlphaRoom(false);
          setShowTeamRoom(true);
          setShowStakeRoom(false);
          setShowMobileDoor(false);
        }, 600);
      }
      else if (key == 'stake') {
        setClassNameState("main-bg-after-door-open black-bg");
        setLogoAlphaLoading(true);
        setTimeout(function () {
          setClassNameState("stake-room");
          setLogoAlphaLoading(false);
          setShowAlphaRoom(false);
          setShowTeamRoom(false);
          setShowStakeRoom(true);
          setShowMobileDoor(false);
        }, 600);
        setTimeout(function() {
          if (roomOneInfoClass == "stake-room-info-one") {
            setRoomOneInfoClass("stake-room-info-one flip");
          }
          else {
            setRoomOneInfoClass("stake-room-info-one");
          }
          if (roomTwoInfoClass == "stake-room-info-one") {
            setRoomTwoInfoClass("stake-room-info-one flip");
          }
          else {
            setRoomTwoInfoClass("stake-room-info-one");
          }
          if (roomThreeInfoClass == "stake-room-info-one") {
            setRoomThreeInfoClass("stake-room-info-one flip");
          }
          else {
            setRoomThreeInfoClass("stake-room-info-one");
          }
          if (roomFourInfoClass == "stake-room-info-one") {
            setRoomFourInfoClass("stake-room-info-one flip");
          }
          else {
            setRoomFourInfoClass("stake-room-info-one");
          }
          if (roomFiveInfoClass == "stake-room-info-one") {
            setRoomFiveInfoClass("stake-room-info-one flip");
          }
          else {
            setRoomFiveInfoClass("stake-room-info-one");
          }
        },3000) 
      }
    }
  };

  const hideTeamInfo = async () => {
    setShowTeamInfo(false);
    setTeamInfoMember(null);
  };

  const openTeamRoom = async () => {
    setClassNameState("main-bg-after-door-open black-bg");
    setLogoAlphaLoading(true);
    setTimeout(function () {
      setClassNameState("team-room");
      setLogoAlphaLoading(false);
      setShowTeamRoom(true);
      setShowMobileDoor(false);
    }, 600);
  };

  const scrollStory = async () => {
    var elem: HTMLElement | null = document.getElementById("alpha-scroll");
    elem!.scrollTop = elem!.scrollTop + 180;
  };

  const closeUpdates = async () => {
    setShowUpdates(false);
  };

  const openUpdates = async () => {
    setShowUpdates(true);
  };

  const openWhitelist = async () => {
    setShowWhitelist(true);
  }

  const openFirstPhilAlphaRoom = async () => {
    setShowFirstPhil(true);
  };

  const closeAlphaUpdates = async () => {
    setShowFirstPhil(false);
    setShowAlphaRoom(true);
  };

  // const getFreeSol = async () => {
  //   var data = JSON.stringify({
  //     "jsonrpc": "2.0",
  //     "id": "eb5c5883-8d38-44cb-a7af-22ab62343a75",
  //     "method": "requestAirdrop",
  //     "params": [
  //       anchorWallet?.publicKey.toBase58(),
  //       1000000000
  //     ]
  //   });

  //   var xhr = new XMLHttpRequest();
  //   xhr.addEventListener("readystatechange", function() {
  //     if(this.readyState === 4) {
  //       setAlertState({
  //         open: true,
  //         message: '1 Sol transferred!',
  //         severity: 'success',
  //       });
  //     }
  //   });

  //   xhr.open("POST", "https://api.devnet.solana.com/");
  //   xhr.setRequestHeader("Content-Type", "application/json");

  //   xhr.send(data);
  // }

  return (
    <div id="main" className={classNameState}>
      <div id="wrapper">
        {isMobile && (
          //  <CheeseburgerMenu isOpen={menuOpen} closeCallback={this.closeMenu.bind(this)}>
          //   <MenuContent closeCallback={this.closeMenu.bind(this)} />
          // </CheeseburgerMenu>
          <div></div>
        )}
        {logoLoading && !logoAlphaLoading && (
          <div className="logo-loader-parent">
            <img alt="Alpha-logo" src={LogoWhite} className="pulse-animation" />
          </div>
        )}
        {!logoLoading &&
          !showMobileDoor && 
          !logoAlphaLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !isMobile && (
            <div className="white-paper-div">
              <a
                href="https://secret-alpha.gitbook.io/glitch/"
                target="_blank"
                rel="noreferrer"
                className="white-paper-anchor"
              >
                {" "}
              </a>
            </div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div
              onClick={() => openAlphaRoom('stake')}
              // onClick={() => refreshFarmer()}
              // onClick={() => refreshFarmerSigned()}
              className="stake-room-div"
            ></div>
          )}
        {!logoLoading && isMobile && !logoAlphaLoading && !menuOpen && (
          <div className="hamburger-menu">
            <img alt="Menu" onClick={openMenu} src={MobileMenu} />
          </div>
        )}
        {!logoLoading && isMobile && !logoAlphaLoading && (
          <div className="alpha-home-logo" onClick={handleMobileHome}>
            <img alt="Alpha-Logo-Cropped" src={LogoWhiteCropped} />
          </div>
        )}
        {!logoLoading &&
          isMobile &&
          !logoAlphaLoading &&
          showTeamRoom &&
          !showMobileDoor && (
            <div className="team-room-header" onClick={handleMobileHome}>
              <h2>TEAM</h2>
            </div>
          )}
        {!logoLoading && isMobile && showMobileDoor && !logoAlphaLoading && (
          <div className="mobile-room-div" onClick={() => openAlphaRoom('')}></div>
        )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div
              onClick={() => showToaster(5)}
              className="vault-room-div"
            ></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showTeamRoom &&
          !showStakeRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div
              onClick={() => openAlphaRoom('alpha')}
              className="alpha-room-div"
            ></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div onClick={() => openAlphaRoom('team')} className="team-room-div"></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div onClick={closeForm} className="alpha-logo-div"></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !showMobileDoor && (
            <div className="hologram-div">
              {/* onClick={openUpdates} */}
              <div className="smaller-holo-updates">
                {currentWl == "" && (
                  <label className="typing-text">Mint</label>
                )}
                {(
                  // <div className="Top-connected red">
                  //   <WalletDialogButton className="Inside-Connect-btn">
                  //     Connect
                  //   </WalletDialogButton>
                  // </div>
                  <div className="Top-connected green">
                    <button
                      className={
                        shouldMint ? "Outside-Mint-btn" : "Outside-Mint-btn"
                      }
                      onClick={openUpdates}
                    >
                      Minted Out
                    </button>
                  </div>
                )}
                {/* {wallet.connected && currentWl != "" && (
                  <div className="Top-connected green">
                    <button
                      className={
                        shouldMint ? "Outside-Mint-btn" : "Outside-Mint-btn"
                      }
                      onClick={openUpdates}
                    >
                      Mint
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          )}
          
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && <div className="hologram-setup-div"></div>}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div>
              <img
                alt="Katana"
                src={KatanaImage}
                // onClick={createWhitelistAccountMultiple}
                onClick={() => showToaster(2)}
                className="katana-image"
              ></img>
            </div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div>
              <img
                alt="Pizza"
                src={PizzaImage}
                onClick={() => showToaster(1)}
                className="pizza-image"
              ></img>
            </div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div>
              <img
                alt="Sopha"
                onClick={updateWhitelistConfig}
                src={Sopha}
                className="sopha-image"
              ></img>
            </div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div>
              <div
                className="bean-bag-click"
                onClick={() => showToaster(4)}
              ></div>
              <img
                alt="Bean-bag"
                src={Beanbag}
                className="bean-bag-image"
              ></img>
            </div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <video autoPlay={true} loop muted className="fan-spinning-image">
              <source
                src={FanSpinning}
                className="fan-spinning-image"
                type="video/mp4"
              ></source>
              <source
                src={FanSpinning}
                className="fan-spinning-image"
                type="video/mp4"
              ></source>
              Your browser does not support HTML5 video.
            </video>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            // <div onClick={setCollection} className="light-flicker-image"></div>
            <div className="light-flicker-image"></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <img
              alt="Sider"
              src={SophaSider}
              onClick={() =>setShowFarming(true)}
              className="sopha-sider-image"
            ></img>
          )}
        {!logoLoading && showMessage && (
          <div className="mesage-container">
            <label>{messageText}</label>
          </div>
        )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showStakeRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div className="social-media-links">
              <a
                href="https://twitter.com/SecretAlphaLabs"
                target="_blank"
                rel="noreferrer"
              >
                <img alt="Twitter" className="social-icons" src={Twitter} />
              </a>
              <a
                href="https://discord.com/invite/SecretAlpha"
                target="_blank"
                rel="noreferrer"
              >
                <img alt="Discord" className="social-icons" src={Discord} />
              </a>
            </div>
          )}
        {showAlphaRoom &&
          !logoAlphaLoading &&
          !logoLoading &&
          !showMobileDoor &&
          !isMobile && (
            <div className="close-alpha-room" onClick={closeAlphaRoom}>
              <img alt="close" src={CloseAlpha} />
            </div>
          )}
        {showStakeRoom &&
          !showStakeCity &&
          !showStaking &&
          !showStakeDashboard &&
          !logoAlphaLoading &&
          !logoLoading &&
          !showMobileDoor &&
          !isMobile && (
            <div className="close-stake-room" onClick={closeAlphaRoom}>
              <img alt="close" src={CloseAlpha} />
            </div>
          )}
        {showTeamRoom &&
          !logoAlphaLoading &&
          !logoLoading &&
          !showMobileDoor &&
          !isMobile && (
            <div className="close-team-room" onClick={closeAlphaRoom}>
              <img alt="close" src={CloseAlpha} />
            </div>
          )}
        {showTeamRoom && !isMobile && (
          <div>
            <div
              onMouseLeave={hideTeamInfo}
              onMouseOver={() => showTeamInfoHover(1)}
              className="first-team-member"
            ></div>
            <div
              onMouseLeave={hideTeamInfo}
              onMouseOver={() => showTeamInfoHover(2)}
              className="second-team-member"
            ></div>
            <div
              onMouseLeave={hideTeamInfo}
              onMouseOver={() => showTeamInfoHover(3)}
              className="third-team-member"
            ></div>
            <div
              onMouseLeave={hideTeamInfo}
              onMouseOver={() => showTeamInfoHover(4)}
              className="fourth-team-member"
            ></div>
            <div
              onMouseLeave={hideTeamInfo}
              onMouseOver={() => showTeamInfoHover(5)}
              className="fifth-team-member"
            ></div>
            <div
              onMouseLeave={hideTeamInfo}
              onMouseOver={() => showTeamInfoHover(6)}
              className="sixth-team-member"
            ></div>
            <div
              onMouseLeave={hideTeamInfo}
              onMouseOver={() => showTeamInfoHover(7)}
              className="seventh-team-member"
            ></div>
            <div
              onMouseLeave={hideTeamInfo}
              onMouseOver={() => showTeamInfoHover(8)}
              className="eigth-team-member"
            ></div>
          </div>
        )}
        {isMobile && menuOpen && (
          <div className="cheeseburger-menu">
            <MenuContent closeCallback={closeMenu} />
          </div>
        )}
        {showTeamRoom && showTeamInfo && teamInfoMember === 1 && (
          <div className="mesage-container-team">
            <label className="message-container-label-small">
              <b>Gabriel</b>
              <br />
              <i>NFT artist</i>
              <br />
              Artist Extraordinaire. Delicately detailed.
            </label>
          </div>
        )}
        {showTeamRoom && showTeamInfo && teamInfoMember === 2 && (
          <div className="mesage-container-team">
            <label className="message-container-label-small">
              <b>Yogantar</b>
              <br />
              <i>Artist</i>
              <br />
              He sees, He makes, He thinks, He creates. No world is too far.
            </label>
          </div>
        )}
        {showTeamRoom && showTeamInfo && teamInfoMember === 3 && (
          <div className="mesage-container-team">
            <label className="message-container-label-small">
              <b>Wallace</b>
              <br />
              <i>Collab Chief</i>
              <br />
              Master Negotiator, One handshake is all it takes.
            </label>
          </div>
        )}
        {showTeamRoom && showTeamInfo && teamInfoMember === 4 && (
          <div className="mesage-container-team">
            <label className="message-container-label-small">
              <b>Vamshi</b>
              <br />
              <i>Front-end Dev</i>
              <br />
              Skillful savant. Code is art.
            </label>
          </div>
        )}
        {showTeamRoom && showTeamInfo && teamInfoMember === 5 && (
          <div className="mesage-container-team">
            <label className="message-container-label-small">
              <b>Bhargav</b>
              <br />
              <i>Back-end Dev</i>
              <br />
              Code Whizz. The magic happens at the back.
            </label>
          </div>
        )}
        {showTeamRoom && showTeamInfo && teamInfoMember === 6 && (
          <div className="mesage-container-team">
            <label className="message-container-label-small">
              <b>Walter</b>
              <br />
              <i>CEO</i>
              <br />
              Eyes all around. <span className="strikethrough">Sex</span> Genius
              Sells.
            </label>
          </div>
        )}
        {showTeamRoom && showTeamInfo && teamInfoMember === 7 && (
          <div className="mesage-container-team">
            <label className="message-container-label-small">
              <b>Kaizer</b>
              <br />
              <i>CMO</i>
              <br />
              The one holding all the cards. Shh…
            </label>
          </div>
        )}
        {showTeamRoom && showTeamInfo && teamInfoMember === 8 && (
          <div className="mesage-container-team">
            <label className="message-container-label-small">
              <b>Sashi</b>
              <br />
              <i>COO</i>
              <br />
              King of discord. No bullshit, only work.
            </label>
          </div>
        )}
        {showTeamRoom && isMobile && !showMobileDoor && (
          <div className="team-member-div">
            <Carousel responsive={responsive}>
              <div className="team-member-image">
                <label className="team-member-info-top">
                  Walter <span className="text-right">CEO</span>
                </label>
                <img alt="Walter" src={Walter} />
                <label className="team-member-info-bottom">
                  <q>
                    Eyes all around. <span className="strikethrough">Sex</span>{" "}
                    Genius Sells.
                  </q>
                </label>
              </div>
              <div className="team-member-image">
                <label className="team-member-info-top">
                  Kaizer <span className="text-right">CMO</span>
                </label>
                <img alt="kaizer" src={Kaizer} />
                <label className="team-member-info-bottom">
                  <q>The one holding all the cards. Shh…</q>
                </label>
              </div>
              <div className="team-member-image">
                <label className="team-member-info-top">
                  Sashi <span className="text-right">COO</span>
                </label>
                <img alt="Sashi" src={Sashi} />
                <label className="team-member-info-bottom">
                  <q>King of discord. No bullshit, only work.</q>
                </label>
              </div>
              <div className="team-member-image">
                <label className="team-member-info-top">
                  Gabriel <span className="text-right">NFT artist</span>
                </label>
                <img alt="Gabriel" src={Gabriel} />
                <label className="team-member-info-bottom">
                  <q>Artist Extraordinaire. Delicately detailed.</q>
                </label>
              </div>
              <div className="team-member-image">
                <label className="team-member-info-top">
                  Yogantar <span className="text-right">Artist</span>
                </label>
                <img alt="Yogantar" src={Yogantar} />
                <label className="team-member-info-bottom">
                  <q>
                    He sees, He makes, He thinks, He creates. No world is too
                    far.
                  </q>
                </label>
              </div>
              <div className="team-member-image">
                <label className="team-member-info-top">
                  Wallace <span className="text-right">Collab Chief</span>
                </label>
                <img alt="Wallace" src={Wallace} />
                <label className="team-member-info-bottom">
                  <q>Master Negotiator, One handshake is all it takes.</q>
                </label>
              </div>
              <div className="team-member-image">
                <label className="team-member-info-top">
                  Vamshi <span className="text-right">Front-end Dev</span>
                </label>
                <img alt="Dev1" src={Dev1} />
                <label className="team-member-info-bottom">
                  <q>Skillful savant. Code is art.</q>
                </label>
              </div>
              <div className="team-member-image">
                <label className="team-member-info-top">
                  Bhargav <span className="text-right">Back-end Dev</span>
                </label>
                <img alt="Dev2" src={Dev2} />
                <label className="team-member-info-bottom">
                  <q>Code Whizz. The magic happens at the back.</q>
                </label>
              </div>
            </Carousel>
          </div>
        )}
        {showAlphaRoom && !showTeamRoom && !showStakeRoom && !logoAlphaLoading && !logoLoading && !showMobileDoor && (
          <div className="Backdrop-other">
            <div
              className="alpha-room-phil-one"
              onClick={openFirstPhilAlphaRoom}
            >
              <div className="smaller-alpha-updates">
                <label className="typing-text story-line">The Story</label>
              </div>
            </div>
          </div>
        )}
        {!showAlphaRoom && !showTeamRoom && showStakeRoom && !logoAlphaLoading && !logoLoading && !showMobileDoor && (
          <div className="">
            <div className="stake-room-1"></div>
            <div className="stake-room-2"></div>
            <div className="stake-room-3"></div>
            <div className="stake-room-4"></div>
            <div className="stake-room-5"></div>
            <div className="stake-room-6"></div>
            <div className="stake-room-7"></div>
            <div className="staking-room-one" onClick={() => openStakeRoom(1)}>
              <div className={roomOneInfoClass}>
                <h2>Mahanothia</h2>
                {/* <label>The oldest of the cities, ruled by the wisest and most trusted royal family in the whole of Alphazex, the Avrupans. The culture, the architecture style, the communities, the military, all designed so perfectly that even after a thousand years, they stand the test of time. Crime doesn't exist in Mahanothia and so, once your character enters this stoic city for their mission they are sure to leave it with guaranteed rewards.</label> */}
              </div>
            </div>
            <div className="staking-room-two" onClick={() => openStakeRoom(2)}>
              <div className={roomThreeInfoClass}>
                <h2>San Chetos</h2>
                {/* <label>Ancestors of Jesse might refer to this city as a mix of Las Vegas, Monte Carlo, Cuba and Dubai. Filled with dazzling lights, gorgeous people and most importantly fuck tons of money, but equally surrounded with gambling dens, mafia and drugs. Just as quickly you can rise to top of the world in this city, you'll fall even quicker if you don't mind your steps. If you have guts enough to send your character to this city, you could become filthy fucking rich or dead fucking poor.</label> */}
              </div>
            </div>
            <div className="staking-room-three" onClick={() => openStakeRoom(3)}>
              <div className={roomThreeInfoClass}>
                <h2>The Basement</h2>
                {/* <label>You can either choose to send your character on a mission or let them meditate in the silence of Alpha Basement.<br/>While in the basement, as meditation relaxes the body and strengthens the mind, the whole process takes a long amount of time, but remember, its rewards are simply unimaginable!<br/>The character doesn't earn any $GLCH token but they earn 2000 +RESPECT/ week.<br/>Since the whole process requires tons of focus and full commitment of the body and the soul, should you choose to send your character here, he'll only earn his rewards after a week. If you pull him out before the week ends, there'll be no rewards.</label> */}
              </div>
            </div>
            <div className="staking-room-four" onClick={() => openStakeRoom(4)}>
              <div className={roomFourInfoClass}>
                <h2>Magnexia</h2>
                {/* <label>Not much is known about this mysterious city, except that no human has been known to have entered this city after its formation during the Great Cywar of 3333. Rumours say that only cyborgs live here and even that the city doesn't really follow a set of physical laws. You can only choose to send your character on a mission here if he is a cyborg (trait).</label> */}
              </div>
            </div>
            <div className="staking-room-five" onClick={() => openStakeRoom(5)}>
              <div className={roomTwoInfoClass}>
                <h2>Raudcheri</h2>
                {/* <label>Once the most glowing and growing hub of Alphazex, Raudcheri has seen equal shares of glorious glamours and glitchy glooms. Ruled by the Nichas, the city structure and people were divided in the early riots of 4242. The north sporting the worst of the worst, the most corrupt and evil and the south blessed with angels, the most kind hearted. So if you choose to send your character on a mission in this city, there's no telling to what kind of adventures and people he'll have to deal with and so no guarantees of the amount of rewards.</label> */}
              </div>
            </div>
            <div className="staking-room-seven" onClick={() => setShowStakeDashboard(true)}>
            <button className="outside-stake-btn">General Dashboard</button>
            </div> 
            {!wallet.connected &&
            <div className="staking-room-six">
              <WalletDialogButton className="Connect-Wallet-btn">
                Connect Wallet
              </WalletDialogButton>
            </div> 
            }
            {wallet.connected &&
            <div className="staking-room-six" onClick={openStaking}>
              <button className="outside-stake-btn">Stake Now</button>
            </div> 
            }
          </div>
        )}
        {showStaking && (
          <div className="Backdrop-other-mint">
            <OutsideClickHandler onOutsideClick={closeStaking}>
              <div className="stake-room-opened">
                <img className="stake-close-image" onClick={closeStaking} src={Close} />
                {nftStakeStep == 0 && 
                <div className="pull-left full-width full-height">
                    <div className="stake-room-header">
                      <h2>NFT Selection</h2>
                    </div>
                    <div className="nft-parent-div">
                      {nfts && nfts.length > 0 && nfts.map(function (item:any, i:any) {
                        return (
                          <div className="nft-div" style={{borderColor: stakedNft == item ? "white": "transparent"}} onClick={() => setStakedNft(item)}>
                            <img src={item.link} />
                            <label>{item.name}</label>
                          </div>
                        );
                      })}
                    </div>
                    {stakedNft && 
                    <div className="stake-button-div"> 
                      <button className="nft-select-button" onClick={nextStepStake}>Next</button>
                    </div>
                    }
                </div>
                }
                {nftStakeStep == 1 && 
                <div className="pull-left full-width full-height">
                    <div className="stake-room-header">
                      <h2>City Selection</h2>
                    </div>
                    <div className="nft-parent-div">
                      {citys.map(function (item:any, i) {
                        return (
                          <div className="nft-div" style={{borderColor: stakedCity == item.name ? "white": "transparent"}} onClick={() => setStakedCity(item.name)}>
                            <img src={item.link} />
                            <label>{item.name}</label>
                          </div>
                        );
                      })}
                    </div>
                    {stakedCity && stakedCity.length > 0 && 
                    <div className="stake-button-div"> 
                      <button className="nft-select-button" onClick={nextStepStake}>Next</button>
                    </div>
                    }
                </div>
                }
                {nftStakeStep == 2 && 
                <div className="pull-left full-width full-height">
                    <div className="nft-deal-div">
                      <h2 className="deal-finalizing-text">Finalizing the Deal</h2>
                    </div>
                </div>
                }
                {nftStakeStep == 3 && 
                <div className="pull-left full-width full-height">
                    <div className="nft-parent-div">
                      <h2 className="stake-congrats-header">Congratulations !!!</h2>
                      <label className="stake-congrats-text">Your {stakedNft.name} has been<br/>successfully staked in<br/>{stakedCity}</label>
                    </div>
                </div>
                }
              </div>
            </OutsideClickHandler>
          </div>
        )}
        {showStakeCity && (
          <div className="Backdrop-other-mint">
            <OutsideClickHandler onOutsideClick={closeStakeCity}>
              <div className="stake-room-opened">
                <img className="stake-close-image" onClick={closeStakeCity} src={Close} />
                <div className="stake-room-header">
                  <h2>{currentStakeRoom == 1 && <span>MAHANOTHIA</span>}{currentStakeRoom == 2 && <span>SAN CHETOS</span>}{currentStakeRoom == 3 && <span>THE BASEMENT</span>}{currentStakeRoom == 4 && <span>MAGNEXIA</span>}{currentStakeRoom == 5 && <span>RAUDCHERI</span>} <button className="stake-now-button" onClick={stakeFromCity}>Stake Now</button></h2>
                </div>
                <div className="stake-room-stats">
                  <div className="stake-first-stat">
                    <label>Global<br/>Staked</label>
                    <h2>0%</h2>
                  </div>
                  <div className="stake-first-stat">
                    <label>Personal<br/>Staked</label>
                    <h2>0%</h2>
                  </div>
                  <div className="stake-first-stat">
                    <label>Personal Tokens<br/>Generated</label>
                    <h2>0</h2>
                  </div>
                  <div className="stake-first-stat">
                    <label>NFTs<br/>Staked</label>
                    <h2>0</h2>
                  </div>
                </div>
                <div className="stake-room-info" id="alpha-scroll">
                  {currentStakeRoom == 1 && 
                  <label className="stake-typing-text">The oldest of the cities, ruled by the wisest and most trusted royal family in the whole of Alphazex, the Avrupans. The culture, the architecture style, the communities, the military, all designed so perfectly that even after a thousand years, they stand the test of time. Crime doesn't exist in Mahanothia and so, once your character enters this stoic city for their mission they are sure to leave it with guaranteed rewards.</label>
                  }
                  {currentStakeRoom == 2 && 
                  <label className="stake-typing-text">Ancestors of Jesse might refer to this city as a mix of Las Vegas, Monte Carlo, Cuba and Dubai. Filled with dazzling lights, gorgeous people and most importantly fuck tons of money, but equally surrounded with gambling dens, mafia and drugs. Just as quickly you can rise to top of the world in this city, you'll fall even quicker if you don't mind your steps. If you have guts enough to send your character to this city, you could become filthy fucking rich or dead fucking poor.</label>
                  }
                  {currentStakeRoom == 3 && 
                  <label className="stake-typing-text">You can either choose to send your character on a mission or let them meditate in the silence of Alpha Basement.<br/>While in the basement, as meditation relaxes the body and strengthens the mind, the whole process takes a long amount of time, but remember, its rewards are simply unimaginable!<br/>The character doesn't earn any $GLCH token but they earn 2000 +RESPECT/ week.<br/>Since the whole process requires tons of focus and full commitment of the body and the soul, should you choose to send your character here, he'll only earn his rewards after a week. If you pull him out before the week ends, there'll be no rewards.</label>
                  }
                  {currentStakeRoom == 4 && 
                  <label className="stake-typing-text">Not much is known about this mysterious city, except that no human has been known to have entered this city after its formation during the Great Cywar of 3333. Rumours say that only cyborgs live here and even that the city doesn't really follow a set of physical laws. You can only choose to send your character on a mission here if he is a cyborg (trait).</label>
                  }
                  {currentStakeRoom == 5 && 
                  <label className="stake-typing-text">Once the most glowing and growing hub of Alphazex, Raudcheri has seen equal shares of glorious glamours and glitchy glooms. Ruled by the Nichas, the city structure and people were divided in the early riots of 4242. The north sporting the worst of the worst, the most corrupt and evil and the south blessed with angels, the most kind hearted. So if you choose to send your character on a mission in this city, there's no telling to what kind of adventures and people he'll have to deal with and so no guarantees of the amount of rewards.</label>
                  }
                </div>
              </div>
            </OutsideClickHandler>
          </div>
        )}
        {showStakeDashboard && (
          <div className="Backdrop-other-mint">
            <OutsideClickHandler onOutsideClick={() => setShowStakeDashboard(false)}>
              <div className="stake-room-opened">
                <img className="stake-close-image" onClick={() => setShowStakeDashboard(false)} src={Close} />
                <div className="stake-room-header">
                  <h2 className="p-l-10-i">General Dashboard</h2>
                </div>
                <div className="gen-dashboard-scroller">
                  <div className="gen-dahboard-stats">
                    <div className="gen-dashboard-stats-left">
                      <label>NFTs Staked</label>
                      <h2>{stakedNfts.length} {unstakedNft != null && <button className="nft-select-button" onClick={UnStakeNft}>Unstake</button>}</h2>
                    </div>
                    <div className="gen-dashboard-stats-right">
                      {stakedNfts && stakedNfts.length > 0 && stakedNfts.map(function (item:any, i:any) {
                        return (
                          <div className="nft-small-div" style={{borderColor: unstakedNft == item ? "white": "transparent"}} onClick={() => setUnstakedNft(item)}>
                            <img src={item.link} />
                            <label>{item.name}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="gen-dahboard-stats">
                    <div className="gen-dashboard-stats-left">
                      <label>Tokens Generated</label>
                      <h2>{stakedTokens}</h2>
                    </div>
                    <div className="gen-dashboard-stats-right">
                      {stakedNfts && stakedNfts.length > 0 && stakedNfts.map(function (item:any, i:any) {
                        return (
                          <div className="nft-small-div">
                            <img src={item.link} />
                            <label>{item.name}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="gen-dahboard-stats">
                    <div className="gen-dashboard-stats-left">
                      <label>Respect Generated</label>
                      <h2>{respectEarned}</h2>
                    </div>
                    <div className="gen-dashboard-stats-right">
                      {stakedNfts && stakedNfts.length > 0 && stakedNfts.map(function (item:any, i:any) {
                        return (
                          <div className="nft-small-div">
                            <img src={item.link} />
                            <label>{item.name}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="gen-dahboard-stats">
                    <div className="gen-dashboard-stats-left">
                      <label>Multiplier Level</label>
                      <h2>{multiplierLevel}</h2>
                    </div>
                    <div className="gen-dashboard-stats-right">
                      {stakedNfts && stakedNfts.length > 0 && stakedNfts.map(function (item:any, i:any) {
                        return (
                          <div className="nft-small-div">
                            <img src={item.link} />
                            <label>{item.name}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
              </div>
            </OutsideClickHandler>
          </div>
        )}
        {showFirstPhil && (
          <div className="Backdrop-other">
            <OutsideClickHandler onOutsideClick={closeAlphaUpdates}>
              <div className="alpha-holo">
                <div className="alpha-holo-updates" id="alpha-scroll">
                  <img
                    alt="Story-background"
                    src={AlphaScroll}
                    className="alpha-scroll-icon"
                    onClick={scrollStory}
                  />
                  <label className="typing-text">
                    In the year 6969, a gang of 4 kids, led by their leader
                    Jesse, venture out into the wild post-apocalyptic cyberpunk
                    world of Alphazex, traveling through various cities,
                    meandering through multiple adventures, just to answer a
                    single question...
                  </label>
                  <label className="typing-text m-t-15">
                    Throughout the world of Alphazex, there is only one
                    safeplace, one haven for Jesse and his friends. It's the
                    Alpha hood.{" "}
                  </label>
                  <label className="typing-text m-t-15">
                    Originally, what was one of the biggest laboratories in the
                    world for AI research, Alpha Labs was destroyed in the world
                    wars that kept on occurring, The not-so-okay wars, the Creck
                    wars, the cult vs tribe wars, and the once grand building of
                    Alpha Labs was destroyed, or that's what people thought.
                  </label>
                  <label className="typing-text m-t-15">
                    Goverments and rulers came and went, and even though the
                    existence of autonomous organizations was banned, one group
                    thrived in the ruins of the same building that was thought
                    to not exist. This organisation was, Secret Alpha.
                  </label>
                </div>
              </div>
            </OutsideClickHandler>
          </div>
        )}
        {showWhitelist && 
        <div>
          <div className="Backdrop-other-mint">
            <OutsideClickHandler onOutsideClick={closeUpdates}>
              <div className="bigger-holo">
                <div className="mint-inside-div">
                  <div className="whitelist-parent">
                    {!wallet.connected && 
                    <div className="pull-left full-width text-center">
                      <WalletDialogButton className="Inside-Connect-btn">
                        Connect
                      </WalletDialogButton>
                    </div>
                    }
                    <button className="whitelist-create-button m-t-15" onClick={createWhitelistConfig}>Create Whitelist Config</button>
                    <div className="pull-left full-width text-center m-t-15 m-b-15">
                      <label className="whitelist-texts">Created Whitelist Accounts : {createdWlCounts}</label>
                      {/* <button className="whitelist-account-create" onClick={createWhitelistAccountMultiple}>Create 10 Accounts</button> */}
                    </div>
                  </div>
                </div>
              </div>
            </OutsideClickHandler>
          </div>
        </div>}
        {showUpdates && (
          <div className="Backdrop-other-mint">
            <OutsideClickHandler onOutsideClick={closeUpdates}>
              {wallet.connected && 
              <div className="bigger-holo">
                <div className="holo-updates">
                  {currentWl != '' &&
                  <div className="mint-inside-div">
                    {/* {!isMobile && 
                    <img
                      src={InfoMint}
                      onMouseOver={() => setShowMintInfo(true)}
                      onMouseLeave={() => setShowMintInfo(false)}
                      className={
                        showMintInfo
                          ? "mint-info opacity-0"
                          : "mint-info opacity-1"
                      }
                    />
                    }
                    {isMobile && 
                    <img
                      src={InfoMint}
                      onClick={() => setShowMintInfo(!showMintInfo)}
                      className={
                        showMintInfo
                          ? "mint-info opacity-0"
                          : "mint-info opacity-1"
                      }
                    />
                    } */}
                    {!isMobile && 
                    <div className={showMintInfo ? "mint-info-total opacity-1" : "mint-info-total opacity-0"}>
                      <h2 className="pull-left full-width text-center m-t-5 m-b-10">
                        Details
                      </h2>
                      <label className="pull-left full-width m-t-3 m-b-3">
                        GOG <b>123</b>
                        <span className="mint-info-dot"></span>MAX{" "}
                        <b>3 TOKENS</b>
                        <span className="mint-info-dot"></span>PRICE <b>1.69</b>
                      </label>
                      <label className="pull-left full-width m-t-3 m-b-3">
                        OG <b>690</b>
                        <span className="mint-info-dot"></span>MAX{" "}
                        <b>2 TOKENS</b>
                        <span className="mint-info-dot"></span>PRICE <b>1.90</b>
                      </label>
                      <label className="pull-left full-width m-t-3 m-b-3">
                        WL <b>5500</b>
                        <span className="mint-info-dot"></span>MAX{" "}
                        <b>1 TOKEN</b>
                        <span className="mint-info-dot"></span>PRICE <b>1.90</b>
                      </label>
                      <label className="pull-left full-width m-t-3 m-b-3">
                        PUBLIC <span className="mint-info-dot"></span>{" "}
                        <b>UNLIMITED</b> <span className="mint-info-dot"></span>{" "}
                        PRICE <b>2.29</b>
                      </label>
                    </div>
                    }
                    {isMobile && showMintInfo && 
                    <div className="Backdrop-mobile">
                      <OutsideClickHandler onOutsideClick={() => setShowMintInfo(false)}>
                        <div className={showMintInfo ? "mint-info-total opacity-1" : "mint-info-total opacity-0"}>
                        <span className="close-nft-success-message" onClick={() => setShowMintInfo(false)}>X</span>
                          <h2 className="pull-left full-width text-center m-t-5 m-b-10">
                            Details
                          </h2>
                          <label className="pull-left full-width m-t-3 m-b-3">
                            GOG <b>123</b>
                            <span className="mint-info-dot"></span>MAX{" "}
                            <b>3 TOKENS</b>
                            <span className="mint-info-dot"></span>PRICE <b>1.69</b>
                          </label>
                          <label className="pull-left full-width m-t-3 m-b-3">
                            OG <b>690</b>
                            <span className="mint-info-dot"></span>MAX{" "}
                            <b>2 TOKENS</b>
                            <span className="mint-info-dot"></span>PRICE <b>1.90</b>
                          </label>
                          <label className="pull-left full-width m-t-3 m-b-3">
                            WL <b>5500</b>
                            <span className="mint-info-dot"></span>MAX{" "}
                            <b>1 TOKEN</b>
                            <span className="mint-info-dot"></span>PRICE <b>1.90</b>
                          </label>
                          <label className="pull-left full-width m-t-3 m-b-3">
                            PUBLIC <span className="mint-info-dot"></span>{" "}
                            <b>UNLIMITED</b> <span className="mint-info-dot"></span>{" "}
                            PRICE <b>2.29</b>
                          </label>
                        </div>
                      </OutsideClickHandler>
                    </div>
                    }
                    {/* {!isMobile && 
                    <div className="pull-left full-width">
                      <div className="Items-available-div">
                        <label className="items-available-text">
                          {currentWl == "COMMUNITY" && <span>GOG + OG - Mint in</span>}
                          {currentWl == "GOG + OG" && <span>WL - Mint in</span>}
                          {currentWl == "WL" && <span>PUBLIC - Mint in</span>}
                          {currentWl == "" && <span>COMMUNITY - Mint in</span>}
                          {currentWl == "PUBLIC" && <span>PUBLIC MINT</span>}
                        </label>
                        <label className="items-available-text">
                          {currentWl != "PUBLIC" && (
                            <span className="fs-36-i">{time}</span>
                          )}
                          {currentWl == "PUBLIC" && <span>---</span>}
                        </label>
                      </div>
                      <div className="Current-whitelist-div">
                        <label className="items-available-text text-center-i m-t-b-5">
                          {currentWl} Mint
                        </label>
                      </div>
                    </div>
                    } */}
                    {/* {isMobile && 
                    <div className="current-whitelist">{currentWl}</div>
                    } */}
                    {/* {isMobile && 
                    <label className="pull-left full-width text-center m-t-15 m-b-10 courier mint-text-color">
                      {currentWl == "COMMUNITY" && <span>GOG + OG - Mint in</span>}
                      {currentWl == "GOG + OG" && <span>WL - Mint in</span>}
                      {currentWl == "WL" && <span>PUBLIC - Mint in</span>}
                      {currentWl == "" && <span>COMMUNITY - Mint in</span>}
                      {currentWl == "PUBLIC" && <span>PUBLIC MINT</span>}
                    </label>
                    }
                    {isMobile &&
                    <label className="pull-left full-width text-center m-t-0 m-b-10 courier mint-text-color">
                      {currentWl != "PUBLIC" && (
                        <span className="fs-36-i">{time}</span>
                      )}
                      {currentWl == "PUBLIC" && <span>---</span>}
                    </label>
                    } */}
                    <h1 className="minted-out">Minted Out</h1>
                    {!isMobile &&
                    <label className="completed-counts m-b-20">
                      4200 /4200
                    </label>
                    }
                    {!isMobile && (
                      <div className="battery">
                        {setBars.map(function (item, i) {
                          if (100 >= item) {
                            return (
                              <div
                                className="bar active"
                                data-power={item}
                              ></div>
                            );
                          } else {
                            return (
                              <div className="bar" data-power={item}></div>
                            );
                          }
                        })}
                      </div>
                    )}
                    {isMobile &&
                    <CircularProgressbar value={100} text={4200 + '/' + 4200} />
                    }
                    {/* <div className="mint-progress">
                      <ProgressBar bgcolor={"#6a1b9a"} completed={completed} />
                    </div> */}
                    {/* <div className="remaining-time-div m-t-0 m-b-15 spacing-counts">
                      <div className="mint-count">
                        <button
                          className="decrease-count"
                          onClick={decreaseMintCount}
                        >
                          -
                        </button>
                        <label>{mintCount}</label>
                        <button
                          className="increase-count"
                          onClick={increaseMintCount}
                        >
                          +
                        </button>
                      </div>
                    </div> */}
                    {/* <div className="remaining-time-div m-t-0 m-b-15">
                      {!wallet.connected ? (
                        <div className="Top-connected red">
                          <WalletDialogButton className="Inside-Connect-btn">
                            Connect
                          </WalletDialogButton>
                        </div>
                      ) : (
                        <div
                          className={
                            isUserMinting
                              ? "Top-connected green disabled-btn"
                              : "Top-connected green"
                          }
                        >
                          <button
                            className={
                              shouldMint
                                ? "Inside-Mint-btn w-200"
                                : "Mint-btn-disabled w-200"
                            }
                            onClick={whiteListCheckMint}
                          >
                            {isUserMinting ? "Minting" : "Mint Now"}
                          </button>
                        </div>
                      )}
                    </div> */}
                    {/* {mintSuccessMessage && (
                      <div className="nft-success-mint-message">
                        <span
                          className="close-nft-success-message"
                          onClick={() => setMintSuccessMessage(false)}
                        >
                          X
                        </span>
                        {mintResponseType == 'error' && 
                        <h2 className="pull-left full-width text-center m-t-10 m-b-10">
                          Error
                        </h2>
                        }
                        {mintResponseType == 'success' && 
                        <h2 className="pull-left full-width text-center m-t-10 m-b-10">
                          Congratulations
                        </h2>
                        }
                        <label className="nft-message-success">
                          {mintResponse}
                        </label>
                      </div>
                    )} */}
                  </div>
                  }
                  {currentWl == '' &&
                  <div className="before-mint-text">
                    <label>SHH!!! You're early Mint starts in</label>
                    <h1>{time}</h1>
                  </div>
                  }
                </div>
              </div>
              }
              {!wallet.connected &&
              <div className="bigger-holo">
                <div className="holo-updates">
                  <div className="mint-inside-div">
                    <WalletDialogButton className="Connect-Wallet-btn">
                      Connect Wallet
                    </WalletDialogButton>
                  </div>
                </div>
              </div>
              }
            </OutsideClickHandler>
          </div>
        )}
        {showFarming && (
          <div className="Backdrop-other-mint">
            <OutsideClickHandler onOutsideClick={() =>closeFarming()}>
              {wallet.connected && 
              <div className="bigger-holo">
                <div className="stake-room-farm">
                  <div className="gen-dashboard-scroller">
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <button className="Inside-Farm-btn" onClick={() => initFixedFarm(1)}>Start MAHANOTHIA Farm</button>
                      </div>
                      <div className="gen-farm-stats-right">
                        {mahanothiaFarm && <label>MAHANOTHIA FARM ID : {MAHANOTHIA_FARM_ID.toBase58()}</label>}
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <button className="Inside-Farm-btn" onClick={() => initProbableFarm(2)}>Start RAUDCHERI Farm</button>
                      </div>
                      <div className="gen-farm-stats-right">
                        {raudcheriFarm && <label>RAUDCHERI FARM ID : {RAUDCHERI_FARM_ID.toBase58()}</label>}
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <button className="Inside-Farm-btn" onClick={() => initProbableFarm(3)}>Start SAN CHETOS Farm</button>
                      </div>
                      <div className="gen-farm-stats-right">
                        {sanChetosFarm && <label>SAN CHETOS FARM ID : {SAN_CHETOS_FARM_ID.toBase58()}</label>}
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <button className="Inside-Farm-btn" onClick={() => initFixedFarm(4)}>Start MAGNEXIA Farm</button>
                      </div>
                      <div className="gen-farm-stats-right">
                        {magnexiaFarm && <label>MAGNEXIA FARM ID : {MAGNEXIA_FARM_ID.toBase58()}</label>}
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <button className="Inside-Farm-btn" onClick={() => initFixedFarm(5)}>Start BASEMENT Farm</button>
                      </div>
                      <div className="gen-farm-stats-right">
                        {basementFarm && <label>BASEMENT FARM ID : {BASEMENT_FARM_ID.toBase58()}</label>}
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Funder to Authorize" value={funderOne} onChange={event => setFunderOne(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => authorizeFunder(1)}>Authorize Funder For Mahanothia</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Funder to Authorize" value={funderTwo} onChange={event => setFunderTwo(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => authorizeFunder(2)}>Authorize Funder For Raudcheri</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Funder to Authorize" value={funderThree} onChange={event => setFunderThree(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => authorizeFunder(3)}>Authorize Funder For San Chetos</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Funder to Authorize" value={funderFour} onChange={event => setFunderFour(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => authorizeFunder(4)}>Authorize Funder For Magnexia</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Funder to Authorize" value={funderFive} onChange={event => setFunderFive(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => authorizeFunder(5)}>Authorize Funder For Basement</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="NFT Mint" value={nftMint} onChange={event => setNftMint(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={addRaritiesToBank}>Add Rarities to Bank</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Collection Id" value={collectionIdInputOne} onChange={event => setCollectionIdInputOne(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => addToBankWhitelist(1)}>Add To Mahanothia Bank Whitelist</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Collection Id" value={collectionIdInputTwo} onChange={event => setCollectionIdInputTwo(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => addToBankWhitelist(2)}>Add To Raudcheri Bank Whitelist</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Collection Id" value={collectionIdInputThree} onChange={event => setCollectionIdInputThree(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => addToBankWhitelist(3)}>Add To San Chetos Bank Whitelist</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Collection Id" value={collectionIdInputFour} onChange={event => setCollectionIdInputFour(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => addToBankWhitelist(4)}>Add To Magnexia Bank Whitelist</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Collection Id" value={collectionIdInputFive} onChange={event => setCollectionIdInputFive(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={() => addToBankWhitelist(5)}>Add To Basement Bank Whitelist</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <input className="authorize-funder-reward-input" placeholder="Collection Id" value={collectionIdMint} onChange={event => setCollectionIdMint(event.target.value)} />
                      </div>
                      <div className="gen-farm-stats-right">
                        <button className="Inside-Farm-btn" onClick={addToBankWhitelistMint}>Add Mint To Bank Whitelist</button>
                      </div>
                    </div>
                    <div className="gen-farm-stats">
                      <div className="gen-farm-stats-left">
                        <button className="Inside-Farm-btn" onClick={fundReward}>Fund Reward</button>
                      </div>
                      <div className="gen-farm-stats-right">
                        {/* {stakedNfts && stakedNfts.length > 0 && stakedNfts.map(function (item:any, i:any) {
                          return (
                            <div className="nft-small-div">
                              <img src={item.link} />
                              <label>{item.name}</label>
                            </div>
                          );
                        })} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              }
              {!wallet.connected &&
              <div className="bigger-holo">
                <div className="holo-updates">
                  <div className="mint-inside-div">
                    <WalletDialogButton className="Connect-Wallet-btn">
                      Connect Wallet
                    </WalletDialogButton>
                  </div>
                </div>
              </div>
              }
            </OutsideClickHandler>
          </div>
        )}
        {!logoLoading && logoAlphaLoading && (
          <div className="logo-loader-parent-alpha">
            <img alt="Alpha-logo" src={LogoWhite} className="pulse-animation" />
          </div>
        )}
      </div>
      <Snackbar
        className="snack-bar"
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          className="bold"
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
