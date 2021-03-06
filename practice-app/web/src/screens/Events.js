import React, {useState} from 'react'
import Container from "@material-ui/core/Container";
import {InputAdornment, makeStyles, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import EventRow from '../components/EventRow'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useHistory} from "react-router-dom";

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
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export default function EventScreen() {
    const [text, setText] = useState("")
    const classes = useStyles();
    const history = useHistory()
    return (
        <React.Fragment className="App">
            <Container maxWidth={"md"}>
                <div style={{marginTop:20, marginBottom:20}}>
                    <TextField
                        placeholder={"Search Event"}
                        fullWidth
                        value={text}
                        onChange={e=>setText(e.target.value)}
                        InputProps={{
                            startAdornment:(
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Event Creator</TableCell>
                                <TableCell align="right">Sport</TableCell>
                                <TableCell align="right">Field</TableCell>
                                <TableCell align="right">Players</TableCell>
                                <TableCell align="right">Spectators</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map(event => (
                                <EventRow
                                    onClick={_=>history.push("/event/"+event.eventId)}
                                    key={event.title}
                                    {...event}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </React.Fragment>
    );
}

