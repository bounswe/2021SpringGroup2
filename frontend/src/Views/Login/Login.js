import * as React from "react";
import Button from "@mui/material/Button";
import {Grid, Paper, TextField, Typography, Box, SvgIcon} from "@mui/material";
import {Link} from 'react-router-dom'
import {Icon} from '@mui/material';
import Joi from 'joi'


export default function LoginPage(props){
    const paperStyle = {padding:20, height: '40vh', width:280, margin:"20px auto", background: "#EFF1F3"};
    const textFieldStyle = {backgroundColor: 'white'}
    const inputStyle = {height:"10mm",fontSize:"5px"}
    const typographyStyle = {fontSize:14, marginBottom:2,marginTop:2, marginLeft: 1}
    return (<Grid>
                <Grid align='center'>

                    <h3><span style={{
                        display: "block",
                        fontSize: "24px",
                        fontWeight: "300",
                        letterSpacing: "-0.5px"}}>Sign in to rebound</span></h3>
                </Grid>
                <Paper elevation={3} style={paperStyle}>
                <Typography style = {typographyStyle}>
                    Username or email
                </Typography>
                <TextField fullWidth required  size="small" style={textFieldStyle}
                InputProps={inputStyle}></TextField>
                <Typography style = {typographyStyle}>
                    Password
                </Typography>
                <TextField fullWidth type="password" required size="small" style={textFieldStyle}></TextField>
                    <Box textAlign='center' style={{marginTop: 5,marginBottom:3}}>

                    <Button type="submit" variant="contained" align="center"
                        style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Sign in</Button>
                    </Box>
                <Typography style={typographyStyle}>
                    <Link to="/forgotpassword" style={{color:'blue', textDecoration: 'none' }}>
                        Forgot password?
                    </Link>
                </Typography>
                <Typography style={typographyStyle}>
                    New here?
                    <Link to="/signup" color='inherit' style={{color:'blue', textDecoration: 'none', marginLeft:5}}>
                        Create a new account
                    </Link>
                </Typography>
                </Paper>
        </Grid>

    );
}
