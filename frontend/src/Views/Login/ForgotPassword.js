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
export function checkEmailValidity(email){
    if(email.match(/\S+@\S+\.\S+/)||email.match(/\S+@\S+\.\S+\.\S+/)){
        return true
    }
    return false
}
export function checkPasswordValidity(password){
    if(password.length>=8&&password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)){
        return true
    }
    return false
}
export default function ResetPasswordPage(props){
    const paperStyle = {padding:20, height: '60vh', width:300, margin:"20px auto", background: "#EFF1F3"};
    const textFieldStyle = {backgroundColor: 'white',marginTop:10,marginBottom:10}
    const inputStyle = {height:"10mm",fontSize:"5px"}
    const typographyStyle = {fontSize:14, marginBottom:2,marginTop:2, marginLeft: 1}
    const [state, setState] = useState(initialState)
    const [alert, setAlert] = useState(null)

    const handleChange = e=>{
        const newState = {...state}
        newState[e.target.id] = {
            value: e.target.value,
            changed: true,
            error: newState[e.target.id].error
        }
        setState(newState)
        if(e.target.id==="email"){
            if(!checkEmailValidity(e.target.value)){
                setAlert("Please enter a valid email")
            }
            else{
                setAlert(null)
            }
        }
        if(e.target.id==="password"){
            if(!checkPasswordValidity(e.target.value)){
                setAlert("Your password must be at least 8 characters long with lowercase, uppercase characters and digits.")
            }
            else{
                setAlert(null)
            }
        }
        if(e.target.id==="repeat"){
            console.log(state.password.value,state.repeat.value,e.target.value)
            if(state.password.value!==e.target.value){
                setAlert("Your passwords do not match")
            }
            else{
                setAlert(null)
            }
        }
    }
    function handleClick() {
        if(!checkEmailValidity(state.email.value)){
            return
        }
        console.log(state.email.value)
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
        if(!checkPasswordValidity(state.password.value)||(state.password.value!==state.repeat.value)){
                return
        }
        console.log(state.password.value,state.token.value)
        postResetPasswordConfirmation(state.password.value,state.token.value)
            .then(function(r){
                if(r.status===undefined){
                    const newState = {...state}
                    newState.status.value = 3
                    newState.token.error = r.password?r.password:"Please enter a valid token"
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
                        {alert!==null&&(state.status.value===0||state.status.value===1)?<Alert
                            style={{marginTop:5}}
                            severity="error">
                            {alert}
                        </Alert>:null}
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
                                {alert!==null?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {alert}
                                    </Alert> :
                                    null}
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
