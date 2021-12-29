import {getUserInfoLoggedIn} from "./AuthInfo";

/*export async function getApplicationsToAnEvent(post_id,playerApplications) {
    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }
    let response
    try {
        response = await fetch("/api/posts/" + String(post_id) + "/applicants" +
            "&type=" + playerApplications?"player":"spectator" + "/", options)
            .then(response => response.json())
            .then((result) => {
                    return result.applicants.map(d =>
                            ({
                                user: {username: d.actor.name}, content: d.object.answer,
                                creationDate: d.object.creationDate, isAnswer: true
                            }))
                }
            )
    } catch (err) {
        console.log(err);
    }
    return response
}*/
export async function applyToEvent(post_id, type) {
    let logged_user = getUserInfoLoggedIn()
    if(!logged_user){
        return null
    }
    const options = {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify({user:logged_user.user_id,type:type})
    }
    let response
    try {
        response = await fetch("/api/posts/" + String(post_id) + "/apply", options)
            .then(response => {
                   return response.json()
                }
            )
    } catch (err) {
        console.log(err);
    }
    return response
}

