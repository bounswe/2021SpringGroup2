import React from 'react'
import EventCard from "../../Search/EventSearch/EventCard";

export default  function OwnedEvents(props){

    return(
        <div
            role="tabpanel"
            hidden={props.hidden}
            id={`full-width-tabpanel-owned`}
            aria-labelledby={`full-width-tab-owned`}
        >
            {props.owned.map((e, i)=>(
                <EventCard key={i} {...e}/>
            ))}
        </div>
    )
}