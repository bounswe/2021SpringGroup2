import React from 'react'
import EquipmentCard from "./EquipmentCard";

export default function EquipmentTab(props){

    return(
        <div
            role="tabpanel"
            hidden={props.hidden}
            id={`full-width-tabpanel-equipment`}
            aria-labelledby={`full-width-tab-equipment`}
            >
            {props.equipments.map((e, i)=>(
                <EquipmentCard key={i} {...e}/>
            ))}
        </div>
    )
}