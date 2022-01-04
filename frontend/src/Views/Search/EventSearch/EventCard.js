import React, {useEffect, useState} from 'react'
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {useNavigate} from "react-router-dom";
import ButtonBase from "@mui/material/ButtonBase";
import Skeleton from "@mui/material/Skeleton";
import {getEvent} from "../../../Controllers/SearchController";

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
        "postId": "",
        "ownerId": "",
        "content": "anyone is welcome to our game",
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
        "eventDate": "2014-11-31T23:00:00-08:00",
        "eventSport": "Tennis",
        "eventMinAge": 16,
        "eventMaxAge": 18,
        "eventMinSkillLevel": 1,
        "eventMaxSkillLevel": 5,
        "eventPlayerCapacity": 12,
        "eventSpectatorCapacity": 12,
        "eventApplicants": [1,2,3],
        "eventPlayers": [1,2,3],
        "eventApplicantsAsSpectator": [1,2,3],
    }
}

export default function EventCard(props){
    const [event, setEvent] = useState(initialEvent)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(_=>{
        getEvent(props.id)
            .then(e=>setEvent(e))
            .then(_=>setLoading(false))
    }, [])
    return loading?(
        <Card sx={{ minWidth: 275,  marginTop: 15}}>
            <CardContent>
                <Skeleton variant="text" width={300}/>
                <Skeleton variant="text" width={50}/>
                <Skeleton variant="text" />
                <Skeleton variant="text" width={70}/>
                <Skeleton variant="text" width={70}/>
                <Skeleton variant="text" width={70}/>
                <Skeleton variant="text" width={70}/>
                <Skeleton variant="text" width={70}/>
                <Skeleton variant="text" width={70}/>
            </CardContent>
        </Card>
    ):(
        <Card sx={{ minWidth: 275,  marginTop: 15}}>
            <ButtonBase
            style={{
                display: 'block',
                textAlign: 'initial',
                width: "100%"
            }}
            onClick={_=>navigate("/event/"+props.id)}>
                <CardContent>
                    <Typography sx={{ fontSize: 22 }} color="text.primary">
                        {event.object.title}
                    </Typography>
                    <Typography onClick={_=>navigate("/profile/"+event.actor.name)} sx={{ fontSize: 12 }} color="text.secondary">
                        @{event.actor.name}
                    </Typography>
                    <Typography  sx={{ fontSize: 18 }} gutterBottom>
                        {event.object.content}
                    </Typography>
                    <Typography variant="body2">
                        {new Date(event.object.eventDate).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                        Coordinates: {event.object.location.latitude} - {event.object.location.longitude}
                    </Typography>
                    <Typography variant="body2">
                        Skill Levels: {event.object.eventMinSkillLevel} - {event.object.eventMaxSkillLevel}
                    </Typography>
                    <Typography variant="body2">
                        Age:  {event.object.eventMinAge} - {event.object.eventMaxAge}
                    </Typography>
                    <Typography variant="body2">
                        Players:  {event.object.eventPlayers.length} / {event.object.eventPlayerCapacity}
                    </Typography>
                    <Typography variant="body2">
                        Spectators:  {event.object.eventApplicantsAsSpectator.length} / {event.object.eventSpectatorCapacity}
                    </Typography>
                </CardContent>
            </ButtonBase>

        </Card>
    )
}