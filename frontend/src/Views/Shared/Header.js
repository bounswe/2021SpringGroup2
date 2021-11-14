import React from 'react';
import {Outlet, Link, useLocation} from 'react-router-dom'
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import ButtonGroup from "@mui/material/ButtonGroup"
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import image from "../../logos/reb und(400 x 100 px).png";
import makeStyles from "@mui/styles/makeStyles"
import {createStyles} from "@mui/styles";
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';



const useStyles = makeStyles(theme => createStyles({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    logo: {
        marginTop: theme.spacing(-2),
        maxWidth: 160,
        maxHeight: 20
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "0%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

const Header = props => {
    const classes = useStyles()
    return (
        <React.Fragment>
            <nav>
                {
                    props.loggedIn?
                        <AppBar color="inherit" position="sticky" style={{backgroundColor: "#c1eff4"}}>
                            <Toolbar>
                                <img src={image} alt={"logo"} />
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                </Typography>

                                <Button
                                    component={Link} to="/home"
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<HomeOutlinedIcon />} >
                                    Home
                                </Button>
                                <Button
                                    component={Link} to="/profile"
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<AccountCircleOutlinedIcon />} >
                                    Profile
                                </Button>
                            </Toolbar>
                        </AppBar>:
                            <Toolbar color="inherit" position="sticky" style={{backgroundColor: "#c1eff4"}}>
                                <img src={image} alt={"logo"} />
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                </Typography>
                                <Button
                                    component={Link} to="/home"
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<HomeOutlinedIcon />} >
                                    Home
                                </Button>
                                <Button
                                    component={Link} to="/signup"
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<ExitToAppOutlinedIcon />} >
                                    Sign Up
                                </Button>
                            </Toolbar>
                }



            </nav>
            <hr />
        </React.Fragment>
    )
}

export default Header
