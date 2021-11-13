import React from 'react'
import Container from "@mui/material/Container";
import {Outlet, Route} from "react-router-dom";


const Index = props =><Container component="main" maxWidth="md"><Outlet/></Container>

export default Index