import React from 'react';
import {
    Route,
    Routes,
    useHistory
} from "react-router-dom";

import Home from './Views/Home/Index'
import Login from './Views/Login/Index'
import Header from './Views/Shared/Header'
import Homepage from "./Views/Home/Home";


const App = () => {
    console.log("sa")
    return (
        <React.Fragment>
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route index element={<Home/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path="*" element={<Home />} />
                </Route>
            </Routes>
        </React.Fragment>
    )
}

export default App
