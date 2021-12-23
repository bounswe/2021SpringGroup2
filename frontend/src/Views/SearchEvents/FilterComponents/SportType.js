import React from 'react'
import Typography from "@mui/material/Typography";
import Slider from '@mui/material/Slider';


export default function SportType(props){
    const handleChange = (event, newValue) => {
        props.setValue(props.ids)(newValue)
    };


    return(
        <React.Fragment>
            <Typography variant="body1">
                {props.text}
            </Typography>
            <Slider
                getAriaLabel={() => props.text}
                value={props.id}
                onChange={handleChange}
                valueLabelDisplay="auto"
            />
        </React.Fragment>
    )
}
