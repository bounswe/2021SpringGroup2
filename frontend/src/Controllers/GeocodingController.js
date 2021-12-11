

export async function getLocationBoundaryBoxes(query){
    return await fetch("https://nominatim.openstreetmap.org/search?q="+query+"&limit=5&format=json")
        .then(response=>response.json())
        .then(r=>r.map(d=>(
            {name:d.display_name,
                topLeft:{lat:Number(d.boundingbox[1]),lng:Number(d.boundingbox[2])},
                bottomLeft:{lat:Number(d.boundingbox[0]),lng:Number(d.boundingbox[2])},
                topRight:{lat:Number(d.boundingbox[1]),lng:Number(d.boundingbox[3])},
                bottomRight:{lat:Number(d.boundingbox[0]),lng:Number(d.boundingbox[3])}

            })))
}