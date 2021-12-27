import React from 'react'
import Typography from "@mui/material/Typography";
import {DatePicker} from "@mui/lab";
import {TextField} from "@mui/material";

export default function MiaxCreationDate(props){
    return(
        <React.Fragment>
            <Typography variant="body1">
                Maximum Creation Date
            </Typography>
            <DatePicker
                value={new Date(props[props.id])}
                onChange={(newValue) => {
                    console.log(newValue.getTime())
                    props.setValue(props.id)(newValue.toISOString());
                }}
                renderInput={(params) => <TextField {...params} />}
            />

        </React.Fragment>
    )

}