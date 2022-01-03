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

export default function ApplicantSelection(props){
    const [detailsOpen,setDetailsOpen] = useState(false)
    return (
        <div>
            <Button onClick={()=>setDetailsOpen(true)}>
                View Player Applications
            </Button>
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
                                    <Link to={"/users/"+user.username}>
                                        <Avatar src={user.avatar}/>
                                    </Link>
                                </ListItemAvatar>
                                <Link to={"/users/"+user.username} style={{color:'black', textDecoration: 'none'}}>
                                    <ListItemText
                                        primary={ <Typography style={{fontWeight:"500"}}>{user.username}</Typography>}/>
                                </Link>
                                <Box style={{display:"flex",justifyContent:"flex-end"}}>
                                    <Stack direction={"row"}>
                                        <IconButton>
                                            <CheckIcon style={{fill:"green"}}/>
                                        </IconButton>
                                        <IconButton>
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