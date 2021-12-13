import {ListItem, ListItemAvatar, ListItemText, Stack, Typography} from "@mui/material";
import * as React from "react";
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useEffect} from "react";
import {getCommentsAndAnswersOfEvent} from "../../Controllers/CommentAnswerController";

export function formatDate(dateString){
    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let date = new Date(Date.parse(dateString))
    let month = months[date.getMonth()]
    let day = date.getDate()
    let year = date.getFullYear()
    let hours = date.getHours() < 10 ? "0" + String(date.getHours()) : date.getHours()
    let minutes = date.getMinutes() < 10 ? "0" + String(date.getMinutes()) : date.getMinutes()
    let dateFormatted = month + " " + String(day) + " " + String(year) + ", " + String(hours) + ":" + String(minutes)
    return dateFormatted
}
const Comment = React.forwardRef((props,ref) => {
    const object = props.content
    const handleReply = () => {
        if (!props.newcomment.includes("@")) {
            props.setReply("@" + object.user.username + " " + props.newcomment)
            props.selectComment(object.comment_id)
            props.selectUser(object.user.username)
        }
        setTimeout(() => {
            ref.current.focus();
        }, 200);
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
                                  primary={<Typography style={{fontWeight:"550"}}>{object.user.username}</Typography>}
                                  secondary={<Typography style={contentStyle}>{object.content}</Typography>}/>
                    <Stack direction="row" spacing={1}>
                        {object.creationDate ?
                            <Typography style={infoStyle}>
                                {(!object.isAnswer ? "commented at " : "answered at ") +
                                formatDate(object.creationDate)}</Typography>
                            : null
                        }
                        {object.isAnswer?null:
                            <button style={{
                                background: "none", border: "none", marginBottom: "2px", padding: 0,
                                cursor: "pointer", color: "#677079", fontWeight: "bold"
                            }}
                                    onClick={handleReply}>reply
                            </button>
                        }
                    </Stack>
                </Stack>
            </ListItem>
            {object.answers !== null && object.answers !== undefined && object.answers !== []
                ? object.answers.map(d =>
                    <Comment content={d} newcomment={props.newcomment}
                             setReply={props.setReply} ref={ref}
                             selectUser={props.selectUser}/>
                )
                : null
            }
        </React.Fragment>
    );
})
export default Comment;

