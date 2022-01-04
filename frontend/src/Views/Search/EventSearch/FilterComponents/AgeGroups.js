import React from 'react'
import Typography from "@mui/material/Typography";
import Slider from '@mui/material/Slider';
import {getValue} from "./helper";




export default function AgeGroups(props){
    const handleChange = (event, newValue) => {
        props.setValue(props.ids)(newValue)
    };


    return(
        <React.Fragment>
            <Typography variant="body1">
                Age Group Range
            </Typography>
            <Slider
                getAriaLabel={() => 'Age Group Range'}
                value={getValue(props)}
                onChange={handleChange}
                valueLabelDisplay="auto"
            />
        </React.Fragment>
    )
}