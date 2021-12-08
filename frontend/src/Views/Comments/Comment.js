import {ListItem, ListItemAvatar, ListItemText, Stack, Typography} from "@mui/material";
import * as React from "react";
import Avatar from '@mui/material/Avatar';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
const Comment = React.forwardRef((props,ref) => {
    const [open, setOpen] = React.useState(true);
    const object = props.content
    const handleClick = () => {
        setOpen(!open);
    };
    const handleReply = () => {
        if (!props.newcomment.includes("@")) {
            props.setReply("@" + object.username + " " + props.newcomment)
        }
        setTimeout(() => {
            ref.current.focus();
        }, 200);
    }
    const formatDate = (dateString) => {
        const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let date = new Date(Date.parse(dateString))
        let month = months[date.getMonth()]
        let day = date.getDay()
        let year = date.getFullYear()
        let hours = date.getHours() < 10 ? "0" + String(date.getHours()) : date.getHours()
        let minutes = date.getMinutes() < 10 ? "0" + String(date.getMinutes()) : date.getMinutes()
        let dateFormatted = month + " " + String(day) + " " + String(year) + ", " + String(hours) + ":" + String(minutes)
        return dateFormatted
    }
    const contentStyle = {fontSize: 14, display: "inline"}
    const infoStyle = {fontSize: 12, display: "inline", color: "#677079"}

    const listStyle = {
        paddingBottom: 0,
        paddingTop: object.isAnswer ? 0 : "1%",
        paddingLeft: object.isAnswer ? "10%" : "3%"
    }
    return (
        <React.Fragment>
            <ListItem alignItems="flex-start" style={listStyle}>
                <ListItemAvatar>
                        <Avatar src={object.avatar}/>

                </ListItemAvatar>
                <Stack direction="column">
                    <ListItemText style={{paddingTop: 0, paddingBottom: 0}}
                                  primary={<Typography style={{fontWeight:"550"}}>{object.username}</Typography>}
                                  secondary={<Typography style={contentStyle}>{object.content}</Typography>}/>
                    <Stack direction="row" spacing={1}>
                        {object.creationDate ?
                            <Typography style={infoStyle}>
                                {(!object.isAnswer ? "commented at " : "answered at ") +
                                formatDate(object.creationDate)}</Typography>
                            : null
                        }
                        <button style={{
                            background: "none", border: "none", marginBottom: "2px", padding: 0,
                            cursor: "pointer", color: "#677079", fontWeight: "bold"
                        }}
                                onClick={handleReply}>reply
                        </button>
                    </Stack>
                </Stack>
            </ListItem>
            {object.answers !== null && object.answers !== undefined && object.answers !== []
                ? object.answers.map(d =>
                    <Comment content={d} newcomment={props.newcomment} setReply={props.setReply} ref={ref}/>
                )
                : null
            }
        </React.Fragment>
    );
})
export default Comment;

