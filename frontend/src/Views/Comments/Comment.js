import {ListItem, ListItemAvatar, ListItemText, Stack, Typography} from "@mui/material";
import * as React from "react";
import Avatar from '@mui/material/Avatar';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
export default function Comment(props){
    const [open, setOpen] = React.useState(true);
    const object = props.content
    const handleClick = () => {
        setOpen(!open);
    };
    const handleReply = () => {
        if (!props.newcomment.includes("@")) {
            props.setReply("@" + object.username + " " + props.newcomment)
        }
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
                    <ListItemText style={{paddingTop: 0, paddingBottom: 0}} primary={object.username}
                                  secondary={<Typography style={contentStyle}>{object.content}</Typography>}/>
                    <Stack direction="row" spacing={1}>
                        {object.creationDate ?
                            <Typography style={infoStyle}>
                                {(!object.isAnswer ? "commented at " : "answered at ") +
                                object.creationDate}</Typography>
                            : null
                        }
                        <button style={{
                            background: "none", border: "none", marginBottom: "2px", padding: 0,
                            cursor: "pointer", color: "#525960", fontWeight: "bold"
                        }}
                                onClick={handleReply}>reply
                        </button>
                    </Stack>
                </Stack>
            </ListItem>
            {object.answers !== null && object.answers !== undefined && object.answers !== []
                ? object.answers.map(d =>
                    <Comment content={d} newcomment={props.newcomment} setReply={props.setReply}/>
                )
                : null
            }
        </React.Fragment>
    );
}
