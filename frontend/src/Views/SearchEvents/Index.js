import React, {useEffect, useState} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { makeStyles, createStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import MinSkillLevel from "./FilterComponents/MinSkillLevel";
import MaxSkillLevel from "./FilterComponents/MaxSkillLevel";
import AgeGroups from "./FilterComponents/AgeGroups";
import Players from "./FilterComponents/Players";
import MinCreationDate from "./FilterComponents/MinCreationDate";
import MaxCreationDate from "./FilterComponents/MaxCreationDate";
import MinDate from "./FilterComponents/MinDate"
import MaxDate from "./FilterComponents/MaxDate"
import { Fragment } from "react";
import {searchEvents} from "../../Controllers/SearchController";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router-dom";
import SportType from "./FilterComponents/SportType";
import EventCard from "./EventCard";


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
    min_latitude: 0.0,
    max_latitude: 0.0,
    min_longitude: 0.0,
    max_longitude: 0.0,
    min_duration: 0.0,
    max_duration: 0.0,
}

export default function SearchEvents() {
    const classes = useStyles()
    const navigate = useNavigate()
    //const { enqueueSnackbar } = useSnackbar();
    const [events, setEvents] = useState([])
    const [filters, setFilters] = useState(initialFilters)
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
    const search = _=>{
        searchEvents(filters)
            .then(r=>console.log(r)||r.results)
            .then(setEvents)
    }
    useEffect(search, [])
    return (
        <React.Fragment>
            <Container component="main" maxWidth={"lg"}>
                <CssBaseline />
                <Grid container spacing={5}>
                    <Grid item md={4}>
                        <Paper
                            className={classes.paper}>
                            <Typography component="h1" variant="h5">
                                Filters
                            </Typography>

                            <div>  {space}  </div>
                            <SportType
                                text={"Sport Type"}
                                {...filters}
                                id={"sport"}
                                setValue={setValue}
                            />
                            <MinSkillLevel
                                {...filters}
                                id={"min_skill_level"}
                                setValue={setValue}
                            />
                            <div>  {space}  </div>
                            <MaxSkillLevel
                                {...filters}
                                id={"max_skill_level"}
                                setValue={setValue}
                            />
                            <div>  {space}  </div>
                            <AgeGroups
                                {...filters}
                                ids={["min_age","max_age"]}
                                setValue={setValues}
                            />
                            <div>  {space}  </div>
                            <Players
                                text={"Players Range"}
                                {...filters}
                                ids={["min_players","max_players"]}
                                setValue={setValues}
                            />
                            <div>  {space}  </div>
                            <Players
                                text={"Spectators Range"}
                                {...filters}
                                ids={["min_spectators","max_spectators"]}
                                setValue={setValues}
                            />
                            <div>  {space}  </div>
                            <Players
                                text={"Player Capacity Range"}
                                {...filters}
                                ids={["min_player_capacity","max_player_capacity"]}
                                setValue={setValues}
                            />
                            <div>  {space}  </div>
                            <Players
                                text={"Spectator Capacity Range"}
                                {...filters}
                                ids={["min_spectator_capacity","max_spectator_capacity"]}
                                setValue={setValues}/>
                            <div>  {space}  </div>
                            <MinCreationDate
                                {...filters}
                                id={"min_creation_date"}
                                setValue={setValue}
                            />
                            <div>  {space}  </div>
                            <MaxCreationDate
                                {...filters}
                                id={"max_creation_date"}
                                setValue={setValue}
                            />
                            <div>  {space}  </div>
                            <MinDate
                                {...filters}
                                id={"min_date"}
                                setValue={setValue}
                            />
                            <div>  {space}  </div>
                            <MaxDate
                                {...filters}
                                id={"max_date"}
                                setValue={setValue}
                            />
                        </Paper>
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
                        {events.map((e, i)=>(
                            <EventCard key={i} {...e}/>
                        ))}
                    </Grid>
                    <Grid item md={1}>

                        <Button
                            color="primary"
                            variant="outlined"
                            style={{marginTop:15}}
                            onClick={search}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>

            </Container>
        </React.Fragment>
    );
}
