const headers = {}

export const setHeaders = (accessToken, refreshToken) =>{
    headers.access = accessToken
    headers.refresh = refreshToken
    headers.accessTimeStamp = new Date().getTime()
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
        .then(r=>{console.log(r); return r})
        .then(r=>r.access)
}