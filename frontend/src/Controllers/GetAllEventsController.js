export const getEvent = _ =>{

    const options = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json'},
    }
    return fetch("http://34.68.66.109/api/posts/",options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}
