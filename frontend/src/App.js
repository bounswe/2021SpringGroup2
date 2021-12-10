import React from 'react';
import {
    Route,
    Routes,
} from "react-router-dom";

import Home from './Views/Home/Index'
import Login from './Views/Login/Index'
import Layout from './Views/Shared/Layout'
import CreateEventPage from "./Views/Create Event/CreateEventPage";
import Signup from './Views/Signup/Index'
import ResetPasswordPage from "./Views/Login/ForgotPassword";
import SearchEvents from "./Views/SearchEvents/Index";




const App = () => {
    console.log("sa")
    return (
        <React.Fragment>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='signup' element={<Signup/>}/>
                    <Route path="createevent" element={<CreateEventPage/>}/>
                    <Route path="home" element={<Home />} />
                    <Route path="resetpassword" element={<ResetPasswordPage/>}/>
                    <Route path="search" element={<SearchEvents/>}/>
                    <Route path="*" element={<Home />} />
                </Route>
            </Routes>
        </React.Fragment>
    )
}

export default App
