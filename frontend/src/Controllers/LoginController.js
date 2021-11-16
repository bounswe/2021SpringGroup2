export function obtainToken(username_in, password_in){
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username:username_in,password:password_in})
    }
    return fetch("http://34.122.205.8/api/token/obtain/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}
export function refreshToken(refresh_token){
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({Refresh:refresh_token})
    }
    return fetch("http://34.122.205.8/api/token/refresh/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

export function postResetPassword(email){
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email})
    }
    return fetch("http://34.122.205.8/api/password/reset/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}
export function postResetPasswordConfirmation(newPassword,token){
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword, token: token})
    }
    return fetch("http://34.122.205.8/api/password/reset/confirm/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}
