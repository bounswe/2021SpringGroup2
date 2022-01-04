import React from 'react'
import EventCard from "./EventCard";

export default  function EventTab(props){

    return(
        <div
            role="tabpanel"
            hidden={props.hidden}
            id={`full-width-tabpanel-event`}
            aria-labelledby={`full-width-tab-event`}
            >
            {props.events.map((e, i)=>(
                <EventCard key={i} {...e}/>
            ))}
        </div>
    )
}