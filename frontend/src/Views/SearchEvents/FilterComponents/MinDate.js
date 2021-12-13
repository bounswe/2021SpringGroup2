import React from 'react'
import Typography from "@mui/material/Typography";
import {DatePicker} from "@mui/lab";
import {TextField} from "@mui/material";
import {datetoGMTString} from "./helper";

export default function MinCreationDate(props){
    return(
        <React.Fragment>
            <Typography variant="body1">
                Date Range (Start)
            </Typography>
            <DatePicker
                value={new Date(props[props.id])}
                onChange={(newValue) => {
                    console.log(newValue.getTime())
                    props.setValue(props.id)(datetoGMTString(newValue));
                }}
                renderInput={(params) => <TextField {...params} />}
            />

        </React.Fragment>
    )

}