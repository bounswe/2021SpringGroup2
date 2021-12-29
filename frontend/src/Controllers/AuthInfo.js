const headers = {}

export const setHeaders = (accessToken, refreshToken) =>{
    localStorage.setItem('access', accessToken)
    localStorage.setItem('refresh', refreshToken)
    localStorage.setItem('accessTimeStamp', '' + new Date().getTime())
}
export const setUserInfo = (username,user_id) => {
    localStorage.setItem('username', username)
    localStorage.setItem('user_id', user_id)
}
export const getUserInfoLoggedIn = ()=>{
    if(localStorage.getItem('username')!==null) return ({username:localStorage.getItem('username'),user_id:localStorage.getItem('user_id')})
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
    if(localStorage.getItem('accessTimeStamp') === null) return false
    if(new Date().getTime()-parseInt(localStorage.getItem('accessTimeStamp')) < 1000*60*5) return localStorage.getItem('access')
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
