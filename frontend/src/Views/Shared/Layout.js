import React, {useState} from 'react';
import {Outlet} from 'react-router-dom'
import Header from './Header'
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { SnackbarProvider} from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {getUserInfoLoggedIn} from '../../Controllers/AuthInfo'
import {obtainToken} from "../../Controllers/LoginController";


const initialState = {
    username: {
        value: "",
        changed: false,
        error: undefined
    },
    user_id:{
        value: "",
        changed: false,
        error: undefined
    }
}

const Layout = () => {
    const theme = createTheme();

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <div>
                            <Header loggedIn={getUserInfoLoggedIn()}/>
                            <Outlet />
                        </div>
                    </LocalizationProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default Layout
