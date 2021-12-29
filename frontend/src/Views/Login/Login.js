import * as React from "react";
import Button from "@mui/material/Button";
import {Grid, Paper, TextField, Typography, Box} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom'
import {obtainToken} from "../../Controllers/LoginController";
import {useState} from "react";
import {Alert} from "@mui/lab";
import {setHeaders, getToken, getUserInfo} from "../../Controllers/AuthInfo";

const initialState = {
    username: {
        value: "",
        changed: false,
        error: undefined
    },
    password:{
        value: "",
        changed: false,
        error: undefined
    }
}
export default function LoginPage(props){
    const paperStyle = {padding:20, height: '48vh', width:280, margin:"20px auto", background: "#EFF1F3"};
    const textFieldStyle = {backgroundColor: 'white'}
    const inputStyle = {height:"10mm",fontSize:"5px"}
    const typographyStyle = {fontSize:14, marginBottom:2,marginTop:2, marginLeft: 1}
    const [state, setState] = useState(initialState)
    const navigate = useNavigate()

    const getValue = state => ({
        username: state.username.value,
        password: state.password.value
    })
    const handleChange = e=>{
        const newState = {...state}
        const value = getValue(newState)
        value[e.target.id] = e.target.value
        newState[e.target.id] = {
            value: e.target.value,
            changed: true
        }
        setState(newState)
    }
    function handleLogin() {
         obtainToken(state.username.value,state.password.value)
             .then(function(r){
                 if(r.detail!==undefined){
                     const newState = {...state}
                     newState.username.error = "Check your credentials"
                     setState(newState)
                 }
                 else{
                     setHeaders(r.access, r.refresh)
                     getUserInfo(state.username.value).then(r => console.log(r))
                     navigate("/")
                 }
             })

    }
    return (<Grid>
                <Paper elevation={3} style={paperStyle}>
                <Typography style = {typographyStyle}>
                    Username
                </Typography>
                <TextField fullWidth required id="username"  size="small" style={textFieldStyle}
                InputProps={inputStyle} value={state.username.value||""} onChange={handleChange}></TextField>
                <Typography style = {typographyStyle}>
                    Password
                </Typography>
                <TextField fullWidth type="password" id="password"
                           value={state.password.value||""} onChange={handleChange} required size="small" style={textFieldStyle}></TextField>
                    <Box textAlign='center' style={{marginTop: 5,marginBottom:3}}>

                    <Button variant="contained" align="center" onClick={handleLogin}
                        style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Sign in</Button>
                    </Box>

                <Typography style={typographyStyle}>
                    <Link to="/resetpassword" style={{color:'blue', textDecoration: 'none' }}>
                        Forgot password?
                    </Link>
                </Typography>
                <Typography style={typographyStyle}>
                    New here?
                    <Link to="/signup" color='inherit' style={{color:'blue', textDecoration: 'none', marginLeft:5}}>
                        Create a new account
                    </Link>
                </Typography>
                    {
                        state.username.error?
                            <Alert
                                style={{marginTop:5}}
                                severity="error">
                                {state.username.error}
                            </Alert>:null
                    }
                </Paper>
        </Grid>

    );
}
