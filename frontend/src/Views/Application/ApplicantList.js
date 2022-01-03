import * as React from "react";
import {Dialog, DialogContent, DialogTitle, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {useState} from "react";
import {AvatarGroup} from "@mui/lab";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";

export default function ApplicantList(props){
    const [detailsOpen,setDetailsOpen] = useState(false)
    return (
        <div>
            <AvatarGroup onClick={()=>setDetailsOpen(true)} max={5}>
                {props.users.map(user=>(
                    <Avatar src={user.avatar}/>
                ))}
            </AvatarGroup>
            <Dialog open={detailsOpen} onClose={()=>setDetailsOpen(false)}>
                <DialogTitle>
                    <Typography align={"center"}>
                        Players
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {props.users.map(user=>(
                                <ListItem>
                                    <ListItemAvatar>
                                        <Link to={"/users/"+user.username}>
                                            <Avatar src={user.avatar}/>
                                        </Link>
                                    </ListItemAvatar>
                                    <Link to={"/users/"+user.username} style={{color:'black', textDecoration: 'none'}}>
                                        <ListItemText
                                            primary={ <Typography style={{fontWeight:"500"}}>{user.username}</Typography>}/>
                                    </Link>
                                </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    )
}