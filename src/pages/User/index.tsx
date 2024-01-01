import React, { useContext, useState } from 'react';

import Popup from "../../components/Popup";
import {Paper,Toolbar } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import Controls from '../../components/Controls';
import Spinner from '../../components/Spinner';
import { UserContext } from '../../auth/UserContext';
import { Add, PeopleOutlineTwoTone } from '@mui/icons-material';
import { UserList } from '../../components/pageComponents/user/UserTable';
import { UserForm } from '../../components/pageComponents/user/UserForm';

export const User = () => {
    const [openPopup, setOpenPopup] = useState(false)
    const { currentUser } = useContext(UserContext);
     if (!currentUser) {
    return <div><Spinner/></div>;
  }
  
    return (
        <>
            <PageHeader
                title="New Admin"
                subTitle="Admin"
                icon={<PeopleOutlineTwoTone fontSize="large" />}
            />
            <Paper >
               <Toolbar>

                    <div>
                    <Controls.Button
                        text="Add New"
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => { setOpenPopup(true)}}
                    />
                    </div>
                </Toolbar> 
                <UserList title={"Admin"} roleId = {1}/>
            </Paper>
            <Popup
                title="User Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
               <UserForm/>
            </Popup>
        </>
    )

}