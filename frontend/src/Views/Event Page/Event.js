import React, {useState, useEffect} from 'react'
import Container from "@mui/material/Container";
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@mui/styles";
import {ListItemText, TextField} from "@mui/material";
import {getSports} from '../../Controllers/SportsController';
import EventInfoCard from "../Home/EventInfoCard";
import EventInfo from "../Home/SportsEventCard";
import Capture from '../images/Capture.JPG'

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
        fetch("http://34.68.66.109/api/posts/"+eventid)
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

        <div style={{background:`url(${Capture})`,backgroundRepeat:"no-repeat",backgroundSize:"contain",height:2500,width:1900}}>

            <Grid item xs={12} sm={12} container spacing={3} alignItems="stretch"  className={classes.other}>
                    <Grid item  style={{display: 'flex'}} align={"center"}>
                        <EventInfoCard {...sport}/>

                    </Grid>
            </Grid>

            <Grid container spacing={2} xs={12} sm={12} >

                <Grid item xs={12} sm={12}>
                    <Typography className={classes.infotext} variant="h4" component="div" align={"center"} style={{backgroundColor:"black", display:"flex", width:500}}>
                        {event.object.title}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"} style={{backgroundColor:"orange", borderBlockColor:"black", backgroundSize:"contain", width:400}}>
                        Type of Sport: {event.object.eventSport}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"} style={{backgroundColor:"orange", borderBlockColor:"black", backgroundSize:"contain", width:400}}>
                        Location: {event.object.location.type} {event.object.location.longitude} {event.object.location.latitude}
                    </Typography>
                    <Typography gutterBottom variant="body1" align={"center"} style={{backgroundColor:"orange", borderBlockColor:"black", backgroundSize:"contain", width:400}}>
                        Event Date: {event.object.eventDate}
                    </Typography>
                </Grid>

                {/*<Grid item xs={12} sm={12}>*/}
                {/*</Grid>*/}
                <Grid item backgroundColor={"black"}>
                    <Typography variant="body1" className={classes.fav}>
                        Requirements (to apply)
                    </Typography>
                    <Typography className={classes.other}>
                        Age: You should be minimum {event.object.eventMinAge} and maximum {event.object.eventMaxAge} years old.
                    </Typography>
                    <Typography className={classes.other}>
                        Skill: Your skill level should be minimum {event.object.eventMinSkillLevel} and maximum {event.object.eventMaxSkillLevel}.
                    </Typography>
                </Grid>
                {/*<Grid item xs={12} sm={12}>*/}
                {/*    Age: You should be minimum {event.object.eventMinAge} and maximum {event.object.eventMaxAge} years old.*/}
                {/*</Grid>*/}
                {/*<Grid item xs={12} sm={12}>*/}
                {/*    Skill: Your skill level should be minimum {event.object.eventMinSkillLevel} and maximum {event.object.eventMaxSkillLevel}.*/}
                {/*</Grid>*/}
                <Grid item xs={12} sm={12}>
                    <Typography className={classes.fav} variant="body1" >
                        Player Capacity: {event.object.eventPlayerCapacity}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Grid container spacing={2} justifyContent={"space-between"}>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Players" secondary={event.object.eventPlayers} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} style={{textAlign:"right"}} primary="Event Owner" secondary={event.actor.name} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Creation Date: " secondary={event.object.creationDate} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} style={{textAlign:"right"}} primary=" Player Capacity:" secondary={event.object.eventPlayerCapacity} />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>


        </div>


    )

}
