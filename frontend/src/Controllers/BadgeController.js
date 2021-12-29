export async function getBadgeDetails(badge_name) {
    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }
    let response
    try {
        response = await fetch("/api/badges/" + String(badge_name) + "/", options)
            .then(response => response.json())
            .then((result) => {
                    return {
                                name: badge_name,
                                icon: result.icon.content,
                                description: result.content
                            }
                }
            )
    } catch (err) {
        console.log(err);
    }

    return response
}

export async function getAllBadges() {
    const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    }
    let response
    try {
        response = await fetch("/api/badges/" , options)
            .then(response => response.json())
            .then((result) => {
                return result.items.map(element=>(
                        {
                            name: element.object.name,
                            icon: element.object.icon.content,
                            description: element.object.content
                        }
                )
                )})
    } catch (err) {
        console.log(err);
    }

    return response
}
