import React, {useState} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { makeStyles, createStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
//import {useNavigate} from 'react-router-dom'
//import {useSnackbar} from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import MinSkillLevel from "./FilterComponents/MinSkillLevel";
import MaxSkillLevel from "./FilterComponents/MaxSkillLevel";
import AgeGroups from "./FilterComponents/AgeGroups";
import Players from "./FilterComponents/Players";


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
        position: "fixed",
        //height: "80%",
    },
}));

const initialFilters = {
    query: "",
    min_skill_level: 0,
    max_skill_level: 100,
    min_creation_date: new Date(),
    max_creation_date: new Date(),
    min_date: new Date(),
    max_date: new Date(),
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
    //const navigate = useNavigate()
    //const { enqueueSnackbar } = useSnackbar();

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
    return (
        <React.Fragment>
            <Container component="main" maxWidth={"lg"}>
                <CssBaseline />
                <Grid container spacing={5}>
                    <Grid item md={3}>
                        <Paper
                            className={classes.paper}>
                            <Typography component="h1" variant="h5">
                                Filters
                            </Typography>
                            <MinSkillLevel
                                {...filters}
                                id={"min_skill_level"}
                                setValue={setValue}
                            />
                            <MaxSkillLevel
                                {...filters}
                                id={"max_skill_level"}
                                setValue={setValue}
                            />
                            <AgeGroups
                                {...filters}
                                ids={["min_age","max_age"]}
                                setValue={setValues}
                            />
                            <Players
                                text={"Players Range"}
                                {...filters}
                                ids={["min_players","max_players"]}
                                setValue={setValues}
                            />
                            <Players
                                text={"Spectators Range"}
                                {...filters}
                                ids={["min_spectators","max_spectators"]}
                                setValue={setValues}
                            />
                            <Players
                                text={"Player Capacity Range"}
                                {...filters}
                                ids={["min_player_capacity","max_player_capacity"]}
                                setValue={setValues}
                            />
                            <Players
                                text={"Spectator Capacity Range"}
                                {...filters}
                                ids={["min_spectator_capacity","max_spectator_capacity"]}
                                setValue={setValues}
                            />
                        </Paper>
                    </Grid>
                    <Grid item md={8}>
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
                    </Grid>
                    <Grid item md={1}>

                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}
