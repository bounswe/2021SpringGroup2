import {getToken, getUserInfoLoggedIn} from "./AuthInfo";

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

export async function getAllBadgesOfAUser(username) {
    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }
    let response
    try {
        response = await fetch("/api/users/"+String(username)+"/" , options)
            .then(response => response.json())
            .then((result) => {
                return result.badges.map(element=>(
                        getBadgeDetails(element)
                    )
                )})
    } catch (err) {
        console.log(err);
    }

    return response
}


export async function getAllEventsAvailableForBadgeGift(target_user) {
    let logged_user = getUserInfoLoggedIn()
    if (!logged_user) {
        return null
    }
    let key;
    await getToken().then(d => {
        key = d
    })
    const options = {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'JWT ' + key},
        method: 'POST',
        body: JSON.stringify({
            offerer: logged_user.username
        })
    }
    let response
    try {
        response = fetch("/api/users/" + String(target_user) + "/relatedEvents/", options)
            .then(response => response.json())
            .then(result => {
                    return result.items.map(element => ({
                        title: element.title,
                        sport: element.eventSport,
                        date: element.eventDate,
                        event_id: element.postId
                    }))
                }
            );
    } catch (err) {
        console.log(err)
    }

    return response
}

export async function giveBadgeToUser(target_user, badge_name, event_id) {
    let logged_user = getUserInfoLoggedIn()
    if (!logged_user) {
        return null
    }
    let key;
    await getToken().then(d => {
        key = d
    })
    const options = {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'JWT ' + key},
        method: 'POST',
        body: JSON.stringify({
            offerer: logged_user.username,
            event_id: event_id,
            badge_name: badge_name
        })
    }
    let response
    try {
        response = fetch("/api/users/" + String(target_user) + "/badges/", options)
            .then(response => response.json())
            .then(result => {
                return result
            });
    } catch (err) {
        console.log(err)
    }

    return response
}
