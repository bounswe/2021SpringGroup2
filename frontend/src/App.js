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
                    </Route>
                    <Route path="*" element={<Home />} />
                </Route>
            </Routes>
        </React.Fragment>
    )
}

export default App
