

export async function getSampleEvents(){
    const events = [];
    events.push({
        title:"Beginner Friendly Tennis Match",
        type: "Tennis",
        username:"hatice_gun",
        avatar: "../Images/11500.jpg",
        desc: "Beginners are welcome",
        location: "Etiler Tennis Club",
        date: "13/11/2021 15:00-16:00"
    });
    events.push({
        title:"Beginner Friendly Tennis Match",
        type: "Tennis",
        username:"hatice_gun",
        avatar: "../Images/11500.jpg",
        desc: "Beginners are welcome",
        location: "Etiler Tennis Club",
        date: "13/11/2021 15:00-16:00"
    });
    events.push({
        title:"Beginner Friendly Tennis Match",
        type: "Tennis",
        username:"hatice_gun",
        avatar: "../Images/11500.jpg",
        desc: "Beginners are welcome",
        location: "Etiler Tennis Club",
        date: "13/11/2021 15:00-16:00"
    });
    for(let event of events){
        const data = await fetch("https://sports.api.decathlon.com/sports/"+event.type.toLowerCase(),
            {headers: {'Accept-Language': 'en-US'}})
            .then(response=>response.json())
        event["image"] = data.data.relationships.images.data[0].url
    }
    console.log(events);
    return events
};