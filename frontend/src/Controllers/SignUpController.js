

const SignUpFunction = values =>{

    const options = {
        method: 'POST',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify(values)
    }
    return fetch("http://34.68.66.109/api/user/create/",options)
        .then(response=>response.json())
            .then(r=>{
                if(Array.isArray(r.username))
                    throw new Error('Something went wrong');
                    console.log(r);
                    return r
            })

}

export default  SignUpFunction