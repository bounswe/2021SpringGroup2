import {
    Box,
    Dialog,
    DialogTitle,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    Stack,
    Typography
} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Comment from "./Comment";
import List from '@mui/material/List';
import {
    getAnswersOfComment,
    getCommentByID,
    getCommentsAndAnswersOfEvent, postAnswer, postComment
} from "../../Controllers/CommentAnswerController";
import Grid from "@mui/material/Grid";
import DialogContent from "@mui/material/DialogContent";
import {useEffect, useRef} from "react";

export default function Comments(props){
    const typoStyle = {fontSize:13,display:"flex", flexDirection: "column", justifyContent: "center"}
    const [open, setOpen] = React.useState(false);
    const [newComment, setNewComment] = React.useState("");
    const [comments, setComments] = React.useState([]);
    const [repliedComment, setRepliedComment] = React.useState(null);
    const [repliedUser, setRepliedUser] = React.useState(null);
    let textInput = useRef(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInput = event => {
        setNewComment(event.target.value);
    };
    const handlePostComment = () => {
        if (newComment.startsWith("@" + repliedUser + " ") && repliedComment !== null) {
            let answer;
            postAnswer(props.id, repliedComment, newComment.substring(repliedUser.length + 2),props.isEvent).then(
                d=>{answer=d}
            )
            let foundComment = false
            const handle_return = (d) => {
                if(d.comment_id === repliedComment && !foundComment){
                    foundComment = true
                    return {...d, answers: d.answers.concat(answer)}
                }
                else{
                    return d
                }
            }
            setTimeout(() => {
                setComments(comments.map(handle_return))
            }, 500);


        } else {
            let comment;
            postComment(props.id, newComment,props.isEvent).then(d=>
            {comment = d;}
        )
            setTimeout(() => {
                setComments(comments.concat(comment))
            }, 500)

        }
        setNewComment("")
        setRepliedUser(null)
        setRepliedComment(null)
    };
    useEffect(_=>{
        getCommentsAndAnswersOfEvent(props.id,props.isEvent).then(d=>{
            if(d!==undefined&&d!==null){
                setComments(d)
            }
        })
    }, [])
    return (
        <div>
            <Button variant={"contained"} onClick={handleOpen}>View Comments</Button>
            <Dialog open={open} onClose={handleClose}   disableScrollLock={ true } fullWidth>
                <DialogContent>
                    {comments.length>0?
                        <List>
                            {comments.map(d=>
                                    <Comment content={d} newcomment={newComment}
                                             comment_id={d.comment_id}
                                             setReply={(e) => {setNewComment(e)}}
                                             selectComment={setRepliedComment}
                                             selectUser={setRepliedUser} ref={textInput}
                                             isEvent={props.isEvent} id={props.id}/>
                            )}
                        </List>
                        :
                        <div style={{textAlign:"center",marginBottom:"5%",marginTop:"5%"}}>
                            <Typography>There are no comments yet. Be the first one to comment!</Typography>
                        </div>
                    }
                    <Stack>
                        {repliedComment!==null&&newComment.startsWith("@"+repliedUser+" ")?
                            <Typography style={{marginLeft:"3%",fontSize:11}} >replying to {repliedUser}</Typography>
                            :null}
                        <Grid container spacing={3} >
                            <Grid item sm={10}>
                                <TextField id="comment" fullWidth size="small" variant="outlined" placeholder="Add comment..."
                                           inputRef={textInput} style={{marginLeft:"3%",marginBottom:"3%"}}    value={newComment||""} onChange={handleInput}></TextField>
                            </Grid>
                            <Grid item sm={2}>
                                <Button onClick={handlePostComment}>Share</Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </DialogContent>

            </Dialog>
        </div>
    );
}
