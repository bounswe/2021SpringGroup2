export const getProfile = username =>{

    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }
    return fetch("api/users/"+username+"/",/*options*/)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

