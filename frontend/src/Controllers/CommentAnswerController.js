import * as CommentAnswerController from "./CommentAnswerController"
import {getUserInfoLoggedIn} from "./AuthInfo";

export async function getAnswersOfComment(post_id,comment_id){
    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }
    let response
    try{
        response = await fetch("/api/posts/"+String(post_id)+"/comments/"+String(comment_id)+"/",options)
            .then(response=>response.json())
            .then((result)=> {
                return result.items?result.items.map(d=>
                        ({user:{username:d.actor.name},content:d.object.answer,
                            creationDate:d.object.creationDate, isAnswer:true}))
                    :[]}
            )
    } catch (err) {
        console.log(err);
    }

    return response


}

export async function getCommentByID(post_id, comment_id) {

    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }

    let comment = {}
    try{
        await fetch("/api/posts/"+String(post_id)+"/comments/"+String(comment_id)+"/",options)
            .then(response => response.json())
            .then((result) => {
                    comment.user = {username: result.actor.name};
                    comment.content = result.object.content;
                    comment.creationDate = result.object.creationDate;
                    comment.isAnswer = false;
                    comment.comment_id = comment_id;
                }
            )
    } catch (err) {
        console.log(err);
    }

    CommentAnswerController.getAnswersOfComment(post_id, comment_id).then(answerList =>
        comment.answers = answerList
    )
    console.log(comment)
    return comment
}

export async function getCommentsAndAnswersOfEvent(post_id){

    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }
    let comments = []
    try{
        await fetch("/api/posts/"+String(post_id)+"/comments/",options)
            .then(response=>response.json())
            .then(r=>{console.log(r);return r;})
            .then(response=>response.items.forEach(d=>
                comments.push(CommentAnswerController.getCommentByID(Number(d.object.split("/")[3]),Number(d.object.split("/")[5])))
            ))
    } catch(err){
        console.log(err)
    }
    return comments
}
export function postComment(post_id,content){
    let username = getUserInfoLoggedIn().username
    let owner_id = getUserInfoLoggedIn().user_id
    const date = new Date().toISOString()
    const options = {
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": username + " created a comment",
            "type": "Create",
            "actor": {
                "type": "Person",
                "name": username
            },
            "object": {
                "type": "Comment",
                "postId": post_id,
                "ownerId": owner_id,
                "content": content,
                "creationDate": date
            }
        })
    }
    let comment = {}
    comment.user={username:username};
    comment.content=content;
    comment.creationDate=date;
    comment.isAnswer=false;
    comment.answers=[];
    fetch("/api/posts/"+String(post_id)+"/comments/",options)
        .then(response=>response.json())
        .then(d=> {
            });
    console.log("comment",comment)
    return comment
}
export function postAnswer(post_id,comment_id,content){
    let username = getUserInfoLoggedIn().username
    let owner_id = getUserInfoLoggedIn().user_id
    const date = new Date().toISOString()
    const options = {
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": username + " created an answer.",
            "type": "Create",
            "actor": {
                "type": "Person",
                "name": username
            },
            "object": {
                "type": "Answer",
                "answer": content,
                "creationDate":  date
            }
        })
    }
    console.log(JSON.stringify(options.body))
    let answer = {}
    answer.user={username:username};
    answer.content=content;
    answer.creationDate=date;
    answer.isAnswer=true;
    fetch("/api/posts/"+String(post_id)+"/comments/"+String(comment_id)+"/answers/",options)
        .then(response=>response.json())
        .then(d=> {

        });
    console.log("answer",answer)
    return answer
}