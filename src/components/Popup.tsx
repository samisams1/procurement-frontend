import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function Popup(props: any) {
  const { title, children, openPopup, setOpenPopup, image } = props;
  return (
    <Dialog open={openPopup} maxWidth="md">
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {image && <img src={require(`../assets/${image}`).default} alt="Popup" style={{ marginRight: '10px', height: '30px' }} />}
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Close onClick={() => setOpenPopup(false)} />
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}