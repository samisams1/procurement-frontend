import React from 'react';
import { styled } from '@mui/system';
import { Typography, Button } from '@mui/material';

const TellUsWhatYouWantContainer = styled('div')({
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '16px',
  color: '#333333',
});

const Description = styled(Typography)({
  marginBottom: '24px',
  textAlign: 'center',
  color: '#666666',
});

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const StyledButton = styled(Button)({
  backgroundColor: '#ff4f00',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#ff6f1a',
  },
});

const TellUsWhatYouWant = () => {
  return (
    <TellUsWhatYouWantContainer>
      <Title variant="h5">Tell Us What You Want</Title>
      <Description variant="body1">
        Let us know the items or services you need, and we'll take care of the rest.
      </Description>
      <ButtonContainer>
        <StyledButton variant="contained">Request Now</StyledButton>
      </ButtonContainer>
    </TellUsWhatYouWantContainer>
  );
};

export default TellUsWhatYouWant;