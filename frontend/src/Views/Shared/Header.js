import React from 'react';
import {Outlet, Link, useLocation} from 'react-router-dom'
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import image from "../../logos/reb und(400 x 100 px).png";
import makeStyles from "@mui/styles/makeStyles"
import {createStyles} from "@mui/styles";
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from "@mui/material/Badge"
import {IconButton} from "@mui/material";



const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


const Header = props => {
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
                                <Toolbar>
                                    <Search>
                                        <SearchIconWrapper>
                                            <SearchIcon />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                            placeholder="Search"
                                            inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </Search>
                                </Toolbar>
                                <IconButton
                                    size="large"
                                    aria-label="show 17 new notifications"
                                    color="inherit"
                                >
                                    <Badge badgeContent={12} color="error" component={Link} to="/notifications">

                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
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
                                <Toolbar>
                                    <Search>
                                        <SearchIconWrapper>
                                            <SearchIcon />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                            placeholder="Search"
                                            inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </Search>
                                </Toolbar>
                                <Button
                                    component={Link} to="/createevent"
                                    color="primary"
                                    variant="outlined"
                                    style={{marginRight:10}}>
                                    Create a new event
                                </Button>
                                <Button
                                    component={Link} to="/home"
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<HomeOutlinedIcon />}
                                    style={{marginRight:10}}>
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
        </React.Fragment>
    )
}

export default Header
