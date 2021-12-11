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
        .alphanum()
        .optional()
        .allow('')
        .max(150),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2 , tlds: { allow: ['com', 'net', "edu"] }})
})
    .with('password', 'repeat_password');


const initialState = {

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
    fav_sport_1: {
        value: "",
        changed: false,
        error: undefined
    },
    fav_sport_2: {
        value: "",
        changed: false,
        error: undefined
    },
    fav_sport_3: {
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

        first_name: state.firstame.value,

        last_name: state.last_name.value,

        bio: state.bio.value,
        age: state.age.value,
        location: state.location.value,
        fav_sport_1: state.fav_sport_1.value,
        fav_sport_2: state.fav_sport_2.value,
        fav_sport_3: state.fav_sport_3.value,
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
                                id="fav_sport_1"
                                label="Your Favourite Sports"
                                name="fav_sport_1"
                                autoComplete="fav_sport_1"
                                value={state.fav_sport_1.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.fav_sport_1.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.fav_sport_1.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="fav_sport_2"
                                label="Your Favourite Sports"
                                name="fav_sport_2"
                                autoComplete="fav_sport_2"
                                value={state.fav_sport_2.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.fav_sport_2.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.fav_sport_2.error}
                                    </Alert>:null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="fav_sport_3"
                                label="Your Favourite Sports"
                                name="fav_sport_3"
                                autoComplete="fav_sport_3"
                                value={state.fav_sport_3.value||""}
                                onChange={handleChange}
                            />
                            {
                                state.fav_sport_3.error?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.fav_sport_3.error}
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
