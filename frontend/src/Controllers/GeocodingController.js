
export async function getLocationMatches(query){
    return await fetch("https://nominatim.openstreetmap.org/search?q="+query+"&limit=5&format=json")
        .then(response=>response.json())
        .then(r=>r.map(d=>({lat:d.lat,lng:d.lon,name:d.display_name})))

}