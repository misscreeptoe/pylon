import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Dapp } from '../model';
import styled from 'styled-components';

export interface DappCardProps {
  dapp: Dapp;
}

const IC_DOMAIN = 'ic0.app';

const getMetadataUrl = (canisterId: string, property: string): string => {
  return `ic-metadata:${canisterId}/${property}`;
};

const StyledCard = styled(Card)`
  height: 100%;
`;

const StyledLink = styled.a`
  height: 100%;
`;

const StyledCardContent = styled(CardContent)`
  height: 80px;
`;

const Title = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DappCard: FC<DappCardProps> = ({ dapp }) => {
  const iconUrl = getMetadataUrl(dapp.canisterId, 'icon');
  const url = dapp.url ?? `https://${dapp.canisterId}.${IC_DOMAIN}`;
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    const fetchTitle = () =>
      fetch(getMetadataUrl(dapp.canisterId, 'title')).then(res => res.text());

    fetchTitle().then(res => {
      setTitle(res);
    });
  }, []);

  return (
    <StyledCard>
      <CardActionArea LinkComponent={StyledLink} href={url} title={title}>
        <CardMedia component="img" image={iconUrl} />
        <StyledCardContent>
          <Title>{title}</Title>
        </StyledCardContent>
      </CardActionArea>
    </StyledCard>
  );
};
