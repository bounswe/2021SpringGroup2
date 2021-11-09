import React, {useState} from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles, createStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Joi from 'joi'


const useStyles = makeStyles(theme => createStyles({
    /*"@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },*/
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
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', "edu"] } })
})
    .with('password', 'repeat_password');


const initialState = {
    username: {
        value: "",
        changed: false,
        error: undefined
    },

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
    const classes = useStyles();

    const [state, setState] = useState(initialState)

    const getValue = state => ({
        username: state.username.value,

        firstName: state.firstName.value,

        lastName: state.lastName.value,

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
    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
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
                                label="Password"
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
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Typography variant="body2" color="textSecondary" align="center">
                    Built by reBOUNd team.
                </Typography>
            </Box>

        </Container>
    );
}
