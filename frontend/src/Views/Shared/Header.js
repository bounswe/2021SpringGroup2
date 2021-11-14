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
    pointerEvents: 'none',
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
