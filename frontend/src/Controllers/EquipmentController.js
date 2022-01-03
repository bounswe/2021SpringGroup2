import {getToken, getUserInfoLoggedIn} from "./AuthInfo";

export async function postEquipment(params) {
    let key;
    await getToken().then(d => {
        key = d
    })
    let logged_user = getUserInfoLoggedIn()
    if(logged_user.username===undefined||logged_user.username===null){
        return
    }
    const options = {
        headers: {'Content-Type': 'application/json', 'Authorization': 'JWT ' + key},
        method: 'POST',
        body: JSON.stringify({
            owner: logged_user.user_id,
            content: params.content ? params.content : "",
            title: params.title,
            location: params.location ? params.location : "",
            sport: params.sport,
            latitude: params.latitude ? params.latitude : null,
            longitude: params.longitude ? params.longitude : null,
            equipment_type: params.equipment,
            url: params.url ? params.url : ""
        })
    }
    return fetch("/api/equipments/", options)
        .then(response => response.json())
        .then(r => {
            console.log(r);
            return r
        })
}