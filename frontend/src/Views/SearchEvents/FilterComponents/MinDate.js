import React from 'react'
import Typography from "@mui/material/Typography";
import {DatePicker} from "@mui/lab";
import {TextField} from "@mui/material";

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
                    props.setValue(props.id)(newValue.toISOString().split("T")[0]);
                }}
                renderInput={(params) => <TextField {...params} />}
            />

        </React.Fragment>
    )

}