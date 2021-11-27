const GetProfile = username =>{

    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }
    return fetch("http://34.122.205.8/api/users/"+username,options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

export default  GetProfile