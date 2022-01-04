import React, {useEffect, useState} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { makeStyles, createStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Fragment } from "react";
import {searchEquipments, searchEvents, searchUsers} from "../../Controllers/SearchController";
import Button from '@mui/material/Button';
import {useSearchParams} from "react-router-dom";
import EventFilter from "./EventSearch/EventFilter";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EventTab from "./EventSearch/EventTab";
import EquipmentTab from "./EquipmentSearch/EquipmentTab";
import UserTab from "./UserSearch/UserTab";
import Pagination from '@mui/material/Pagination';

const useStyles = makeStyles(theme => createStyles({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(10),
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //border: "1px solid black",
        //position: "fixed",
        //height: "80%",
    },
}));

export const initialFilters = {
    query: "",
    min_skill_level: 0,
    max_skill_level: 100,
    min_creation_date: new Date(2021, 1, 1).toISOString().split("T")[0],
    max_creation_date: new Date(2025, 1, 1).toISOString().split("T")[0],
    min_date: new Date().toISOString().split("T")[0],
    max_date: new Date().toISOString().split("T")[0],
    sport: "",
    min_age: 0,
    max_age: 150,
    min_player_capacity: 0,
    max_player_capacity: 100,
    min_spectator_capacity: 0,
    max_spectator_capacity: 1000,
    min_players: 0,
    max_players: 100,
    min_spectators: 0,
    max_spectators: 1000,
    min_latitude: null,
    max_latitude: null,
    min_longitude: null,
    max_longitude: null,
    min_duration: 0.0,
    max_duration: 0.0,
    page:1
}

export default function SearchEvents() {
    const classes = useStyles()
    //const { enqueueSnackbar } = useSnackbar();
    let [searchParams, setSearchParams] = useSearchParams();
    const searchFilters = {...initialFilters}
    searchParams.forEach((val, key)=>{searchFilters[key] = val})
    const [events, setEvents] = useState([])
    const [users, setUsers] = useState([])
    const [max, setMax] = useState(1)
    const [equipments, setEquipments] = useState([])
    const [tab, setTab] = useState(0)
    const [filters, setFilters] = useState(searchFilters)
    const setValue = id => value => {
        const newFilters = {...filters}
        newFilters[id] = value
        setFilters(newFilters)
    }
    const setValues = ids => values => {
        const newFilters = {...filters}
        for(let id in ids)
            newFilters[ids[id]] = values[id]
        setFilters(newFilters)
    }
    const space = <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment>
    const handleClick = _=>{
        const newParams = {}
        for(let key in initialFilters){
            if(filters[key] !== initialFilters[key]){
                newParams[key] = filters[key]
            }
        }
        setSearchParams(newParams)

    }
    const search = _=>{
        const filters = {}
        searchParams.forEach((val, key)=>{filters[key] = val})
        let maxPage = 0
        searchEvents(filters)
            .then(r=> {
                maxPage = r.totalPages
                return r.results
            })
            .then(setEvents)
            .then(_=>searchEquipments(filters))
            .then(r=> {
                maxPage = r.totalPages>maxPage?r.totalPages:maxPage
                return r.results
            })
            .then(setEquipments)
            .then(_=>setMax(maxPage))
            .then(_=>searchUsers(filters))
            .then(r=>console.log(r)||r.results)
            .then(setUsers)
    }
    useEffect(search, Object.values(searchFilters))
    return (
        <React.Fragment>
            <Container component="main" maxWidth={"lg"}>
                <CssBaseline />
                <Grid container spacing={5}>
                    <Grid item md={4}>
                        <EventFilter
                            setValue={setValue}
                            setValues={setValues}
                            filters={filters}
                            space={space}
                            classes={classes}
                        />
                    </Grid>
                    <Grid item md={7}>
                        <TextField
                            style={{marginTop:15}}
                            fullWidth
                            id="query"
                            label="Query"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            color={"info"}
                            value={filters.query}
                            onChange={e=>setValue("query")(e.target.value)}
                        />
                        <Tabs
                            value={tab}
                            onChange={(event, newValue) => setTab(newValue)}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Events" id={`full-width-tab-event`} aria-controls={"full-width-tabpanel-event"}/>
                            <Tab label="Equipments" id={`full-width-tab-equipment`} aria-controls={"full-width-tabpanel-equipment"}/>
                            <Tab label="Users" id={`full-width-tab-user`} aria-controls={"full-width-tabpanel-user"}/>
                        </Tabs>
                        <EventTab
                            hidden={tab!==0}
                            events={events}
                        />
                        <EquipmentTab
                            hidden={tab!==1}
                            equipments={equipments}
                        />
                        <UserTab
                            hidden={tab!==2}
                            users={users}
                        />
                        <Pagination
                            count={max}
                            page={filters.page}
                            onChange={(event, value) => setValue("page")(value)}
                        />
                    </Grid>
                    <Grid item md={1}>

                        <Button
                            color="primary"
                            variant="outlined"
                            style={{marginTop:15}}
                            onClick={handleClick}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>

            </Container>
        </React.Fragment>
    );
}
