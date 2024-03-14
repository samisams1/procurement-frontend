import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledPageHeader = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const RowContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    maxWidth: '300px', // Adjust the max width as needed
    margin: '0 auto', // Center the container horizontally
  },
}));

const Image = styled('img')({
  marginTop: '12px',
  width: '100px',
  height: '60px',
});
const Icon = styled('div')({
  color: '#ffffff',
});
const MainHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  width: '60%',
  marginTop: '12px',
});

export default function PageHeader(props: any) {
  const { title, subTitle, icon, imageSrc } = props;

  return (
    <StyledPageHeader elevation={0} square>
      <RowContainer>
        <div>
          <Icon>{icon}</Icon>
          <div>
            <Typography variant="h6" component="div" style={{ color: '#ffffff' }}>
              {title}
            </Typography>
            <Typography variant="subtitle2" component="div" style={{ color: '#ffffff' }}>
              {subTitle}
            </Typography>
          </div>
        </div>
        <MainHeader>
          <Typography variant="h5" component="div" style={{ color: '#ffffff' }}>
            My Company
          </Typography>
        </MainHeader>
        {imageSrc && <Image src={require(`../assets/${imageSrc}`)} alt="Header Image" />}
      </RowContainer>
    </StyledPageHeader>
  );
}