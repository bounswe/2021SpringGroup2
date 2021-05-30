import React, {useEffect, useState} from 'react'
import Container from "@material-ui/core/Container";
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import EventRow from '../components/EventRow'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {useHistory} from "react-router-dom";
import FilterEventModal from "../components/FilterEventModal";
import TextField from "@material-ui/core/TextField";

const events = [
    {
        eventId: 1,
        owner: "emre_gundogu",
        title:  "Tennis Game for Everyone",
        content: "People who are looking for a tennis court can apply this event. Our court is for you if you are seeking for a clean and well-lit court.",
        location: "Bebek Tennis Club",
        date: "01.05.2021",
        hours: "15.00",
        sport: "Tennis",
        ageGroup: "Any age",
        skillLevel: "Any level",
        playerCapacity: "2",
        spectatorCapacity: "8",
        spectators: [],
        players: []
    }
]

const fields = [
    "Age",
    "Location",
    "Location Range",
    "Gender",
    "Skill Level"
]

export default function CreateEvent() {

    return (
        <React.Fragment>
            <Container maxWidth={"md"}>
                {
                    fields.map(field=>(
                        <TextField
                            key={field}
                            autoFocus
                            margin="dense"
                            id={field}
                            label={field}
                            type="string"
                            fullWidth

                        />
                    ))
                }
            </Container>
        </React.Fragment>
    );
}

