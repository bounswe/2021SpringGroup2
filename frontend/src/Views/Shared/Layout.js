import React from 'react';
import {Outlet, Link, useLocation} from 'react-router-dom'
import Header from './Header'
import {createTheme, ThemeProvider} from "@mui/material/styles";


const theme = createTheme();

const Layout = () => {

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>

                <div>
                    <Header/>
                    <Outlet />
                </div>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default Layout
