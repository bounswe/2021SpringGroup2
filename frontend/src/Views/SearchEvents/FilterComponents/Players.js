import React from 'react'
import Typography from "@mui/material/Typography";
import Slider from '@mui/material/Slider';


export default function Players(props){
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
                value={[parseInt(props[props.ids[0]]), parseInt(props[props.ids[1]])]}
                onChange={handleChange}
                valueLabelDisplay="auto"
            />
        </React.Fragment>
    )
}