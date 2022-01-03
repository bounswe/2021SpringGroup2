import {Button, DialogTitle, List,ListItem,Grid} from "@mui/material";
import * as React from "react";
import BadgeSelection from "./BadgeSelection"
import {useState} from "react";
import Typography from "@mui/material/Typography";
import {Dialog, DialogContent} from "@material-ui/core";
import {formatDate} from "../Comments/Comment"
import Box from "@mui/material/Box";
export default function RelatedEvents(props) {
    const [listOpen,setListOpen] = useState(false)
    const handleClickOpen = () => {
        setListOpen(true);
    };

    const handleClose = () => {
        setListOpen(false);
    };
    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>Give a badge</Button>
            <Dialog open={listOpen} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>
                    <Typography align={"center"}>
                        Select an event to give a badge to the user
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <List spacing={2}>
                        {props.events.map(event=>(
                            <ListItem>
                                    <Grid container direction={"row"} sx={{border:2,borderRadius:2,padding:1,alignItems:"center"}}>
                                        <Grid item md={4}>
                                            <Typography>{event.title}</Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography>{event.sport}</Typography>
                                        </Grid>
                                        <Grid item md={4}>
                                            <Typography>{formatDate(event.date)}</Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <BadgeSelection badges={props.badges} event_id={event.event_id} target={props.target}/>
                                        </Grid>
                                    </Grid>
                            </ListItem>
                            )
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    )
}