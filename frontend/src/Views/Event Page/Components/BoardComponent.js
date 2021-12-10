import React from 'react'

const BoardComponent = (props) => (
    <div className='flex bg-blue shadow-lg my-4 p-4'>
        {/*<div>*/}
        {/*    <img src={eventData.object.type}/>*/}
        {/*</div>*/}
        <div>

            <h3>Event Owner: {props.event.name}</h3>
            <h2>{props.event.object.name}</h2>
            <p>
                {props.event.object.creationDate} * {props.event.object.eventDate} * {props.event.object.title}
            </p>
        </div>


    </div>

)

export default BoardComponent;