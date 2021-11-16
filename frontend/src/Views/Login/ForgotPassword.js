import * as React from "react";
import Button from "@mui/material/Button";
import {Grid, Paper, TextField, Typography, Box, SvgIcon} from "@mui/material";
import {Link} from 'react-router-dom'
import {Icon} from '@mui/material';
import Joi from 'joi'
import {postResetPassword,postResetPasswordConfirmation} from "../../Controllers/LoginController";
import {useState} from "react";
import {Alert} from "@mui/lab";


const initialState = {
    status: {
        value: 0,
        changed: false
    },
    email: {
        value: "",
        changed: false,
        error: undefined
    },
    token:{
        value: "",
        changed: false,
        error: undefined
    },
    password:{
        value: "",
        changed: false,
        error: undefined
    },
    repeat:{
        value: "",
        changed: false,
        error: undefined
    }

}
export default function ResetPasswordPage(props){
    const paperStyle = {padding:20, height: '60vh', width:300, margin:"20px auto", background: "#EFF1F3"};
    const textFieldStyle = {backgroundColor: 'white',marginTop:10,marginBottom:10}
    const inputStyle = {height:"10mm",fontSize:"5px"}
    const typographyStyle = {fontSize:14, marginBottom:2,marginTop:2, marginLeft: 1}
    const [state, setState] = useState(initialState)
    const getValue = state => ({
        email: state.email.value
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
    function handleClick() {
        postResetPassword(state.email.value)
            .then(function(r){
                if(r.status===undefined){
                    const newState = {...state}
                    newState.status.value = 1
                    newState.email.error = "Your email address is invalid"
                    setState(newState)
                }
                else{
                    const newState = {...state}
                    newState.status.value = 2
                    setState(newState)
                }
            })
    }
    function handleResetClick() {
        postResetPasswordConfirmation(state.password.value,state.token.value)
            .then(function(r){
                if(r.status===undefined){
                    const newState = {...state}
                    newState.status.value = 3
                    newState.token.error = "Your token is incorrect"
                    setState(newState)
                }
                else{
                    const newState = {...state}
                    newState.status.value = 4
                    setState(newState)
                }
            })
    }
    return (<Grid>
                <Typography align='center' component="h1" variant="h5">
                    Reset your password
                </Typography>
                <Paper elevation={1} style={paperStyle}>
                    <form style={{width: "100%", marginTop: 3}} noValidate>
                        <TextField id="email" label="Enter your email address" fullWidth required size="small" variant="outlined" style={textFieldStyle}
                                   value={state.email.value||""} onChange={handleChange}  InputProps={inputStyle}></TextField>
                        {state.status.value===0?(
                                <Box textAlign='center' style={{marginTop: 5,marginBottom:3}}>
                                    <Button variant="contained" align="center" onClick={handleClick}
                                            style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Send Reset Token</Button>
                                </Box>
                            ) : state.status.value===1?(
                                <div>
                                    <Box textAlign='center' style={{marginTop: 5,marginBottom:3}}>
                                        <Button variant="contained" align="center" onClick={handleClick}
                                                style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Send Reset Token</Button>
                                    </Box>
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.email.error}
                                    </Alert>
                                </div>
                        ): state.status.value===2?(
                            <div>
                                <Typography style={typographyStyle}>
                                    We sent an email with a reset token to your email address
                                </Typography>
                                <TextField id="token" label="Enter your token" fullWidth required size="small" variant="outlined" style={textFieldStyle}
                                           value={state.token.value||""} onChange={handleChange}  InputProps={inputStyle}></TextField>
                                <TextField id="password" type="password" label="Enter your new password"  fullWidth required size="small" variant="outlined" style={textFieldStyle}
                                           value={state.password.value||""} onChange={handleChange}  InputProps={inputStyle}></TextField>
                                <TextField id="repeat" type="password" label="Repeat your password" fullWidth required size="small" variant="outlined" style={textFieldStyle}
                                           value={state.repeat.value||""} onChange={handleChange}  InputProps={inputStyle}></TextField>
                                <Box textAlign='center' style={{marginTop: 5,marginBottom:3}}>
                                    <Button variant="contained" align="center" onClick={handleResetClick}
                                            style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Reset Password</Button>
                                </Box>
                            </div>
                        ):state.status.value===3?(
                                <div>
                                    <TextField id="token" label="Enter your token" fullWidth required size="small" variant="outlined" style={textFieldStyle}
                                               value={state.token.value||""} onChange={handleChange}  InputProps={inputStyle}></TextField>
                                    <TextField id="password" type="password" label="Enter your new password"  fullWidth required size="small" variant="outlined" style={textFieldStyle}
                                               value={state.password.value||""} onChange={handleChange}  InputProps={inputStyle}></TextField>
                                    <TextField id="repeat" type="password" label="Repeat your password" fullWidth required size="small" variant="outlined" style={textFieldStyle}
                                               value={state.repeat.value||""} onChange={handleChange}  InputProps={inputStyle}></TextField>
                                    <Box textAlign='center' style={{marginTop: 5,marginBottom:3}}>
                                        <Button variant="contained" align="center" onClick={handleResetClick}
                                                style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Reset Password</Button>
                                    </Box>
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {state.token.error}
                                    </Alert>
                                </div>
                        ):(
                            <div>
                                <Box textAlign='center' style={{marginTop: 5,marginBottom:3}}>
                                    <Button variant="contained" align="center" onClick={handleClick}
                                            style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Send Reset Token</Button>
                                </Box>
                                <Alert
                                style={{marginTop:5}}
                                severity="success">
                                {"You have successfully reset your password."}
                                </Alert>
                            </div>
                            )}
                    </form>
                </Paper>
        </Grid>

    );
}
