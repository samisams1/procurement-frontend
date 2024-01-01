import React from 'react'
import { Button } from '@mui/material';

export default function ActionButton(props:any) {

    const {children, onClick } = props;

    return (
        <Button
       // className={}
        onClick={onClick}>
        {children}
    </Button>
    )
}
