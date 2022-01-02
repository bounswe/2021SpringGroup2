import {getToken, getUserInfoLoggedIn} from "./AuthInfo";

export async function postEvent(params) {
    let key;
    await getToken().then(d => {
        key = d
    })
    const options = {
        headers: {'Content-Type': 'application/json', 'Authorization': 'JWT ' + key},
        method: 'POST',
        body: JSON.stringify({
            owner: getUserInfoLoggedIn().user_id,
            content: params.content ? params.content : "",
            title: params.title,
            location: params.location,
            date: params.date,
            duration: params.duration,
            sport: params.sport,
            min_age: params.min_age ? params.min_age : 18,
            max_age: params.max_age ? params.max_age : 80,
            player_capacity: params.player_capacity ? params.player_capacity : 2,
            spec_capacity: params.spec_capacity ? params.spec_capacity : 0,
            min_skill_level: params.min_skill_level ? params.min_skill_level : 0,
            max_skill_level: params.max_skill_level ? params.max_skill_level : 0,
            latitude: params.latitude,
            longitude: params.longitude
        })
    }
    console.log(options)
    return fetch("/api/posts/", options)
        .then(response => response.json())
        .then(r => {
            console.log(r);
            return r
        })
}