import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {url} from "../App";
import {Avatar} from "@material-ui/core";

const userExample = {
    nickname: "asd",
    avatar: "../../public/logo512.png"
}

export default function EventCreator(props){
    let {id} = props
    const [user, setUser] = useState(userExample)
    useEffect(_=>{
        getUser(id)
    })
    const getUser = id =>{
        fetch(url+"api/v1.0/users/"+id)
            .then(r=>r.json())
            .then(setUser)
            .catch(e=>console.log(e))
    }

    return(
        <React.Fragment>
            <Avatar src={user.avatar} style={{alignSelf:"center"}}/>
            <Typography variant="h4" color={"textSecondary"}>
                {user.nickname}
            </Typography>
        </React.Fragment>
    )
}
