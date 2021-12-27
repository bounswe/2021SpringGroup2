import React from 'react'
import Typography from "@mui/material/Typography";
import Slider from '@mui/material/Slider';
import {FormControl, MenuItem, Select} from "@material-ui/core";


export default function SportType(props){
    const handleChange = (event, newValue) => {
        props.setValue(props.ids)(newValue)
    };


    return(
        <React.Fragment>
            <Typography variant="body1">
                Sport Types
            </Typography>
            <FormControl fullWidth>
                <Select
                    getAriaLabel={() => 'Sport Types'}
                    value={props.id}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                >
                    <MenuItem value={10}>Tennis</MenuItem>
                    <MenuItem value={20}>Football</MenuItem>
                    <MenuItem value={30}>Basketball</MenuItem>
                </Select>
            </FormControl>
        </React.Fragment>
    )
}
