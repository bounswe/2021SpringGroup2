export function getAnswersOfComment(post_id,comment_id){
    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }

    //let response = fetch("/api/posts/"+String(post_id)+"/comments/"+String(comment_id),options)
    let response = fetch("http://localhost:3000/answers/",options)
        .then(response=>response.json())
        .then((result)=> {
            return result.items?result.items.map(d=>
                ({user:{username:d.actor.name},content:d.object.answer,
                    creationDate:d.object.creationDate, isAnswer:true}))
            :[]}
        )
    return response


}

export function getCommentByID(post_id,comment_id){

    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }

    let comment = {}
    //let response = fetch("/api/posts/"+String(post_id)+"/comments/"+String(comment_id),options)
    fetch("http://localhost:3000/comments/"+comment_id,options)
        .then(response=>response.json())
        .then((result)=>
        {
            comment.user = {username:result.actor.name};
            comment.content = result.object.content;
            comment.creationDate = result.object.creationDate;
            comment.isAnswer = false;
            comment.comment_id = comment_id;
        }
    )
    getAnswersOfComment(post_id,comment_id).then(answerList=>
        comment.answers=answerList
    )
    console.log(comment)
    return comment
}

export function getCommentsAndAnswersOfEvent(post_id){

    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }
    //let response = fetch("/api/posts/"+String(post_id)+"/comments",options)
    let comments = []
    fetch("http://localhost:3000/commentsList/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r);return r;})
        .then(response=>response.items.forEach(d=>
            comments.push(getCommentByID(d.object.split("/")[3],d.object.split("/")[5]))
        ))
    return comments
}
export function postComment(post_id,owner_id,username,content){
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
    //fetch("/api/posts/"+String(post_id)+"/comments",options)
    let comment = {}
    fetch("http://localhost:3000/comments/",options)
        .then(response=>response.json())
        .then(d=> {
            comment.user={username:username};
            comment.content=content;
            comment.creationDate=date;
            comment.isAnswer=false;
            comment.answers=[];
            });
    console.log("comment",comment)
    return comment
}
export function postAnswer(post_id,comment_id,owner_id,username,content){
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
    //fetch("/api/posts/"+String(post_id)+"/comments/"+String(comment_id)/answers,options)
    let answer = {}
    fetch("http://localhost:3000/comments/",options)
        .then(response=>response.json())
        .then(d=> {
            answer.user={username:username};
            answer.content=content;
            answer.creationDate=date;
            answer.isAnswer=true;}
        );
    console.log("answer",answer)
    return answer
}