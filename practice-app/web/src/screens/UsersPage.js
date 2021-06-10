import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {url} from "../App";
import {Avatar, CardContent, Card} from "@material-ui/core";

const userExample = {
    nickname: "asd",
    avatar: "../../public/logo512.png"
}

export default function EventCreator(props){
    const [users, setUsers] = useState([userExample])
    useEffect(_=>{
        getUser()
    })
    const getUser = _ =>{
        fetch(url+"api/v1.0/users")
            .then(r=>r.json())
            .then(setUsers)
            .catch(e=>console.log(e))
    }

    return(
        <React.Fragment>
            {
                users.map(user=>(
                    <Card>
                        <Avatar src={user.avatar} style={{alignSelf:"center"}}/>
                        <Typography variant="body1" color={"textSecondary"}>
                            {user.nickname}
                        </Typography>
                    </Card>
                ))
            }
        </React.Fragment>
    )
}
