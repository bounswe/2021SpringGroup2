import React, {useState} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
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

const initialFilters = {
    query: "",
    min_skill_level: 0,
    max_skill_level: 100,
    min_creation_date: new Date().toGMTString(),
    max_creation_date: new Date().toGMTString(),
    min_date: new Date().toGMTString(),
    max_date: new Date().toGMTString(),
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
    var space = <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment>
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
                </Grid>
            </Container>
        </React.Fragment>
    );
}
