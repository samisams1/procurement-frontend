import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import Controls from './Controls';
import { Close } from '@mui/icons-material';
//import CloseIcon from '@material-ui/icons/Close';
//import Controls from './Controls';



export default function Popup(props:any) {

    const { title, children, openPopup, setOpenPopup } = props;

    return (
        <Dialog open={openPopup} maxWidth="md" >
            <DialogTitle >
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Controls.ActionButton
                        color="secondary"
                        onClick={()=>{setOpenPopup(false)}}>
                        <Close />
                    </Controls.ActionButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}
