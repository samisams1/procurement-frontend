import React from 'react'
import { Paper, Typography } from '@mui/material';

export default function PageHeader(props:any) {
    const { title, subTitle, icon } = props;
    return (
        <Paper elevation={0} square >
          
                <div style={{color:"#1c9fef"}}>
                    {icon}
                <div>
                    <Typography
                        variant="h6"
                        component="div">
                        {title}</Typography>
                    <Typography
                        color="#4385b5"
                        variant="subtitle2"
                        component="div">
                        {subTitle}</Typography>
                </div>
            </div>
        </Paper>
    )
}
