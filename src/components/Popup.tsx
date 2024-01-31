import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, styled } from '@mui/material';
import { Close } from '@mui/icons-material';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: 80%;
    max-width: 600px;
    padding: 20px;
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
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledTitle = styled(Typography)`
  flex-grow: 1;
  font-weight: bold !important;
  color: #1976d2 !important;
`;

const StyledCloseButton = styled(IconButton)`
  margin-left: auto;
  color: #888;
  transition: color 0.3s;

  &:hover {
    color: #888;
  }
`;

export default function Popup(props: any) {
  const { title, children, openPopup, setOpenPopup, image } = props;

  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <StyledDialog open={openPopup} maxWidth="md">
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