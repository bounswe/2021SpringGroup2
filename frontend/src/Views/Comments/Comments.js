import {Box, Dialog, DialogTitle, ListItem, ListItemAvatar, ListItemText, Modal, Typography} from "@mui/material";
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
import {useRef} from "react";

export default function Comments(props){
    const typoStyle = {fontSize:13,display:"flex", flexDirection: "column", justifyContent: "center"}
    const [open, setOpen] = React.useState(false);
    const [newComment, setNewComment] = React.useState("");
    let textInput = useRef(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInput = event => {
        setNewComment(event.target.value);
    };
    const handlePostComment = () => {
        if(newComment.includes("@")){
            postAnswer();
        }
        else{
            postComment();
        }
    };
    const comments = [{avatar:"https://avatars.githubusercontent.com/u/52797716?v=4}",
        username:"bdoner", content:"It was nice playing with you.", isAnswer:false,
        creationDate: "2014-11-31T23:00:00-08:00",
        answers:[{avatar:"https://avatars.githubusercontent.com/u/36790615?v=4}",
            username:"dogukanakar", content:"Indeed", isAnswer:true,
            creationDate: "2014-11-31T23:00:00-08:00"},
            {avatar:"https://avatars.githubusercontent.com/u/56451575?v=4}",
                username:"sefika", content:":)", isAnswer:true}]},
            {avatar:"https://avatars.githubusercontent.com/u/36790615?v=4}",
                username:"dogukanakar", content:"Do you wanna play a rematch?", isAnswer:false,
                answers:[{avatar:"https://avatars.githubusercontent.com/u/52797716?v=4}",
                    username:"bdoner", content:"Sure!", isAnswer:true},
            ]}];
    return (
        <div>
            <Button onClick={handleOpen}>View Comments</Button>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Comments</DialogTitle>
                <DialogContent>
                    <List>
                        {comments.map(d=>
                            <React.Fragment>
                                <Comment content={d} newcomment={newComment} setReply={(e) => {setNewComment(e)}} ref={textInput}/>
                            </React.Fragment>
                        )}
                    </List>
                    <Grid container spacing={3}>
                        <Grid item sm={10}>
                            <TextField id="comment" fullWidth size="small" variant="outlined" placeholder="Add comment..."
                                  inputRef={textInput}   autoFocus style={{marginLeft:"3%",marginBottom:"3%"}}    value={newComment||""} onChange={handleInput}></TextField>
                        </Grid>
                        <Grid item sm={2}>
                            <Button onClick={handlePostComment}>Share</Button>
                        </Grid>
                    </Grid>
                </DialogContent>

            </Dialog>
        </div>
    );
}
