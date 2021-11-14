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

    firstName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    lastName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2 , tlds: { allow: ['com', 'net', "edu"] }})
})
    .with('password', 'repeat_password');


const initialState = {

    firstName: {
        value: "",
        changed: false,
        error: undefined
    },

    lastName: {
        value: "",
        changed: false,
        error: undefined
    },


    bio: {
        value: "",
        changed: false,
        error: undefined
    },
    age: {
        value: "",
        changed: false,
        error: undefined
    },
    location: {
        value: "",
        changed: false,
        error: undefined
    },
    favSports: {
        value: "",
        changed: false,
        error: undefined
    },
}

export default function SignUp() {
    const classes = useStyles()
    const navigate = useNavigate()
    const [state, setState] = useState(initialState)

    const getValue = state => ({

        firstName: state.firstName.value,

        lastName: state.lastName.value,

        bio: state.bio.value,
        age: state.age.value,
        location: state.location.value,
        favSports: state.favSports.value,
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
    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Edit Profile
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={state.firstName.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.firstName.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.firstName.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                value={state.lastName.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.lastName.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.lastName.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="bio"
                                label="Your Biography"
                                name="bio"
                                autoComplete="bio"
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
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="age"
                                label="Your Age"
                                name="age"
                                autoComplete="age"
                                value={state.age.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.age.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.age.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="location"
                                label="Your Location"
                                name="location"
                                autoComplete="location"
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
                                id="favSports"
                                label="Your Favourite Sports"
                                name="favSports"
                                autoComplete="favSports"
                                value={state.favSports.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.favSports.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.favSports.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={3}>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
