import React, {useEffect, useState} from 'react'
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {useNavigate} from "react-router-dom";
import ButtonBase from "@mui/material/ButtonBase";
import Skeleton from "@mui/material/Skeleton";
import {getEquipment} from "../../../Controllers/SearchController";
import Avatar from "@mui/material/Avatar";


export default function UserCard(props){
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(_=>{
        getEquipment(props.id)
            .then(e=>setUser(e))
            .then(_=>setLoading(false))
    }, [])
    return loading?(
        <Card sx={{ minWidth: 275,  marginTop: 15}}>
            <CardContent>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
            </CardContent>
        </Card>
    ):(
        <Card sx={{ maxWidth: 345 }}>
            <ButtonBase
                style={{
                    display: 'block',
                    textAlign: 'initial',
                    width: "100%"
                }}
                onClick={_=>navigate("/profile/"+user.username)}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                            {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={user.first_name +" " + user.last_name}
                    subheader={"@"+ user.username}
                />
            </ButtonBase>
        </Card>
    )
}