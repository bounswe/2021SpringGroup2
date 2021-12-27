import React from 'react';
import {
    Route,
    Routes,
    useHistory
} from "react-router-dom";

import Home from './Views/Home/Index'
import Login from './Views/Login/Index'
import Layout from './Views/Shared/Layout'
import Signup from './Views/Signup/Index'
import EditProfile from "./Views/Profile/EditProfile";
import ViewProfile from "./Views/Profile/ViewProfile";
import Profile from "./Views/Profile/Index";
import ResetPasswordPage from "./Views/Login/ForgotPassword";
import SearchEvents from "./Views/SearchEvents/Index";

import NotFound from "./Views/Not Found/NotFound";
import CreateEventPage from "./Views/Create Event/CreateEventPage";


const App = () => {
    console.log("sa")
    return (
        <React.Fragment>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='signup' element={<Signup/>}/>
                    <Route path='profile' element={<Profile/>}>
                        <Route path="edit" element={<EditProfile/>}/>
                        <Route path=":userid" element={<ViewProfile/>}/>
                        <Route index element={<ViewProfile/>}/>
                    </Route>  <Route path="createevent" element={<CreateEventPage/>}/>
                    <Route path="home" element={<Home />} />
                    <Route path="resetpassword" element={<ResetPasswordPage/>}/>
                    <Route path="search" element={<SearchEvents/>}/>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </React.Fragment>
    )
}

export default App
