import { FC } from 'react';
import { Dapp } from '../model';
import { DappCard } from './DappCard';
import { Box, Grid, Typography } from '@mui/material';
import styled from 'styled-components';

const FAVOURITES: Dapp[] = [
  {
    name: 'NNS',
    canisterId: 'qoctq-giaaa-aaaaa-aaaea-cai',
    url: 'https://nns.ic0.app',
  },
  {
    name: 'Distrikt',
    canisterId: 'az5sd-cqaaa-aaaae-aaarq-cai',
  },
  {
    name: 'Taggr',
    canisterId: '6qfxa-ryaaa-aaaai-qbhsq-cai',
  },
  {
    name: 'Open Chat',
    canisterId: '6hsbt-vqaaa-aaaaf-aaafq-cai',
    url: 'https://oc.app',
  },
];

const GridWrapper = styled(Box)`
  padding: 0 ${props => props.theme.spacing(4)};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Dashboard: FC = () => {
  return (
    <>
      <Typography variant="h2" component="h1" align="center" mt={7} mb={9}>
        Pylon
      </Typography>

      <GridWrapper>
        <Grid
          container
          maxWidth="md"
          rowSpacing={2}
          columnSpacing={2}
          alignSelf={'center'}
        >
          {FAVOURITES.map(dapp => (
            <Grid key={dapp.canisterId} xs={4} sm={3} md={2} item>
              <DappCard dapp={dapp} />
            </Grid>
          ))}
        </Grid>
      </GridWrapper>
    </>
  );
};
