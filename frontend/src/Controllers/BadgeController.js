import {getUserInfoLoggedIn} from "./AuthInfo";

export async function getBadgeDetails(badge_name) {
    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }
    let response
    try {
        response = await fetch("/api/badges/" + String(badge_name) + "/", options)
            .then(response => response.json())
            .then((result) => {
                    return {
                                name: badge_name,
                                icon: result.icon.content,
                                description: result.content
                            }
                }
            )
    } catch (err) {
        console.log(err);
    }

    return response
}

export async function getAllBadges() {
    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }
    let response
    try {
        response = await fetch("/api/badges/" , options)
            .then(response => response.json())
            .then((result) => {
                return result.items.map(element=>(
                        {
                            name: element.object.name,
                            icon: element.object.icon.content,
                            description: element.object.content
                        }
                )
                )})
    } catch (err) {
        console.log(err);
    }

    return response
}


export function getAllEventsAvailableForBadgeGift(target_user){
    let logged_user = getUserInfoLoggedIn()
    if(!logged_user){
        return null
    }
    const options = {
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            offerer:logged_user.username
        })
    }
    let response
    try {
        response = fetch("/api/users/"+String(target_user)+"/relatedEvents/",options)
            .then(response=>response.json())
            .then(result=>{
                    return result.items.map(element=>({
                        title:element.title,
                        sport:element.eventSport,
                        date:element.eventDate,
                        event_id:element.postId
                    }))
                }
            );
    } catch (err){
        console.log(err)
    }

    return response
}