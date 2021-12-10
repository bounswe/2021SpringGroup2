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
    minSkillLevel: 0,
    maxSkillLevel: 0,
    minCreationDate: 0,
    maxCreationDate: 0,
    minDate: 0,
    maxDate: 0,
    sport: 0,
    minAgeGroup: 0,
    maxAgeGroup: 0,
    minPlayerCapacity: 0,
    maxPlayerCapacity: 0,
    minSpectatorCapacity: 0,
    maxSpectatorCapacity: 0,
    minPlayers: 0,
    maxPlayers: 0,
    minSpectator: 0,
    maxSpectator: 0,
    minLatitude: 0,
    maxLatitude: 0,
    minLongitude: 0,
    maxLongitude: 0,
    minDuration: 0,
    maxDuration: 0,
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
                                id={"minSkillLevel"}
                                setValue={setValue}
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
