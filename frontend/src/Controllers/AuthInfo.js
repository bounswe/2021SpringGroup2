const headers = {}

export const setHeaders = (accessToken, refreshToken) =>{
    headers.access = accessToken
    headers.refresh = refreshToken
    headers.accessTimeStamp = new Date().getTime()
}
export const setUserInfo = (username,user_id) => {
    headers.username = username
    headers.user_id = user_id
}
export const getUserInfoLoggedIn = ()=>{
    if(headers.username!==null) return ({username:headers.username,user_id:headers.user_id})
    return false
}
export const getUserInfo = async (username) =>{
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    return fetch("/api/users/"+username+"/",options)
        .then(response=>response.json())
        .then(r=>{
            console.log(r);
            setUserInfo(username, r.id);
            return r})
}
export const getToken = async _=>{
    if(headers.accessTimeStamp === null) return false
    if(new Date().getTime()-headers.accessTimeStamp < 1000*60*5) return headers.access
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({refresh:headers.refresh})
    }
    return fetch("/api/token/refresh/",options)
        .then(response=>response.json())
        .then(r=>{
            console.log(r);
            setHeaders(r.access, r.refresh)
            return r})
        .then(r=>r.access)
}
