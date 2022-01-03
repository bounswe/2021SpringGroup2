import React from 'react'
import UserCard from "./UserCard";

export default function EquipmentTab(props){

    return(
        <div
            role="tabpanel"
            hidden={props.hidden}
            id={`full-width-tabpanel-user`}
            aria-labelledby={`full-width-tab-user`}
        >
            {props.users.map((e, i)=>(
                <UserCard key={i} {...e}/>
            ))}
        </div>
    )
}