import React from 'react';
import {Outlet} from 'react-router-dom'
import Header from './Header'
import {createTheme, ThemeProvider} from "@mui/material/styles";



const Layout = () => {
    const theme = createTheme();

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>

                <div>
                    <Header loggedIn={true}/>
                    <Outlet />
                </div>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default Layout
