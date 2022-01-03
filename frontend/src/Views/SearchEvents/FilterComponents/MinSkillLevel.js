import React from 'react'
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";


export default function MinSkillLevel(props){
    return(
        <React.Fragment>
            <Typography variant="body1">
                Minimum Skill Level
            </Typography>
            <Rating
                name="minSkillLevel"
                value={parseInt(props[props.id])}
                onChange={(event, newValue) => {
                    props.setValue(props.id)(newValue)
                }}
            />
        </React.Fragment>
    )
}