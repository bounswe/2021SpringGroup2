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
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
    TimePicker
} from '@material-ui/pickers';
import {url} from "../App";


export default function CreateEvent() {

    const [selectedDate, setSelectedDate] = React.useState(new Date('2021-06-10T12:00:00'));
    const [filter, setFilter] = React.useState({});

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const [selectedTime, setSelectedTime] = React.useState(null);
    const handleChange = e=>{
        const f = {...filter}
        f[e.target.id] = e.target.value
        setFilter(f)
    }
    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };
    const submit = _=>{
        fetch(url+"/events",{
            method: "post",
            body:JSON.stringify({
                ownerID: filter["user_id"],
                title: filter["Title"],
                content: filter["Description"],
                eventDate: selectedDate,
                eventHours: selectedTime,
                eventSport: filter["Sport"],
                eventPlayerCapacity: filter["Player Capacity"],
                eventSpectatorCapacity: filter["Spectator Capacity"],
                eventSkillLevel: filter["Skil Level"]
            })
        })
    }
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <React.Fragment>
                <Container maxWidth="sm">
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Title"
                        label="Title"
                        type="string"
                        value={filter["Title"]||""}
                        fullWidth
                        onChange={handleChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Description"
                        label="Description"
                        type="string"
                        value={filter["Description"]||""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Sport"
                        label="Sport"
                        type="string"
                        value={filter["Sport"]||""}
                        onChange={handleChange}
                        fullWidth
                    /><TextField
                    autoFocus
                    margin="dense"
                    id="Location"
                    label="Location"
                    type="string"
                    onChange={handleChange}
                    value={filter["Location"]||""}
                    fullWidth
                />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Skil Level"
                        label="Skill Level"
                        type="string"
                        onChange={handleChange}
                        value={filter["Skil Level"]||""}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Age Group"
                        label="Age Group"
                        type="string"
                        onChange={handleChange}
                        value={filter["Age Group"]||""}
                        fullWidth
                    />
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="Event Date"
                        label="Event Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <TimePicker
                        clearable
                        ampm={false}
                        label="Event Hours"
                        value={selectedTime}
                        value={filter["Title"]||""}
                        onChange={handleTimeChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Player Capacity"
                        label="Player Capacity"
                        type="string"
                        onChange={handleChange}
                        value={filter["Player Capacity"]||""}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Spectator Capacity"
                        label="Spectator Capacity"
                        type="string"
                        onChange={handleChange}
                        value={filter["Spectator Capacity"]||""}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="user_id"
                        label="Creator"
                        type="string"
                        onChange={handleChange}
                        value={filter["user_id"]||""}
                        fullWidth
                    />
                    <Button onClick={submit} variant={"outlined"}>
                        Gönder
                    </Button>
                </Container>
            </React.Fragment>
        </MuiPickersUtilsProvider>
    );
}
