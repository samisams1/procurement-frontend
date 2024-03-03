import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledPageHeader = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const RowContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const Image = styled('img')({
  marginLeft: 'auto',
  width: '100px', // Adjust the width as needed
  height: 'auto',
});
const Icon = styled('div')({
  color: '#ffffff', // Set the icon color to white
});
export default function PageHeader(props: any) {
  const { title, subTitle, icon, imageSrc } = props;

  return (
    <StyledPageHeader elevation={0} square>
      <RowContainer>
      <Icon>{icon}</Icon>  
        <div>
          <Typography variant="h6" component="div" style={{ color: '#ffffff' }}>
            {title}
          </Typography>
          <Typography variant="subtitle2" component="div" style={{ color: '#ffffff' }}>
            {subTitle}
          </Typography>
        </div>
        {imageSrc && <Image   src={require(`../assets/${imageSrc}`)}   alt="Header Image" />}
      </RowContainer>
    </StyledPageHeader>
  );
}
       
   