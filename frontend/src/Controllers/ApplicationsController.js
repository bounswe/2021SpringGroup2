import {getToken, getUserInfoLoggedIn} from "./AuthInfo";
import {getProfile} from "./ProfileController";
import * as ApplicationsController from "./ApplicationsController"
export async function getUserListInfo(list){
    let details = []
    for (const id of list) {
        await getProfile(id).then(res => {
            details.push({username: res.username, avatar: res.avatar, user_id: res.id})
        });
    }
    return details
}

export async function getApplicationsToAnEvent(post_id,playerApplications) {
    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }
    let response
    try {
        response =  fetch("/api/posts/" + String(post_id) + "/applicants/" +
            "?type=" + playerApplications, options)
            .then(response => response.json())
            .then(async (result) => {
                    return await ApplicationsController.getUserListInfo(result.applicants)
                }
            )
            .then(d=>{console.log(d);return d})
    } catch (err) {
        console.log(err);
    }
    return response
}

export async function applyToEvent(post_id, type) {
    let logged_user = getUserInfoLoggedIn()
    if(!logged_user.username){
        return null
    }
    let key;
    await getToken().then(d => {
        key = d
    })
    const options = {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'JWT ' + key},
        body: JSON.stringify({user:logged_user.user_id,type:type})
    }
    let response
    try {
        response = await fetch("/api/posts/" + String(post_id) + "/apply/", options)
            .then(response => {
                   return response.json()
                }
            )
    } catch (err) {
        console.log(err);
    }
    return response
}

export async function evaluateApplication(post_id, user_id, type, accept, owner_id) {
    let logged_user = getUserInfoLoggedIn()
    if(!logged_user.username || owner_id!==Number(logged_user.user_id)){
        return null
    }
    let key;
    await getToken().then(d => {
        key = d
    })
    const options = {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'JWT ' + key},
        body: JSON.stringify({user:user_id,type:type, owner:owner_id,accept:accept})
    }
    let response
    try {
        response = await fetch("/api/posts/" + String(post_id) + "/applicants/", options)
            .then(response => {
                    return response.json()
                }
            ).then(r=>{console.log(r);return r})
    } catch (err) {
        console.log(err);
    }
    return response
}

