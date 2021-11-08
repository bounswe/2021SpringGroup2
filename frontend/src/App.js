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
            <Login/>
        </React.Fragment>
    )
}

export default App
