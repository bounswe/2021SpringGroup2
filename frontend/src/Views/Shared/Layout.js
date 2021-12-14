import React from 'react';
import {Outlet} from 'react-router-dom'
import Header from './Header'
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { SnackbarProvider} from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';



const Layout = () => {
    const theme = createTheme();

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <div>
                            <Header loggedIn={false}/>
                            <Outlet />
                        </div>
                    </LocalizationProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default Layout
