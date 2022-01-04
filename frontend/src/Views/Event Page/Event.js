import React, {useState, useEffect} from 'react'
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@material-ui/core/styles";
import {CircularProgress, ListItemText, TextField} from "@mui/material";
import {getSportsList} from '../../Controllers/SportsController';
import EventInfoCard from "../Home/EventInfoCard";
import Capture from '../images/Capture.png'
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {applyToEvent, getApplicationsToAnEvent, getUserListInfo} from "../../Controllers/ApplicationsController";
import ApplicantList from "../Application/ApplicantList";
import ApplicantSelection from "../Application/ApplicantSelection";
import {getUserInfoLoggedIn} from "../../Controllers/AuthInfo";
import {Alert} from "@mui/lab";
import EquipmentCard from "../Search/EquipmentSearch/EquipmentCard";
import Container from "@mui/material/Container";
import {searchEquipmentBySport, searchEventBySport} from "../../Controllers/SearchController";
import Comments from "../Comments/Comments";
import {useSnackbar} from "notistack";
import {formatDate} from "../Comments/Comment";


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
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
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
    "init": true,
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
        "eventApplicantsAsPlayer": [1,2,3],
        "eventPlayers": [1,2,3],
        "eventSpectators": [1,2],
        "eventApplicantsAsSpectator":[1,2]
    }
}

export default function Event (){
    const classes = useStyles()
    const params = useParams()
    const eventid = params.eventid
    const [event, setEvent] = useState(initialEvent)
    const [sport, setSport] = useState([{}])
    const [players, setPlayers] = useState([])
    const [spectators, setSpectators] = useState([])
    const [playerApplicants, setPlayerApplicants] = useState([])
    const [spectatorApplicants, setSpectatorApplicants] = useState([])
    const [viewerUser, setViewerUser] = useState(null)
    const [successMessage,setSuccessMessage] = useState(null)
    const [equipments, setEquipments] = useState([])
    const [isLoading,setIsLoading] = useState(true)

    const getSportInfo = sport => console.log(sport) || getSportsList()
        .then(sports=>sports.find(s=>s.label===sport))
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        fetch("http://34.68.66.109/api/posts/"+eventid+"/")
            .then(r=>r.json())
            .then(r=>setEvent(r)||r)
            .then(r=>getSportInfo(r.object.eventSport))
            .then(r=>setSport(r)||r)
            .then(r=>searchEquipmentBySport(r.label))
            .then(setEquipments)
        setViewerUser(getUserInfoLoggedIn())
    }, []);

    useEffect(async () => {
        console.log(event)
        if (!event.init) {
            if (event.object.eventPlayers) {
                await getUserListInfo(event.object.eventPlayers).then(d =>
                    setPlayers(d)
                )
            }
            if (event.object.eventSpectators) {
                await getUserListInfo(event.object.eventSpectators).then(d =>
                    setSpectators(d)
                )
            }
            await getApplicationsToAnEvent(eventid,"player").then(
                res=>{
                    if(res!==null&&res!==undefined){
                        setPlayerApplicants(res)
                    }
                }
            )
            await getApplicationsToAnEvent(eventid,"spectator").then(
                res=>{
                    if(res!==null&&res!==undefined){
                        setSpectatorApplicants(res)
                    }
                }
            )
            setIsLoading(false)
        }
    },[event])

    const handleApplication = (type) => {
        applyToEvent(eventid, type).then(r => {
            enqueueSnackbar("You have successfully applied to the event.", {variant: "success"})
            location.reload()
        }).catch(e=>{
                enqueueSnackbar("An error occured in the server.", {variant: "error"})
                console.log(e)
            })
    }

    return isLoading? <div align={"center"} >
            <CircularProgress /></div>
        :(
        <div>


            <Grid item xs={12} sm={12} container spacing={3} alignItems="stretch"  className={classes.fav}>
                    <Grid item  style={{display: 'flex'}} align={"center"}>
                        <EventInfoCard {...sport}/>

                    </Grid>
            </Grid>

            <Grid container spacing={2}>

                <Grid item xs={12} sm={12}>
                    <Typography className={classes.fav} variant="h4" component="div" align={"center"}>
                        {event.object.title}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        Type of Sport: {event.object.eventSport}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"} >
                        Location: {event.object.location.type} {event.object.location.longitude} {event.object.location.latitude}
                    </Typography>
                    <Typography gutterBottom variant="body1" align={"center"} >
                        Event Date: {formatDate(event.object.eventDate)}
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
                            <ListItemText className={classes.fav} primary="Event Owner" secondary={event.actor.name} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Creation Date" secondary={formatDate(event.object.creationDate)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary=" Player Capacity" secondary={event.object.eventPlayerCapacity} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Stack spacing={3} direction={"row"} justifyContent={"center"}>
                        <Stack spacing={3}>
                            <Stack direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"}>
                                <Typography className={classes.fav}>Players</Typography>
                                <ApplicantSelection users={playerApplicants} type={"player"} event_id={event.object.postId} owner_id={event.object.ownerId}
                                show={viewerUser!==null&&viewerUser.user_id!==null&&Number(viewerUser.user_id)===event.object.ownerId}/>
                            </Stack>
                            <ApplicantList users={players}/>
                        </Stack>
                        <Stack spacing={3}>
                            <Stack direction={"row"} spacing={1} justifyContent={"center"} alignItems={"center"}>
                                <Typography className={classes.fav}>Spectators</Typography>
                                <ApplicantSelection users={spectatorApplicants} type={"spectator"} event_id={event.object.postId} owner_id={event.object.ownerId}
                                    show={viewerUser!==null&&viewerUser.user_id!==null&&Number(viewerUser.user_id)===event.object.ownerId}/>
                            </Stack>
                            <ApplicantList users={spectators}/>
                        </Stack>
                    </Stack>

                </Grid>
                <Grid item xs={12} sm={12}>
                    <Stack direction={"row"} spacing={3} justifyContent={"center"}>
                            <Comments id={eventid} isEvent={"posts"}/>
                            <Button onClick={()=>{handleApplication("player")}} disabled={viewerUser===null||viewerUser===false||viewerUser.user_id===null||
                            players.length===event.object.eventPlayerCapacity||
                            event.object.eventPlayers.includes(Number(viewerUser.user_id))||
                            event.object.eventApplicantsAsPlayer.includes(Number(viewerUser.user_id))}
                                    variant={"contained"} style={{backgroundColor:"green"}}>Player Application</Button>
                            <Button onClick={()=>{handleApplication("spectator")}} disabled={viewerUser===null||viewerUser===false||viewerUser.user_id===null||
                            event.object.eventSpectators.includes(Number(viewerUser.user_id))||
                            event.object.eventApplicantsAsSpectator.includes(Number(viewerUser.user_id))}
                                variant={"contained"} style={{backgroundColor:"red"}}>Spectator Application</Button>
                    </Stack>
                </Grid>
            </Grid>

            <Container style={{marginTop:100}}>
                <h2>Related Equipments</h2>
                {equipments.map((e, i)=>(
                    <EquipmentCard key={i} {...e}/>
                ))}
            </Container>

        </div>


    )

}
