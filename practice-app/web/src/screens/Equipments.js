import React, {useEffect, useState} from 'react'
import Container from "@material-ui/core/Container";
import {InputAdornment, makeStyles, TextField} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import EquipmentRow from '../components/EquipmentRow'
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
import FilterEquipmentModal from "../components/FilterEquipmentModal";
import {url} from "../App";

const equip = [
    {
        "equipments": {
            "content": "I have a pair of shoes in good condition that i want to sell.",
            "equipment type": "Shoes",
            "equipmentId": 2,
            "link": "letgo.com/245323",
            "ownerId": 1,
            "title": "Tennis rackets for sale!",
            "website name": "letgo",
            "location": "Ankara"
        }
    }
]

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function EquipmentScreen() {
    const [equipments, setEvents] = useState([equip])
    const getUser = _ =>{
        fetch(url+"api/v1.0/search-equipment-type/+")
            .then(r=>r.json())
            .then(setEvents)
            .catch(e=>console.log(e))
    }
    useEffect(_=>{
        getUser()
    })
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState({});
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
                <Grid container justify={"space-between"} style={{marginBottom:20}}>
                    <Grid item xs={width>600?10:9}>
                        <TextField
                            placeholder={"Search Equipment"}
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
                    </Grid>
                    <Grid item xs={2}>
                        <Button style={{float:"right"}} variant="contained" color="primary">Search</Button>
                    </Grid>
                </Grid>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    startIcon={<FilterListIcon/>}
                    onClick={_=>setOpen(true)}
                >
                    Filter
                </Button>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Website Name</TableCell>
                            <TableCell align="right">Link</TableCell>
                        </TableHead>
                        <TableBody>
                            {equipments.map(equipment => (
                                <EquipmentRow
                                    onClick={_=>history.push("/equipment/"+equipment.postId)}
                                    key={equipment.title}
                                    {...equipment.equipment}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <FilterEquipmentModal
                open={open}
                handleClose={handleClose}
                setFilter={setFilter}
            />
        </React.Fragment>
    );
}
