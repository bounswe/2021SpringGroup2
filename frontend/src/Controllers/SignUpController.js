

const SignUpFunction = values =>{

    const options = {
        method: 'POST',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify(values)
    }
    return fetch("/api/user/create/",options)
        .then(response=>response.json())
            .then(r=>{console.log(r); return r})
}

export default  SignUpFunction