import React from 'react';
import {Outlet, Link, useLocation} from 'react-router-dom'

const Header = () => {

    return (
        <React.Fragment>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/signup">Signup</Link>
                        </li>
                        <li>
                            <Link to="/nothing-here">Nothing Here</Link>
                        </li>
                    </ul>
                </nav>
                <hr />
        </React.Fragment>
    )
}

export default Header
