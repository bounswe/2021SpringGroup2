import React from 'react';
import {
    Route,
    Routes,
    useHistory
} from "react-router-dom";

import Home from './Views/Home/Index'
import Login from './Views/Login/Index'
import Layout from './Views/Shared/Layout'
import CreateEventPage from "./Views/Create Event/CreateEventPage";


const App = () => {
    console.log("sa")
    return (
        <React.Fragment>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path="*" element={<Home />} />
                    <Route path="createevent" element={<CreateEventPage/>}/>
                </Route>
            </Routes>
        </React.Fragment>
    )
}

export default App
