import React, { useContext, useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Button } from '@mui/material';
import Popup from '../../../components/Popup';
import Login from '../../login/Login';
import { UserContext } from '../../../auth/UserContext';
import { useNavigate } from 'react-router-dom';

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
  backgroundColor: '#00b0ad', // Main color for the button (you can adjust the color code)
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#00b0ad', // Hover color for the button (you can adjust the color code)
  },
  borderRadius: '999px', // Makes the button more rounded
  padding: '12px 24px', // Increase padding for a more prominent button
  fontWeight: 'bold', // Makes the button text bold
  textTransform: 'none', // Removes uppercase transformation of the button text
});

const TellUsWhatYouWant = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const handleClick = () => {
    if(currentUser){
      navigate('/newRequest');
    }else{
      setOpenPopup(true);
    }
   
  };

  return (
    <TellUsWhatYouWantContainer>
      <Title variant="h5">Tell Us What You Want</Title>
      <Description variant="body1">
        Let us know the items or services you need, and we'll take care of the rest.
      </Description>
      <ButtonContainer>
        <StyledButton variant="contained"
         onClick={handleClick}>
          Request Now 
        </StyledButton>
      </ButtonContainer>
      <Popup title="Login" openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <Login />
      </Popup>
    </TellUsWhatYouWantContainer>
  );
};

export default TellUsWhatYouWant;