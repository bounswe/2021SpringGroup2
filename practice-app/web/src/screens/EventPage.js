import React, {useEffect, useState} from 'react'
import Container from "@material-ui/core/Container";
import {InputAdornment, makeStyles, TextField} from "@material-ui/core";
import {useParams} from 'react-router-dom'
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

const event = [
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

export default function Event(props){
    let {id} = useParams()
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const [text, setText] = useState("")
    const classes = useStyles();
    const history = useHistory()
    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (
        <React.Fragment>
        <Container maxWidth={"md"}>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
        </Table>
        </TableContainer>
        </Container>
        </React.Fragment>
    );
}
