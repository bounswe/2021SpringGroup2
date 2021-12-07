import React from 'react'
import eventData from '../data/eventData.json'

const BoardComponent = () => (
    <div className='flex bg-white shadow-lg my-4 p-4'>
        <div>
            <img src={eventData.type}/>
        </div>
        <div>

            <h3>{eventData.actor.name}</h3>
            <h2>{eventData.object.name}</h2>
            <p>
                {eventData.object.creationDate} * {eventData.object.eventDate} * {eventData.object.title}
            </p>
        </div>


    </div>

)

export default BoardComponent;