import * as React from "react";
import {Dialog, DialogContent, DialogTitle, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {useState} from "react";
import {AvatarGroup} from "@mui/lab";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {evaluateApplication} from "../../Controllers/ApplicationsController";

export default function ApplicantSelection(props){
    const [detailsOpen,setDetailsOpen] = useState(false)
    const handleEvaluation = (user,accept)=> {
        evaluateApplication(props.event_id, user.user_id, props.type, accept, Number(props.owner_id)).then(
            r => {console.log(r)})
    }
    return (
        <div>
            {props.show?
                <Button variant={"text"} onClick={()=>setDetailsOpen(true)}>
                    View Applications
                </Button>
                :null
            }
            <Dialog open={detailsOpen} onClose={()=>setDetailsOpen(false)}>
                <DialogTitle>
                    <Typography align={"center"}>
                        Applicants
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {props.users.map(user=>(
                            <ListItem>
                                <ListItemAvatar>
                                    <Link to={"/profile/"+user.username}>
                                        <Avatar src={user.avatar}/>
                                    </Link>
                                </ListItemAvatar>
                                <Link to={"/profile/"+user.username} style={{color:'black', textDecoration: 'none'}}>
                                    <ListItemText
                                        primary={ <Typography style={{fontWeight:"500"}}>{user.username}</Typography>}/>
                                </Link>
                                <Box style={{display:"flex",justifyContent:"flex-end"}}>
                                    <Stack direction={"row"}>
                                        <IconButton onClick={()=>{handleEvaluation(user,true)}}>
                                            <CheckIcon style={{fill:"green"}}/>
                                        </IconButton>
                                        <IconButton onClick={()=>{handleEvaluation(user,false)}}>
                                            <CloseIcon style={{fill:"red"}}/>
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    )
}