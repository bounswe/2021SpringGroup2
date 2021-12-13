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
import {getSports} from '../../Controllers/SportsController';
import {getSampleEvents} from "../../Controllers/SampleEventController";
import SportsInfoCard from "../Home/SportsInfoCard";
import EventInfoCard from "../Home/EventInfoCard";
import {Card, CardActionArea, CardMedia, CardContent} from "@mui/material";
import Box from '@mui/material/Box';

const useStyles = makeStyles(theme => createStyles({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        color: theme.palette.secondary.light,
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
    others: {
        color: theme.palette.warning.light,
        fontsize: 20,
    },
    infos: {
        color: theme.palette.common.light,
        fontsize: 20,
    },
    infotexts: {
        color: theme.palette.background.light,
        fontsize: 20,
    },
    hero: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://penaltyfile.com/wp-content/uploads/2020/06/different-types-of-sports-June32020-1-min.jpg')`,
        height: "250px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: "4rem",
        [theme.breakpoints.down("sm")]: {
            height: 300,
            fontSize: "3em"
        }
    },

    media: {
        height: 350
    },

}));

const initialEvent = {
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
    //
    const eventid = params.eventid
    const [event, setEvent] = useState(initialEvent)
    const [sports, setSports] = useState([{}])
    const [eventTitle, setEventTitle] = useState(initialEvent.object.eventSport)

    const [eventIndex, setEventIndex] = useState((0))
    // useEffect(() => {
    //     fetch("http://34.68.66.109/api/posts/"+eventid)
    //         .then(r=>r.json())
    //         .then(r=>setEvent(r))
    // }, []);

    useEffect(_=>{
        getSports().then(r=>setSports(r))
            .catch(console.log)
    }, [])
    if(eventTitle)

    return(
        // <div className={classes.paper}>
        //     <h1>Hellooo</h1>
        //     <Typography variant="h4" component="div" align={"center"}>
        //         {event.actor.name}
        //     </Typography>
        //
        // </div>


        <div >
            {/*<Container>*/}
            {/*    <Grid>*/}
            {/*        <Card>*/}
            {/*            <CardActionArea>*/}
            {/*                <CardMedia*/}
            {/*                    className= {classes.media}*/}

            {/*                    //image = "https://d.pusulahaber.com.tr/news/64433.jpg"*/}
            {/*                    title = "Event Image"/>*/}

            {/*            </CardActionArea>*/}
            {/*        </Card>*/}
            {/*    </Grid>*/}

            {/*</Container>*/}

            <Grid item xs={12} sm={12} container spacing={3} alignItems="stretch"  >
                {sports.slice(eventIndex, 1).map(s=>(
                    <Grid item  style={{display: 'flex'}} >
                        <EventInfoCard {...s}/>

                    </Grid>)
                )}
            </Grid>

            <Grid container spacing={2}>

                <Grid item xs={12} sm={12}>
                    <Typography className={classes.infotext} variant="h4" component="div" align={"center"}  className={classes.paper}>
                        {event.object.title}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        Type of Sport: {event.object.eventSport}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        Location: {event.object.location.type}
                    </Typography>
                    <Typography gutterBottom variant="body1" align={"center"}>
                        Date: {event.object.eventDate}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                </Grid>
                <Grid item >
                    <Typography variant="body1" className={classes.fav}>
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
