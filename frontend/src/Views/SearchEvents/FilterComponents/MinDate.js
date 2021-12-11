import React from 'react'
import Typography from "@mui/material/Typography";
import {DatePicker} from "@mui/lab";
import {TextField} from "@mui/material";

export default function MinCreationDate(props){
    return(
        <React.Fragment>
            <Typography variant="body1">
                Minimum Date
            </Typography>
            <DatePicker
                label="minDate"
                value={new Date(props[props.id])}
                onChange={(newValue) => {
                    console.log(newValue.getTime())
                    props.setValue(props.id)(newValue.toGMTString());
                }}
                renderInput={(params) => <TextField {...params} />}
            />

        </React.Fragment>
    )

}