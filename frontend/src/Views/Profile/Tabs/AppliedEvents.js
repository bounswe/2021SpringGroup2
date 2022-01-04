import React from 'react'
import EventCard from "../../Search/EventSearch/EventCard";

export default  function AppliedEvents(props){

    return(
        <div
            role="tabpanel"
            hidden={props.hidden}
            id={`full-width-tabpanel-applied`}
            aria-labelledby={`full-width-tab-applied`}
        >
            {props.applied.map((e, i)=>(
                <EventCard key={i} {...e}/>
            ))}
        </div>
    )
}