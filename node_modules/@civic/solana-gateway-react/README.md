# Gateway React Component 

- [Getting started](#getting-started)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Overview

This purpose of this library is to provide an easy way to request a Gateway Token from a decentralised Application (dApp).

## Getting started

### 1. Install the component

```bash
npm i @civic/solana-gateway-react
```
or
```bash
yarn add @civic/solana-gateway-react
```

### 2. Include the gateway context

Surround any code that needs access to the gateway token with:

```typescript jsx
import { GatewayProvider } from "@civic/solana-gateway-react";

<GatewayProvider
  wallet={wallet}
  gatekeeperNetwork={gatekeeperNetwork}>
</GatewayProvider>
```

where:

- `wallet` contains `publicKey` and `signTransaction` (see below)
- `gatekeeperNetwork` is a Solana publicKey provided by the dApp, orderbook or market instance on-chain. It defines the ruleset that the dApp wants dApp users to adhere to. If you don't know the address of the ruleset network you'd like to use, please contact sales@civic.com.

### 3. Accessing or requesting the gateway token

The component will automatically look for a gateway token on chain. To access it once created:

```typescript
import { useGateway } from "@civic/solana-gateway-react";

const { gatewayToken } = useGateway()
```

If the wallet does not have a gateway token, request it using `requestGatewayToken`:

```typescript
const { requestGatewayToken } = useGateway()
```

For example, by connecting it to a button component:

```typescript jsx
<button onclick={requestGatewayToken}>Validate your wallet</button> 
```

Or by using Identity Button provided:

```typescript jsx
import IdentityButton from './lib/button/IdentityButton';
...
<IdentityButton />
```

Supporting light mode:

import IdentityButton from './lib/button/IdentityButton';
```
import {
  IdentityButton,
  ButtonMode,
} from '@civic/solana-gateway-react';

<IdentityButton mode={ButtonMode.LIGHT} />
```

Without animation:

import IdentityButton from './lib/button/IdentityButton';
```
import {
  IdentityButton,
  ButtonMode,
} from '@civic/solana-gateway-react';

<IdentityButton withAnimation={false} />
```

### 4. 'Verified by Civic' badge
A badge is provided that looks for a gateway token on-chain and displays a 'Verified by Civic' badge if one is found.
This does not query the Civic gatekeeper, only the blockchain.
Currently this is only supported for Solana and only for certain Civic gatekeeper networks, namely Genesis, Nile and Moselle

The wallet and gatekeeperNetwork are `PublicKey` types from `@solana/web3.js` . 

The `clusterName` defaults to `mainnet-beta` but can be any one of:
`mainnet-beta`, `testnet`, `devnet`, `civicnet`, `localnet` .
```
Import { Badge } from '@civic/solana-gateway-react';

 <Badge
        clusterName="mainnet-beta"
        gatekeeperNetwork={gatekeeperNetworkPublicKey}
        publicKey={publicKey}
      />
```
### IdentityButton behaviour

The IdentityButton is a reference implementation of a UI component to communicate to your dApp users the current status of their Gateway Token, or Gateway Token request. It changes appearance with text and icons to indicate when the user needs to take action and can be clicked by the user at any point in the process. The initial click for a new user will initiate the flow for the user to create a new Gateway Token. Once the user has gone through KYC and submitted their Gateway Token request via the Civic compliance iFrame, any subsequent click will launch the Civic Pass iframe with a screen describing the current status of the flow.

### Advanced Usage

The example below shows an example `GatewayStatus` component that will update, and show the token address, once present.

```typescript jsx
import React from 'react';
import logo from './logo.png';
import {GatewayProvider, useGateway, GatewayStatus} from "@civic/solana-gateway-react";

function GatewayStatus() {
  const { wallet } = useWallet(); // provided by your dApp
  const { status, requestGatewayToken, gatewayToken } = useGateway();

  return (
    <div>
      <h3>Request Status: { GatewayStatus[status] }</h3>
      { gatewayToken && <h4>GatewayToken: {gatewayToken.publicKey.toBase58()}</h4>}
      <button onClick={requestGatewayToken}>Request Gateway Token</button>
    </div>
  );
}

// use it in your app
function MyGatewayAwareUI() {
  const { wallet } = useWallet(); // provided by your dApp
  const gatekeeperNetwork = new PublicKey('ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6'); // the network address for IgnitePass
  return (
    <GatewayProvider wallet={wallet} gatekeeperNetwork={gatekeeperNetwork}>
      <GatewayStatus/>
    </GatewayProvider>
  )
}
```

## API Documentation

### GatewayProvider

The `GatewayProvider` is a React component that gives children access to the GatewayContext through the `useGateway` function.

This component holds the state for a given gateway token or gateway token request.

```typescript
export type GatewayProviderProps = {
  wallet: WalletAdapter | undefined; // the wallet connected to the dApp, can be null initially pre-user wallet connection
  gatekeeperNetwork: string | undefined; // the gatekeeper network public key address
  stage?: string; // optionally set Civic gatekeeper stage (testing only), defaults to 'prod'
  clusterUrl?: string; // optionally pass a Solana cluster URL, defaults to solana mainnet
  wrapper?: React.FC; // a react element that the dApp can wrap the iframe in to allow customer dApp styling
  logo?: string; // optional url of your logo that will be shown, if set, during verification
  redirectUrl?: string; // a redirect URL that can be used for deep-linking and mobile-web
};
```
### GatewayStatus

### GatewayStatus

The `GatewayStatus` is an enum that reveals the state of the requested Gateway Token.

```typescript
export enum GatewayStatus {
  UNKNOWN,
  CHECKING,
  NOT_REQUESTED,
  COLLECTING_USER_INFORMATION,
  IN_REVIEW,
  ACTIVE,
  FROZEN,          
  REJECTED,  
  REVOKED,
  LOCATION_NOT_SUPPORTED,
  CONFIRM_WALLET_TRANSACTION
}
```

The behaviour of the React component depends on the status of the token. For example, if the token status is `NOT_REQUESTED` and the user triggers the react component, then the flow to collect the user's information and request a Civic Token will be started.
For other cases, like the token status `FROZEN`, triggering the React component opens a dialog explaining to the user the current status and offering him to reach out to Civic is he requires assistance. 

The table bellow lists all status:

| Status        | Description | Behaviour when triggered
| ------------- | ------------------------------------------------------------ | -------------------------------------------------------
| `UNKNOWN`       | No user wallet is connected or no gatekeeper network set     | *None* |
| `CHECKING`      | The Identity Component is making the relevant requests to check the state of the token      | *None* |
| `NOT_REQUESTED` | A token has not been requested  | Opens the Civic Pass modal dialog and initiates the token request flow |
| `COLLECTING_USER_INFORMATION` | The Identity Component is in progress and can be resumed | Opens the Civic Pass modal dialog and resumes the token request flow|
| `IN_REVIEW` | The token has been requested and the Gatekeeper is reviewing the request | Opens the Civic Pass modal dialog with a user-friendly explanation of the status. |
| `ACTIVE` | The token has been issued successfully and is active. | Opens the Civic Pass modal dialog with a user-friendly explanation of the status. |
| `FROZEN` | The token has been frozen, for example because the user connected from a blocked IP | Opens the Civic Pass modal dialog with a user-friendly explanation of the status. |
| `REJECTED` | The token requests has been rejected by the Gatekeeper | Opens the Civic Pass modal dialog with a user-friendly explanation of the status. |
| `REVOKED` | The token has been revoked, for example because the user connected from a banned IP | Opens the Civic Pass modal dialog with a user-friendly explanation of the status. |
| `LOCATION_NOT_SUPPORTED` | The user's location is not currently supported | Opens the Civic Pass modal dialog with a user-friendly explanation of the status. |
| `REFRESH_TOKEN_REQUIRED` | The user needs to refresh their gateway token | Opens the Civic Pass modal dialog and takes the user through the flow for refreshing their token. |
| `ERROR` | There was an error retrieving the Gateway Token or completing a vrification flow | Opens the Civic Pass modal dialog and the user can restart the process. |
| `VALIDATING_USER_INFORMATION` | The validation process is currently being reviewed | Opens the Civic Pass modal dialog and shows a user friendly message |
| `VALIDATION_PROCESS_IN_PROGRESS` | The validation process is still in progress | Opens the Civic Pass modal dialog and the user can resume the process |
| `USER_INFORMATION_VALIDATED` | The validation process has completed | Opens the Civic Pass modal dialog and completes the process |
| `USER_INFORMATION_REJECTED` | The validation process was rejected | Opens the Civic Pass modal explaing the reasons for the failure |

### WalletAdapter

The wallet passed to the GatewayProvider must implement the WalletAdapter interface
by providing a publicKey (this will be linked with the GatewayToken),
and a 'sign' function to prove wallet ownership:
```typescript
export interface WalletAdapter {
  publicKey?: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}
```

### useGateway

Any component wrapped by `GatewayProvider` can access the state and useful functions of the GatewayProvider through this function.

Returns the current context values for the `GatewayContext` by exposing the following properties.
```typescript
export type GatewayProps = {
  requestGatewayToken: () => Promise<void>, // starts off gateway token process
  gatewayStatus: GatewayStatus, // normally a value from a React hook state, defaults to GatewayStatus.UNKNOWN
  gatewayToken?: GatewayToken, // the current GatewayToken used in the dApp
  stage?: string, // optionally set Civic gatekeeper stage (testing only), defaults to 'prod'
  clusterUrl?: string, // optionally pass a Solana cluster URL, defaults to solana mainnet
  civicPassSrcUrl?: string // the civicPass URL in use - set internally via stage
  options?: Options // client UI options such as auto-showing the iframe modal
}

const gatewayProps: GatewayProps = useGateway();
```

### Client options

You can specify some options that affect the display behaviour of the Civic modal that the user interacts with:
```
export type Options = {
  autoShowModal: boolean; // whether the Civic modal should appear automatically if the Civic Pass token state changes
};
```

### Wrapper

You can customize how the verification flow is displayed by providing a custom wrapper. 

```typescript
...
const customWrapperStyle: CSS.Properties = {
  backgroundColor: 'rgba(0,0,0,1)',
  position: 'fixed',
  zIndex: 999,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  paddingTop: '5%'
}

const customWrapperContentStyle: CSS.Properties = {
  backgroundColor: '#fefefe',
  margin: 'auto',
  width: '90%', 
  position: 'relative',
}

export const CustomWrapper: React.FC = ({ children = null }) => {
  return (
    <div style={customWrapperStyle}>
      <div style={customWrapperContentStyle}>
        <img style={{ maxWidth: '20%' }} src={logo} className="app-logo" alt="logo"/>
        {children}
      </div>
    </div>
  )
}

```

## A note on token refresh
A token refresh is attempted at regular intervals to verify the user's location.
Refresh will only happen if:
1. the token is ACTIVE, and
2. a pre-refresh Gatekeeper GET call returns 200 (`GatekeeperRecordState.ISSUED`) (i.e. the token is active and not expired / approaching expiry)


Error handling works as follows:
- If a refresh fails with a 5xx from the Civic gatekeeper, it will be retried according to the `REFRESH_RETRY_*` values in config.
In this case an active token will remain exposed from useGatewa, even after the retries are exhausted.

- For any other refresh error (e.g. network error, 4xx status code), the GatewayStatus will transition to `REFRESH_FAILED` and the token will no longer be exposed from useGateway.
This only applies to tokens whose on-chain status is ACTIVE.
If the token is FROZEN or REVOKED on-chain, those statuses take precedence.

In both cases, another refresh will be attempted after the regular `REFRESH_INTERVAL` in config.
## Contributing

Building the project and running the sample app: 

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn publish`
Publishing a version of the React Component is currently a manual process. Checkout the project, update the `package.json` file with the correct build number and then run `yarn publish` and follow the prompts.
