import React from 'react';
import {Outlet} from 'react-router-dom'
import Header from './Header'
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { SnackbarProvider} from 'notistack';



const Layout = () => {
    const theme = createTheme();

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <div>
                        <Header loggedIn={false}/>
                        <Outlet />
                    </div>
                </SnackbarProvider>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default Layout
