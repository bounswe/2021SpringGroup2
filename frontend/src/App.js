import React from 'react';
import {
    Route,
    Routes,
    useHistory
} from "react-router-dom";

import Home from './Views/Home/Index'
import Login from './Views/Login/Index'
import Header from './Views/Shared/Header'
import CreateEventPage from "./Views/Create Event/CreateEventPage";
import ResetPasswordPage from "./Views/Login/ForgotPassword";

const App = () => {
    console.log("sa")
    return (
        <React.Fragment>
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route index element={<Home/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path="*" element={<Home />} />
                    <Route path="createevent" element={<CreateEventPage/>}/>
                    <Route path="resetpassword" element={<ResetPasswordPage/>}/>
                </Route>
            </Routes>
        </React.Fragment>
    )
}

export default App
