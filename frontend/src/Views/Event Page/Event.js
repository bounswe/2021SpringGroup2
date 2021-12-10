import React, {useState, useEffect} from 'react'
import Container from "@mui/material/Container";
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@mui/styles";
import Paper from "@mui/material/Paper";
import {getEvent} from "../../Controllers/GetEventController";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {ListItemText, TextField} from "@mui/material";
import EventInfoCard from "../Home/EventCard";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SportsInfoCard from "../Home/SportsInfoCard";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Button from "@mui/material/Button";
import {Link} from 'react-router-dom'
import Joi, {options} from 'joi'
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker'
import {Autocomplete} from "@mui/lab";
import {getSportsList} from "../../Controllers/SportsController";


import BoardComponent from '../Event Page/Components/BoardComponent'

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const useStyles = makeStyles(theme => createStyles({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    fav: {
        color: theme.palette.warning.light,
        fontsize: 20,
    },
    other: {
        color: theme.palette.secondary.light,
        fontsize: 20,
    },
    info: {
        color: theme.palette.primary.light,
        fontsize: 20,
    },
    infotext: {
        color: theme.palette.secondary.light,
        fontsize: 20,
    },
}));

const event = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "summary": "Sally created an event",
    "type": "Create",
    "actor": {
        "type": "Person",
        "name": "Sally"
    },
    "object": {
        "type": "Event",
        "name": "A Simple Event",
        "postId": "",
        "ownerId": "",
        "content": "",
        "title": "Beginner friendly tennis game",
        "creationDate": "2014-11-31T23:00:00-08:00",
        "lastUpdateDate": "2014-11-31T23:00:00-08:00",
        "numberOfClicks": 0,
        "location": {
            "name": "Etiler Tennis Club",
            "type": "Place",
            "longitude": 12.34,
            "latitude": 56.78,
            "altitude": 90,
            "units": "m"
        },
        "eventDate": "2014-12-31T23 00 00-08 00",
        "eventSport": "Tennis",
        "eventMinAge": 16,
        "eventMaxAge": 18,
        "eventMinSkillLevel": 1,
        "eventMaxSkillLevel": 5,
        "eventPlayerCapacity": 12,
        "eventSpectatorCapacity": 12,
        "eventApplicants": [1,2,3],
        "eventPlayers": [1,2,3]
    }
}




export default function Event (){
    const classes = useStyles()
    const params = useParams()
    const id = params.id
    //const [event, setEvent] = useState(event)



    // useEffect(() => {
    //     //fetch()
    //
    //     getEvent(id)
    //         .then(p=>{
    //             const newEvent = {...event}
    //             for(let i in p){
    //                 newEvent[i].value = p[i]
    //             }
    //             setEvent(newEvent)
    //         })
    //         .catch(console.log)
    //
    // }, []);


    return(
        // <div className={classes.paper}>
        //     <h1>Hellooo</h1>
        //     <Typography variant="h4" component="div" align={"center"}>
        //         {event.actor.name}
        //     </Typography>
        //
        // </div>


        <div className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Typography className={classes.infotext} variant="h4" component="div" align={"center"}>
                        {event.object.title}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        Type of Sport: {event.object.eventSport}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        Location: {event.object.location.type}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography gutterBottom variant="body1" align={"center"}>
                        Date: {event.object.eventDate}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography className={classes.fav} variant="body1" >
                        Requirements (to apply)
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    Age: You should be minimum {event.object.eventMinAge} and maximum {event.object.eventMaxAge} years old.
                </Grid>
                <Grid item xs={12} sm={12}>
                    Skill: Your skill level should be minimum {event.object.eventMinSkillLevel} and maximum {event.object.eventMaxSkillLevel}.
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography className={classes.fav} variant="body1" >
                        Player Capacity: {event.object.eventPlayerCapacity}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Grid container spacing={2} justifyContent={"space-between"}>
                        <Grid item xs={12} sm={6}>
                            <ListItemText primary="Players" secondary={event.object.eventPlayers} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText style={{textAlign:"right"}} primary="Event Owner" secondary={event.actor.name} />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

        </div>


    )

}
