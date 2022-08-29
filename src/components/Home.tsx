import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction, Transaction, Connection, GetProgramAccountsFilter, TokenAccountsFilter, clusterApiUrl } from "@solana/web3.js";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import { AlertState } from "../utils/utils";
import DownArrow from "../assets/down-arrow.png";
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
import idl from "../idl/magic_hat.json";
import idlStake from "../idl/magic_stake.json";
import idlBank from "../idl/gem_bank.json";
import { BN, Program } from "@project-serum/anchor";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { sendTransactions } from "../config/connection";
import { getParsedNftAccountsByOwner,isValidSolanaAddress, createConnectionConfig,} from "@nfteyez/sol-rayz";
import { programs } from "@metaplex/js";
import { Button, Flex } from "@chakra-ui/react";
import Switch from "react-switch";

const MAGIC_HAT_PROGRAM_V2_ID = new anchor.web3.PublicKey(
  "JBw14YzhNTQGqUX54MatDgxDrCPopKf4EGcJHoHfq5ha"
);

const content = (
  <div></div>
);

const steps = [
  { label: 'Step 1', content },
  { label: 'Step 2', content },
  { label: 'Step 3', content },
];

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
  const [teamInfoMember, setTeamInfoMember] = useState<any>(null);
  const [whitelists, setWhitelists] = useState<any>(null);
  const [completed, setCompleted] = useState(0);
  const [mintCount, setMintCount] = useState(1);
  const [currentWl, setCurrentWl] = useState("");
  const [time, setTime] = useState("");
  const [mintAuthority, setMintAuthority] = useState(false);
  const [freezeAuthority, setFreezeAuthority] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [menuOpened, setMenuOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenNameUtil, setTokenNameUtil] = useState("");
  const [tokenDescriptionUtil, setTokenDescriptionUtil] = useState("");
  const [tokenSymbolUtil, setTokenSymbolUtil] = useState("");
  const [mintAuthorityUtil, setMintAuthorityUtil] = useState(false);
  const [freezeAuthorityUtil, setFreezeAuthorityUtil] = useState(false);

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

  let nftStakeStepCount = 0;

  useEffect(() => {
    // anchor.Wallet.C;
    // refreshMagicHatState();
    var elem: HTMLElement | null = document.getElementById("main");
    if (elem!.clientWidth < 480) {
      setIsMobile(true);
    }
    // console.log(currentWl);
    setTimeout(function () {
      setLogoAlphaLoading(false);
    }, 900);
  }, [
    anchorWallet,
    props.magicHatId,
    props.connection,
    refreshMagicHatState,
    wallet,
    whitelists,
    currentWl,
  ]);

  let currentWltype: String;

  const changeStep = async (id:any) => {
    setUploadStep(id);
  }

  const changePage = async (id:any) => {
    setMenuOpened(false);
    if (currentPage != id) {
      setCurrentPage(id);
    }
  }

  const createWhitelistToken = async () => {
    console.log(tokenName);
    console.log(tokenDescription);
    console.log(tokenSymbol);
    console.log(mintAuthority);
    console.log(freezeAuthority);
  }

  const createUtilityToken = async () => {
    console.log(tokenNameUtil);
    console.log(tokenDescriptionUtil);
    console.log(tokenSymbolUtil);
    console.log(mintAuthorityUtil);
    console.log(freezeAuthorityUtil);
  }

  return (
    <div id="main" className={classNameState}>
      <div className="pull-left full-width">
        {wallet && wallet.connected ?
        (<div className="after-connect-div">
          <div className="pad-header-div">
            <div className="pad-header-account-div" onClick={() => setMenuOpened(!menuOpened)}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1024px-Faenza-avatar-default-symbolic.svg.png" className="pad-account-image"></img>
              <label className="pad-header-account-name">{wallet.publicKey?.toBase58()}</label>
              <img src={DownArrow} className="down-arrow-icon"></img>
            </div>
            {menuOpened && 
            <div className="user-account-options">
              <label className="user-account-option" onClick={() => changePage(1)}>Create Collection</label>
              <label className="user-account-option" onClick={() => changePage(2)}>Create a Whitelist Token</label>
              <label className="user-account-option" onClick={() => changePage(3)}>Create a Utility Token</label>
              <label className="user-account-option" onClick={() => changePage(4)}>Create a Hydra Wallet</label>
            </div>
            }
          </div>
          {currentPage == 1 && 
          <div className="launch-collection-div">
            <h2 className="launch-collection-title">Launch Collection</h2>
            <div className="Main-collection-upload-steps">
              <div onClick={() => changeStep(1)} className={uploadStep == 1 ? "upload-steps-header active-upload-steps-header" : "upload-steps-header"}>
                <label className="">Collection<br/>Details</label>
              </div>
              <div onClick={() => changeStep(2)} className={uploadStep == 2 ? "upload-steps-header active-upload-steps-header" : "upload-steps-header"}>
                <label className="">Upload<br/>Images</label>
              </div>
              <div onClick={() => changeStep(3)} className={uploadStep == 3 ? "upload-steps-header active-upload-steps-header" : "upload-steps-header"}>
                <label className="">Deploy<br/>on chain</label>
              </div>
              <div onClick={() => changeStep(4)} className={uploadStep == 4 ? "upload-steps-header active-upload-steps-header last-child" : "upload-steps-header last-child"}>
                <label className="">Mint<br/>Button</label>
              </div>
              {uploadStep == 1 &&
              <div className="collection-details-parent">
                <div className="collection-details-basic">
                  <div className="collection-details-basic-parent">
                    <label>Collection Details</label>
                    <label className="colection-details-label">Collection Name</label>
                    <input placeholder="Name" className="collection-details-input" />
                    <label className="colection-details-label">Symbol</label>
                    <input placeholder="Symbol" className="collection-details-input" />
                    <label className="colection-details-label">Launch Date</label>
                    <input placeholder="Symbol" type="date" className="collection-details-input" />
                    <label className="colection-details-label">Reveal Later</label>
                    <Switch height={24} width={50} onColor="#2948ff" onChange={() => setMintAuthority(!mintAuthority)} checked={mintAuthority} />
                    <label className="colection-details-label">Freeze Collection</label>
                    <Switch height={24} width={50} onColor="#2948ff" onChange={() => setFreezeAuthority(!freezeAuthority)} checked={freezeAuthority} />
                  </div>
                </div>
                <div className="collection-details-nft">
                  <div className="collection-details-nft-parent">
                    <div className="nft-details-first">
                      <label>NFT Details</label>
                      <label className="colection-details-label">Base Art Name</label>
                      <input placeholder="NFT #" className="collection-details-input" />
                      <label className="colection-details-label">Description</label>
                      <textarea placeholder="Symbol" className="collection-details-textarea"></textarea>
                      <div className="hlaf-div">
                        <label className="colection-details-label">Mint Cost</label>
                        <input placeholder="0.05" type="number" pattern="[0-9]+([.,][0-9]+)?" step="0.01" className="collection-details-input" />
                      </div>
                      <div className="hlaf-div">
                        <label className="colection-details-label">Royalities</label>
                        <input placeholder="2.5" type="number" pattern="[0-9]+([.,][0-9]+)?" step="0.01" className="collection-details-input" />
                      </div>
                    </div>
                    <div className="nft-details-second">
                      <label>Preview</label>
                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
          }
          {currentPage == 2 && 
          <div className="launch-collection-div">
            <h2 className="launch-collection-title">Create a Whitelist Token</h2>
            <div className="Create-whitelist-token-div">
              <div className="collection-details-parent">
                <div className="collection-details-full">
                  <div className="collection-details-basic-parent">
                    {/* <label>Collection Details</label> */}
                    <label className="colection-details-label">Token Name</label>
                    <input placeholder="Name" value={tokenName} onChange={() => setTokenName(tokenName)} className="collection-details-input" />
                    <label className="colection-details-label">Token Symbol</label>
                    <input placeholder="Symbol" value={tokenSymbol} onChange={() => setTokenSymbol(tokenSymbol)} className="collection-details-input" />
                    <label className="colection-details-label">Description</label>
                    <textarea placeholder="Symbol" value={tokenDescription} onChange={() => setTokenDescription(tokenDescription)} className="collection-details-textarea"></textarea>
                    <div className="hlaf-div">
                      <label className="colection-details-label no-transform">Mint Authority</label>
                      <Switch height={24} width={50} onColor="#2948ff" onChange={() => setMintAuthority(!mintAuthority)} checked={mintAuthority} />
                    </div>
                    <div className="hlaf-div">
                      <label className="colection-details-label no-transform">Freeze Authority</label>
                      <Switch height={24} width={50} onColor="#2948ff" onChange={() => setFreezeAuthority(!freezeAuthority)} checked={freezeAuthority} />
                    </div>
                    <div className="button-parent">
                      <button className="create-whitelist-btn" onClick={createWhitelistToken}>Create Whitelist Token</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
          {currentPage == 3 && 
          <div className="launch-collection-div">
            <h2 className="launch-collection-title">Create a Utility Token</h2>
            <div className="Create-whitelist-token-div">
              <div className="collection-details-parent">
                <div className="collection-details-full">
                  <div className="collection-details-basic-parent">
                    {/* <label>Collection Details</label> */}
                    <label className="colection-details-label">Token Name</label>
                    <input placeholder="Name" value={tokenNameUtil} onChange={() => setTokenNameUtil(tokenNameUtil)} className="collection-details-input" />
                    <label className="colection-details-label">Token Symbol</label>
                    <input placeholder="Symbol" value={tokenSymbolUtil} onChange={() => setTokenSymbolUtil(tokenSymbolUtil)} className="collection-details-input" />
                    <label className="colection-details-label">Description</label>
                    <textarea placeholder="Symbol" value={tokenDescriptionUtil} onChange={() => setTokenDescriptionUtil(tokenDescriptionUtil)} className="collection-details-textarea"></textarea>
                    <div className="hlaf-div">
                      <label className="colection-details-label no-transform">Mint Authority</label>
                      <Switch height={24} width={50} onColor="#2948ff" onChange={() => setMintAuthorityUtil(!mintAuthorityUtil)} checked={mintAuthorityUtil} />
                    </div>
                    <div className="hlaf-div">
                      <label className="colection-details-label no-transform">Freeze Authority</label>
                      <Switch height={24} width={50} onColor="#2948ff" onChange={() => setFreezeAuthorityUtil(!freezeAuthorityUtil)} checked={freezeAuthorityUtil} />
                    </div>
                    <div className="button-parent">
                      <button className="create-whitelist-btn" onClick={createUtilityToken}>Create Utility Token</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
        </div>) : (
        <div className="connect-wallet-div">
          <WalletDialogButton className="Connect-Wallet-btn">
            Connect Wallet
          </WalletDialogButton>
        </div>)
        }
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
