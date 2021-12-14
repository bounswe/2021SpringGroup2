import React, {useState} from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles, createStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Joi from 'joi'
import {useNavigate} from 'react-router-dom'
import image from '../../logos/reb und(400 x 100 px).png'
import SignUpFunction from "../../Controllers/SignUpController";
import {useSnackbar} from "notistack";


const useStyles = makeStyles(theme => createStyles({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
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
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    first_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    last_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    bio: Joi.string()
        .optional()
        .min(0)
        .max(300),
    location: Joi.string()
        .optional()
        .min(0)
        .max(30),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2 , tlds: { allow: ['com', 'net', "edu"] }})
})
    .with('password', 'repeat_password');


const initialState = {
    username: {
        value: "",
        changed: false,
        error: undefined
    },

    first_name: {
        value: "",
        changed: false,
        error: undefined
    },

    last_name: {
        value: "",
        changed: false,
        error: undefined
    },
    bio: {
        value: "",
        changed: false,
        error: undefined
    },
    location: {
        value: "",
        changed: false,
        error: undefined
    },

    password: {
        value: "",
        changed: false,
        error: undefined
    },

    repeat_password: {
        value: "",
        changed: false,
        error: undefined
    },

    email: {
        value: "",
        changed: false,
        error: undefined
    },
}

export default function SignUp() {
    const classes = useStyles()
    const navigate = useNavigate()
    const [state, setState] = useState(initialState)
    const { enqueueSnackbar } = useSnackbar();


    const getValue = state => ({
        username: state.username.value,

        first_name: state.first_name.value,

        last_name: state.last_name.value,
        bio: state.bio.value,
        location: state.location.value,

        password: state.password.value,

        repeat_password: state.repeat_password.value,

        email: state.email.value,

    })
    const handleChange = e=>{
        const newState = {...state}
        const value = getValue(newState)
        value[e.target.id] = e.target.value
        const result = schema.validate(value, {abortEarly: false})
        let error = undefined
        if(result.error){
            const err = result.error.details.find(d=>d.path[0]===e.target.id)
            if(err)
                error = err.message
        }
        newState[e.target.id] = {
            value: e.target.value,
            changed: true,
            error
        }
        setState(newState)
    }
    const submit = _=>{
        const value = getValue(state)
        const result = schema.validate(value, {abortEarly: false})
        if(result.error)return
        SignUpFunction(value).then(_=>{
                navigate("/profile/"+value.username)
                enqueueSnackbar("Your account is successfully created.", {variant: "success"})
            })
            .catch(e=>{
                enqueueSnackbar("An error occured in the server.", {variant: "error"})
                console.log(e)
            })
    }

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <div className={classes.paper}>
                <img src={image} alt={"logo"}/>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="User Name"
                                name="username"
                                autoComplete="username"
                                value={state.username.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.username.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.username.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="first_name"
                                variant="outlined"
                                required
                                fullWidth
                                id="first_name"
                                label="First Name"
                                autoFocus
                                value={state.first_name.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.first_name.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.first_name.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="last_name"
                                label="Last Name"
                                name="last_name"
                                autoComplete="lname"
                                value={state.last_name.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.last_name.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.last_name.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="bio"
                                label="Biography"
                                name="bio"
                                autoComplete="lname"
                                value={state.bio.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.bio.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.bio.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="location"
                                label="Location"
                                name="location"
                                autoComplete="lname"
                                value={state.location.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.location.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.location.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={state.email.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.email.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.email.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={state.password.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.password.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.password.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="repeat_password"
                                label="Repeat Password"
                                type="password"
                                id="repeat_password"
                                autoComplete="current-repeatpassword"
                                value={state.repeat_password.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.repeat_password.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.repeat_password.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={3}>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={submit}>
                                Sign Up
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                        </Grid>
                        <Grid item xs={3}>
                        </Grid>
                        <Grid item xs={6} textAlign={"center"}>
                            <Typography style={{ cursor: "pointer" }} variant="body2" color="textSecondary" align="center" onClick={_=>navigate("/login")}>
                                Already have an account? Sign in
                            </Typography>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
