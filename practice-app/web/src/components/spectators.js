import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {url} from "../App";
import {Avatar, CardContent, Card} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import EventRow from "./EventRow";
import TableContainer from "@material-ui/core/TableContainer";

const userExample = {
    nickname: "asd",
    avatar: "../../public/logo512.png"
}

export default function EventCreator(props){
    let {id} = props
    const [user, setUser] = useState(userExample)
    const [spectators, setS] = useState([])
    const [players, setP] = useState([])
    useEffect(_=>{
        getUser(id)
    })
    const getUser = id =>{
        fetch(url+"api/v1.0/events/"+id+"/spectators")
            .then(r=>r.json())
            .then(setS)
            .catch(e=>console.log(e))
        fetch(url+"api/v1.0/events/"+id+"/players")
            .then(r=>r.json())
            .then(setP)
            .catch(e=>console.log(e))

    }

    return(
        <React.Fragment>
            <Typography variant="body1" color={"textSecondary"}>
                Spectator IDs
            </Typography>
            {
                spectators.map(s=>(
                    <Typography variant="body2" color={"textSecondary"}>
                        {s}
                    </Typography>
                ))
            }
            <Typography variant="body1" color={"textSecondary"}>
                Player IDs
            </Typography>
            {
                players.map(s=>(
                    <Typography variant="body2" color={"textSecondary"}>
                        {s}
                    </Typography>
                ))
            }

        </React.Fragment>
    )
}
