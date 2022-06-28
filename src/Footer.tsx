import * as anchor from '@project-serum/anchor';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { MintCountdown } from './MintCountdown';
import { toDate, formatNumber } from './utils';
import { MagicHatAccount } from './candy-machine';

type HeaderProps = {
  magicHat?: MagicHatAccount;
};

export const Footer = ({ magicHat }: HeaderProps) => {
  return (
    <Grid container direction="row" justifyContent="center" wrap="nowrap">
      <Grid container direction="row" wrap="nowrap">
        {magicHat && (
          <Grid container direction="row" wrap="nowrap">
            <Grid container direction="column">
              {/* <Typography variant="body2" color="textSecondary">
                Remaining
              </Typography> */}
              <Typography
                variant="h6"
                color="textPrimary"
                style={{
                  fontWeight: 'bold',
                }}
                className='m-t-10'
              >
                {`${magicHat?.state.itemsRemaining}`} / 1200
              </Typography>
            </Grid>
            {/* <Grid container direction="column">
              <Typography
                variant="h6"
                color="textPrimary"
                style={{ fontWeight: 'bold' }}
              >
                {getMintPrice(magicHat)} SOl
              </Typography>
            </Grid> */}
          </Grid>
        )}
        {/* <MintCountdown
          date={toDate(
            magicHat?.state.goLiveDate
              ? magicHat?.state.goLiveDate
              : magicHat?.state.isPresale
              ? new anchor.BN(new Date().getTime() / 1000)
              : undefined,
          )}
          style={{ justifyContent: 'flex-end' }}
          status={
            !magicHat?.state?.isActive || magicHat?.state?.isSoldOut
              ? 'COMPLETED'
              : magicHat?.state.isPresale
              ? 'PRESALE'
              : 'LIVE'
          }
        /> */}
      </Grid>
      
    </Grid>
  );
};

const getMintPrice = (magicHat: MagicHatAccount): string => {
  const price = formatNumber.asNumber(
    magicHat.state.isPresale && magicHat.state.whitelistMintSettings?.discountPrice
      ? magicHat.state.whitelistMintSettings?.discountPrice!
      : magicHat.state.price!,
  );
  return `◎ ${price}`;
};
