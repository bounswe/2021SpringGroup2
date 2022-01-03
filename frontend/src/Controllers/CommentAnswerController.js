import * as CommentAnswerController from "./CommentAnswerController"
import {getToken, getUserInfoLoggedIn} from "./AuthInfo";

export async function getAnswersOfComment(post_id,comment_id,isEvent){
    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }
    let response
    try{
        response = await fetch("/api/"+ isEvent + "/" +String(post_id)+"/comments/"+String(comment_id)+"/answers/",options)
            .then(response=>response.json())
            .then((result)=> {
                return result.items?result.items.map(d=>
                        ({user:{username:d.actor.name},content:d.object.content,
                            creationDate:d.object.creationDate, isAnswer:true}))
                    :[]}
            )
    } catch (err) {
        console.log(err);
    }

    return response


}

export async function getCommentByID(post_id, comment_id, isEvent) {

    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }

    let comment = {}
    try{
        await fetch("/api/"+ isEvent + "/" + String(post_id)+"/comments/"+String(comment_id)+"/",options)
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

    CommentAnswerController.getAnswersOfComment(post_id, comment_id, isEvent).then(answerList =>
        comment.answers = answerList
    )
    return comment
}

export async function getCommentsAndAnswersOfEvent(post_id, isEvent){

    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }
    let comments = []
    try{
        await fetch("/api/"+ isEvent + "/"  +String(post_id)+"/comments/",options)
            .then(response=>response.json())
            .then(response=>{console.log(response);return response})
            .then(response=> response.items.forEach(async d=>
                comments.push(await CommentAnswerController.getCommentByID(post_id,d.object.id,isEvent))
            ))
    } catch(err){
        console.log(err)
    }
    return comments
}
export async function postComment(post_id, content, isEvent) {
    let username = getUserInfoLoggedIn().username
    let owner_id = getUserInfoLoggedIn().user_id
    if (username === undefined || username === null) {
        return null
    }
    let key;
    await getToken().then(d => {
        key = d
    })
    const date = new Date().toISOString()
    const options = {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'JWT ' + key},
        method: 'POST',
        body: JSON.stringify({
                "name": username,
                "postId": post_id,
                "ownerId": owner_id,
                "content": content,
                "creationDate": date
            }
        )
    }
    let comment = {}
    comment.user = {username: username};
    comment.content = content;
    comment.creationDate = date;
    comment.isAnswer = false;
    comment.answers = [];
    fetch("/api/" + isEvent + "/" + String(post_id) + "/comments/", options)
        .then(response => response.json())
        .then(d => {
            comment.comment_id = d.object.id
        });
    return comment
}
export async function postAnswer(post_id, comment_id, content, isEvent) {
    let username = getUserInfoLoggedIn().username
    let owner_id = getUserInfoLoggedIn().user_id
    if (username === undefined || username === null) {
        return null
    }
    let key;
    await getToken().then(d => {
        key = d
    })
    const date = new Date().toISOString()
    const options = {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'JWT ' + key},
        method: 'POST',
        body: JSON.stringify({
            "commentId": comment_id,
            "postId": post_id,
            "ownerId": owner_id,
            "content": content,
            "creationDate": date
        })
    }
    let answer = {}
    answer.user = {username: username};
    answer.content = content;
    answer.creationDate = date;
    answer.isAnswer = true;
    fetch("/api/" + isEvent + "/" + String(post_id) + "/comments/" + String(comment_id) + "/answers/", options)
        .then(response => response.json())
        .then(d => {

        });
    return answer
}