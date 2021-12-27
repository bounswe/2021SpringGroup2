import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {url} from "../App";
import EventCreator from "../components/EventCreator";
import Comment from "../components/Comment";

const eventexample = {
    "equipment": {
        "content": "I have a pair of shoes in good condition that i want to sell.",
        "equipment type": "Shoes",
        "equipmentId": 2,
        "link": "letgo.com/245323",
        "ownerId": 1,
        "title": "Tennis rackets for sale!",
        "website name": "letgo",
        "location": "Ankara"
    }

}

export default function Event(props){
    let {id} = useParams()
    const [equipment, setEq] = useState(eventexample)
    useEffect(_=>{
        getEvent(id)
    })
    const getEvent = id =>{
        fetch(url+"api/v1.0/equipments/"+id)
            .then(r=>r.json())
            .then(setEq)
            .catch(e=>console.log(e))
    }

    return(
        <React.Fragment>
            <Container maxWidth={"md"} style={{textAlign:"center"}}>
                <Typography variant="h2" component="h2" align={"center"}>
                    {equipment.equipment.title}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                    {equipment.equipment.content}
                </Typography>
                <br/>
                <Typography variant="subtitle1">
                    {equipment.equipment["equipment type"]}
                </Typography>

            </Container>
        </React.Fragment>
    )
}
