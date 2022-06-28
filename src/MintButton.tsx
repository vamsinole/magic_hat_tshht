import './App.css';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { MagicHatAccount } from './candy-machine';
import { CircularProgress } from '@material-ui/core';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import { useEffect, useState } from 'react';

export const CTAButton = styled(Button)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  color: black;
  font-size: 14px;
  font-weight:600;
`; // add your own styles here

export const MintButton = ({
  onMint,
  magicHat,
  isMinting,
}: {
  onMint: () => Promise<void>;
  magicHat?: MagicHatAccount;
  isMinting: boolean;
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      onMint();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);

  const getMintButtonContent = () => {
    if (magicHat?.state.isSoldOut) {
      return 'SOLD OUT';
    } else if (isMinting) {
      return <CircularProgress />;
    } else if (magicHat?.state.isPresale) {
      return 'BUY TICKET NOW';
    } else if (clicked && magicHat?.state.gatekeeper) {
      return <CircularProgress />;
    }

    return 'BUY TICKET NOW';
  };

  return (
    <CTAButton className='Button-test'
      disabled={
        clicked ||
        magicHat?.state.isSoldOut ||
        isMinting ||
        !magicHat?.state.isActive
      }
      onClick={async () => {
        setClicked(true);
        if (magicHat?.state.isActive && magicHat?.state.gatekeeper) {
          if (gatewayStatus === GatewayStatus.ACTIVE) {
            setClicked(true);
          } else {
            await requestGatewayToken();
          }
        } else {
          await onMint();
          setClicked(false);
        }
      }}
      variant="contained"
    >
      {getMintButtonContent()}
    </CTAButton>
  );
};
