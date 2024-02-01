import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, styled, useMediaQuery, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: 100%;
    max-width: 600px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    animation: popFromRight 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  @keyframes popFromRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    .MuiDialog-paper {
      width: 100%;
      max-width: none;
      border-radius: 0;
      height: 100%;
      margin: 0;
      animation: none;
      padding:0;
    }
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledTitle = styled(Typography)`
  flex-grow: 1;
  font-weight: bold !important;
  color: #00b0ad !important;
`;

const StyledCloseButton = styled(IconButton)`
  margin-left: auto;
  color: red; /* Changed color to red */
  transition: color 0.3s;

  &:hover {
    color: red; /* Changed hover color to red */
  }
`;

export default function Popup(props: any) {
  const { title, children, openPopup, setOpenPopup, image } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <StyledDialog open={openPopup} maxWidth={isMobile ? 'xl' : 'md'}>
      <StyledDialogTitle>
        {image && (
          <img src={require(`../assets/${image}`).default} alt="Popup" style={{ marginRight: '10px', height: '30px' }} />
        )}
        <StyledTitle variant="h6">
          {title}
        </StyledTitle>
        <StyledCloseButton aria-label="close" onClick={handleClose}>
          <Close />
        </StyledCloseButton>
      </StyledDialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </StyledDialog>
  );
}