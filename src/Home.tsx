import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import MobileMenu from "./assets/mobile_menu.png";
import OutsideClickHandler from "react-outside-click-handler";
import { useWallet } from "@solana/wallet-adapter-react";
import TypeAnimation from "react-type-animation";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import {
  awaitTransactionSignatureConfirmation,
  MagicHatAccount,
  getMagicHatState,
  mintOneToken,
  mintOneTokenWL,
} from "./candy-machine";
import { AlertState } from "./utils";
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
import MenuContent from "./components/menu";
import CloseAlpha from "./assets/turn-back.png";
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
  COMMUNITY_PRICE
} from "./config";
import idl from "./magic_hat.json";
import { BN, Program } from "@project-serum/anchor";
import Borsh from "@project-serum/borsh";
import ProgressBar from "./components/progress-bar";
import { u64 } from "@solana/spl-token";
import InfoMint from "./assets/mint_info.png";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { sendTransactions } from "./connection";

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
  const url = window.location.origin;
  if (!url.includes('https')) {
    if (url.split(':')[2]) {
      var loc:any = 'https:' + url.split(':')[1] + ':' +  + url.split(':')[2];
      window.location = loc;
    }
    else {
      var loc:any = 'https:' + url.split(':')[1];
      window.location = loc;
    }
  }
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
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showAlphaRoom, setShowAlphaRoom] = useState(false);
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
  const [createdWlCounts, setCreatedWlCounts] = useState(0);
  const [mintResponse, setMintResponse] = useState("");
  const [mintResponseType, setMintResponseType] = useState("");
  const [maxCount, setMaxCount] = useState<number>(3);
  const [setBars] = useState([
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
    42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78,
    80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100,
  ]);

  const wallet = useWallet();
  wallet.connect();

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
    }
    if (mintCount <= 1) {
    } else {
      var k = mintCount - 1;
      setMintCount(k);
    }
  };

  useEffect(() => {
    // anchor.Wallet.C;
    refreshMagicHatState();
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
      setShowTeamRoom(false);
      setShowMobileDoor(true);
    } else {
      setClassNameState("main-bg-after-door-open");
      setLogoAlphaLoading(false);
      setShowAlphaRoom(false);
      setShowTeamRoom(false);
    }
  };

  const whiteListCheckMint = async () => {
    try {
      const walletProgram = await getProgram();
      console.log(MAGIC_HAT_PROGRAM_V2_ID.toBase58());
      console.log(await walletProgram.account.walletWhitelist.all());
      const [wallet_pda, wallet_bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(pdaSeed),
          wallet.publicKey!.toBuffer(),
          MAGIC_HAT_CREATOR!.toBuffer(),
        ],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const whitelistAccounts: any =
        await walletProgram.account.walletWhitelist.fetch(wallet_pda);
      console.log(whitelistAccounts);
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
      // setAlertState({
      //   open: true,
      //   message: "You are not whitelisted for " + mintCount + " NFTs!!!",
      //   severity: "error",
      // });
    }
  };

  const getWhitelistConfig = async () => {
    try {
      const walletProgram = await getProgram();
      const [whitelist_config_pda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(pdaWhitelistSeed), wallet.publicKey!.toBuffer()],
        MAGIC_HAT_PROGRAM_V2_ID
      );
      const whitelistConfigAccounts =
        await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda);
      console.log(whitelistConfigAccounts);
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
      const whitelistConfigAccounts =
        await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda);
      console.log(whitelistConfigAccounts);
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
        new BN(GOG_PRICE * LAMPORTS_PER_SOL),
        new BN(COMMUNITY_TIME),
        new BN(369),
        new BN(OG_PRICE * LAMPORTS_PER_SOL),
        new BN(GOG_TIME),
        new BN(1380),
        new BN(WL_PRICE * LAMPORTS_PER_SOL),
        new BN(GOG_TIME),
        new BN(5000),
        new BN(PUBLIC_PRICE * LAMPORTS_PER_SOL),
        new BN(WL_TIME),
        {
          accounts: {
            whitelistConfig: whitelist_config_pda,
            magicHatCreator: wallet.publicKey,
          },
        }
      );
      const whitelistConfigAccounts =
        await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda);
      console.log(whitelistConfigAccounts);
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
      const whitelistAccounts =
        await walletProgram.account.walletWhitelist.fetch(wallet_pda);
      console.log(whitelistAccounts);
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
      const whitelistAccounts =
        await walletProgram.account.walletWhitelist.fetch(wallet_pda);
      console.log(whitelistAccounts);
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
    }
    if (currentWltype == "PUBLIC") {
      return "";
    } else {
      if (currentWltype == "GOG + OG") {
        const date = new Date();
        const time: any = parseInt((date.getTime() / 1000).toFixed(0));
        // if (WL_TIME >= time) {
        //   setCurrentWl('WL');
        //   return;
        // }
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
        // let hours:any = parseInt((((time) - WL_TIME) / 3600).toFixed(0));
        // let minutes:any = parseInt(((((time) - WL_TIME) % 3600) / 60).toFixed(0));
        // let seconds:any = parseInt((((time) - WL_TIME) % 60).toFixed(0));
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
        // if (GOG_TIME > time) {
        //   setCurrentWl('GOG + OG');
        //   return;
        // }
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
        // let hours:any = parseInt((((time) - WL_TIME) / 3600).toFixed(0));
        // let minutes:any = parseInt(((((time) - WL_TIME) % 3600) / 60).toFixed(0));
        // let seconds:any = parseInt((((time) - WL_TIME) % 60).toFixed(0));
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
      const whitelistConfigAccounts =
        await walletProgram.account.whitelistConfig.fetch(whitelist_config_pda);
      console.log(whitelistConfigAccounts);
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
    setShowMobileDoor(false);
  };

  const handleMobileHome = async () => {
    if (showAlphaRoom || showTeamRoom) {
      closeAlphaRoom();
    } else {
      closeForm();
    }
  };

  const openMenu = async () => {
    setMenuOpen(true);
  };

  const openAlphaRoom = async () => {
    if (isMobile) {
      if (mobileDoor === "ALPHA") {
        setClassNameState("main-bg-after-door-open black-bg");
        setLogoAlphaLoading(true);
        setTimeout(function () {
          setLogoAlphaLoading(false);
          setClassNameState("alpha-room");
          setShowTeamRoom(false);
          setShowAlphaRoom(true);
          setShowMobileDoor(false);
        }, 600);
      } 
      // else if (mobileDoor === "TEAM") {
      //   setClassNameState("main-bg-after-door-open black-bg");
      //   setLogoAlphaLoading(true);
      //   setTimeout(function () {
      //     setLogoAlphaLoading(false);
      //     setClassNameState("team-room");
      //     setShowTeamRoom(true);
      //     setShowAlphaRoom(false);
      //     setShowMobileDoor(false);
      //   }, 600);
      // }
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
      setClassNameState("main-bg-after-door-open black-bg");
      setLogoAlphaLoading(true);
      setTimeout(function () {
        setClassNameState("alpha-room");
        setLogoAlphaLoading(false);
        setShowAlphaRoom(true);
        setShowMobileDoor(false);
      }, 600);
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
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div
              onClick={() => showToaster(5)}
              // onClick={withdrawFunds}
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
          <div className="mobile-room-div" onClick={openAlphaRoom}></div>
        )}
        {!logoLoading &&
          !showAlphaRoom &&
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
          !logoAlphaLoading &&
          !isMobile && (
            <div
              onClick={() => openAlphaRoom()}
              className="alpha-room-div"
            ></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div onClick={() => showToaster(5)} className="team-room-div"></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <div onClick={closeForm} className="alpha-logo-div"></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
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
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && <div className="hologram-setup-div"></div>}
        {!logoLoading &&
          !showAlphaRoom &&
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
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            // <div onClick={setCollection} className="light-flicker-image"></div>
            <div className="light-flicker-image"></div>
          )}
        {!logoLoading &&
          !showAlphaRoom &&
          !showTeamRoom &&
          !logoAlphaLoading &&
          !isMobile && (
            <img
              alt="Sider"
              src={SophaSider}
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
        {showAlphaRoom && !logoAlphaLoading && !logoLoading && !showMobileDoor && (
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
                          {currentWl == "GOG + OG" && <span>WL - Mint in</span>}
                          {currentWl == "WL" && <span>PUBLIC - Mint in</span>}
                          {currentWl == "" && <span>GOG + OG - Mint in</span>}
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
                      {currentWl == "GOG + OG" && <span>WL - Mint in</span>}
                      {currentWl == "WL" && <span>PUBLIC - Mint in</span>}
                      {currentWl == "" && <span>GOG + OG - Mint in</span>}
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
