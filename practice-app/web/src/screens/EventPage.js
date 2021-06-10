import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {url} from "../App";
import EventCreator from "../components/EventCreator";

const eventexample = {
    "covid_risk_status": false,
    "current_cases": 5287980,
    "event": {
        "content": "Deneme event",
        "creationDate": "2021-06-07 00:00:00",
        "eventAgeGroup": "None",
        "eventDate": "2021-06-17",
        "eventHours": "01:30:00",
        "eventLatitude": "41.00744154814176",
        "eventLongitude": "28.978475262044675",
        "eventPlayerCapacity": "12",
        "eventPlayers": [],
        "eventSkillLevel": "Beginner",
        "eventSpectatorCapacity": 5,
        "eventSpectators": [],
        "eventSport": "football",
        "location": "Etiler",
        "ownerID": "1",
        "postID": "1",
        "title": "Deneme"
    }
}

export default function Event(props){
    let {id} = useParams()
    const [event, setEvent] = useState(eventexample)
    useEffect(_=>{
        getEvent(id)
    })
    const getEvent = id =>{
        fetch(url+"api/v1.0/events/"+id)
            .then(r=>r.json())
            .then(setEvent)
            .catch(e=>console.log(e))
    }

    return(
        <React.Fragment>
            <Container maxWidth={"md"} style={{textAlign:"center"}}>
                <Typography variant="h2" component="h2" align={"center"}>
                    {event.event.title}
                </Typography>
                <Typography variant="body2"  component="h2" color={"textSecondary"}>
                    {event.event.eventDate} {event.event.eventHours}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                    {event.event.content}
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                    Sport: {event.event.eventSport}
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                    High Covid Risk Area: {event.covid_risk_status}
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                    Location: {event.event.location}
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                    Event Age Group: {event.event.eventAgeGroup}
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                    Skill level: {event.event.eventSkillLevel}
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                    Players: {event.event.eventPlayers.length}/{event.event.eventPlayerCapacity}
                </Typography>
                <Typography variant="body2" color={"textSecondary"}>
                    Spectators: {event.event.eventSpectators.length}/{event.event.eventSpectatorCapacity}
                </Typography>
                <Typography variant="h4" color={"textSecondary"}>
                    Event Creator
                </Typography>
                <EventCreator id={event.event.ownerID}/>


            </Container>
        </React.Fragment>
    )
}
