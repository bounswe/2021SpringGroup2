import React, {useState, useEffect} from 'react'
import Container from "@mui/material/Container";
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@mui/styles";
import {ListItemText, TextField} from "@mui/material";
import {getSports} from '../../Controllers/SportsController';
import EventInfoCard from "../Home/EventInfoCard";
import Capture from '../images/Capture.png'

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
    others: {
        color: theme.palette.warning.light,
        fontsize: 20,
    },
    media: {
        height: 350
    },
    typography: {
        align: "center"
    }


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
        "numberOfClicks": 0,
        "location": {
            "name": "Etiler Tennis Club",
            "type": "Place",
            "longitude": 12.34,
            "latitude": 56.78,
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
    const [sport, setSport] = useState([{}])

    const getSportInfo = sport => console.log(sport) || getSports()
        .then(sports=>sports.find(s=>s.title===sport))

    useEffect(() => {
        fetch("http://34.68.66.109/api/posts/"+eventid+"/")
            .then(r=>r.json())
            .then(r=>setEvent(r)||r)
            .then(r=>getSportInfo(r.event.object.eventSport))
            .then(setSport)
    }, []);
    // useEffect(() => {
    //     getSportInfo(r=>r.event.object.eventSport)
    //         .then(setSport)
    // })

    return(
        //style={{background:`url(${Capture})`,backgroundRepeat:"no-repeat",backgroundSize:"contain",height:2500,width:1900}}
        <div style={{background:`url(${Capture})`,backgroundRepeat:"no-repeat",backgroundSize:"contain",height:2500,width:1900}}>

            <Grid item xs={12} sm={12} container spacing={3} alignItems="stretch"  className={classes.other}>
                    <Grid item  style={{display: 'flex'}} align={"center"}>
                        <EventInfoCard {...sport}/>

                    </Grid>
            </Grid>

            <Grid container spacing={2}>

                <Grid item xs={12} sm={12}>
                    {/*style={{backgroundColor:"white", display:"flex"}}*/}
                    <Typography className={classes.fav} variant="h4" component="div" align={"center"}>
                        {event.object.title}
                    </Typography>
                    {/*style={{backgroundColor:"orange", borderBlockColor:"black", backgroundSize:"contain", width:400}}*/}
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        Type of Sport: {event.object.eventSport}
                    </Typography>
                    {/*style={{backgroundColor:"orange", borderBlockColor:"black", backgroundSize:"contain", width:400}}*/}
                    <Typography variant="subtitle1" component="div" align={"center"} >
                        Location: {event.object.location.type} {event.object.location.longitude} {event.object.location.latitude}
                    </Typography>
                    {/*style={{backgroundColor:"orange", borderBlockColor:"black", backgroundSize:"contain", width:400}}*/}
                    <Typography gutterBottom variant="body1" align={"center"} >
                        Event Date: {event.object.eventDate}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Typography variant="h5" align={"center"}>
                        Requirements (to apply)
                    </Typography>
                    <Grid container spacing={2} justifyContent={"space-between"} >
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Minimum Age" secondary={event.object.eventMinAge} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Minimum Skill Level" secondary={event.object.eventMinSkillLevel} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Maximum Age" secondary={event.object.eventMaxAge} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Maximum Skill Level" secondary={event.object.eventMaxSkillLevel} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Grid container spacing={2} justifyContent={"space-between"}>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Players" secondary={event.object.eventPlayers} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Event Owner" secondary={event.actor.name} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Creation Date" secondary={event.object.creationDate} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary=" Player Capacity" secondary={event.object.eventPlayerCapacity} />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>


        </div>


    )

}
