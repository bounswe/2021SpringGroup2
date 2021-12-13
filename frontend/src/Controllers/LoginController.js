export function obtainToken(username_in, password_in){
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username:username_in,password:password_in})
    }
    return fetch("/api/token/obtain/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}
export function refreshToken(refresh_token){
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({refresh:refresh_token})
    }
    return fetch("/api/token/refresh/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

export function postResetPassword(email){
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email})
    }
    return fetch("/api/password/reset/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}
export function postResetPasswordConfirmation(newPassword,token){
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword, token: token})
    }
    return fetch("/api/password/reset/confirm/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}
