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
                ({user:{username:d.actor.name},content:d.object.answer,creationDate:d.object.creationDate}))
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
    fetch("http://localhost:3000/comment/",options)
        .then(response=>response.json())
        .then((result)=>
        {
            comment.user = {username:result.actor.name};
            comment.content = result.object.content;
            comment.creationDate = result.object.creationDate;
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
    fetch("http://localhost:3000/comments/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r);return r;})
        .then(response=>response.items.forEach(d=>
            comments.push(getCommentByID(d.object.split("/")[3],d.object.split("/")[5]))
        ))
    return comments
}
export function postComment(post_id,owner_id,username,content){

    const options = {
        method: 'POST',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
        body: {
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
                "creationDate": Date.now()
            }
        }
    }
    //fetch("/api/posts/"+String(post_id)+"/comments",options)
    let comment = {}
    fetch("http://localhost:3000/comments/",options)
        .then(response=>response.json())
        .then(d=> {
            comment = {user:{username:d.actor.name},
            content:d.object.content,
            creationDate:d.object.creationDate,
            answers:[]};
            })
    return comment
}
export function postAnswer(post_id,comment_id,owner_id,username,content){

    const options = {
        method: 'POST',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
        body: {
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
                "creationDate": Date.now()
            }
        }
    }
    //fetch("/api/posts/"+String(post_id)+"/comments/"+String(comment_id)/answers,options)
    let answer = {}
    fetch("http://localhost:3000/comments/",options)
        .then(response=>response.json())
        .then(d=> {answer= {user:{username:d.actor.name},
            content:d.object.content,
            creationDate:d.object.creationDate,
            };
        })
    return answer
}