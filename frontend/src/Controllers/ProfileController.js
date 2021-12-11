export const getProfile = username =>{

    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM5MjYwNTc2LCJpYXQiOjE2MzkyNjAyNzYsImp0aSI6Ijc2ZWQ4MTIxYWE5MzRiMDY5OWRlM2ExZTk3M2VlMDU0IiwidXNlcm5hbWUiOiJkb2d1a2FuYWthciJ9.AB2Vbh3Jei9b3wJoC1ATQrqzb5hE0tP9RMaXND670s4'
        },
    }
    return fetch("http://34.68.66.109/api/users/"+username,options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

