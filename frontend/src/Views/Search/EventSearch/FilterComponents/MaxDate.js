import React from 'react'
import Typography from "@mui/material/Typography";
import {DatePicker} from "@mui/lab";
import {TextField} from "@mui/material";
import {datetoISOString} from "./helper";

export default function MaxCreationDate(props){
    return(
        <React.Fragment>
            <Typography variant="body1">
                Date Range (End)
            </Typography>
            <DatePicker
                value={new Date(props[props.id])}
                onChange={(newValue) => {
                    console.log(newValue.getTime())
                    props.setValue(props.id)(datetoISOString(newValue));
                    props.setValue(props.id)(newValue.toISOString());
                }}
                renderInput={(params) => <TextField {...params} />}
            />

        </React.Fragment>
    )

}