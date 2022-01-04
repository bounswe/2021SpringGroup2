

export function getSports(){
    const indices = [8,15,23,19,39,26,27,21,60,5,3,24]
    return fetch("https://sports.api.decathlon.com/sports?parents_only=True",{headers: {'Accept-Language': 'en-US'}})
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
        .then(r=>{return indices.map(i => r.data[i]);})
        .then(r=>r.map(d=>({img:d.relationships.images.data[0].url, title:d.attributes.name, desc:d.attributes.description})))
}
export function getSportsList(){
    return fetch("https://sports.api.decathlon.com/sports?parents_only=true&has_hecathlon_id=true",
        {headers: {'Accept-Language': 'en-US'}})
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
        .then(r=>r.data.map(d=>({img:d.relationships.images.data[0].url, label:d.attributes.name})))
}

