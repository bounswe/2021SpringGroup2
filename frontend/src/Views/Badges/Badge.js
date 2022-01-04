import {Tooltip, Typography, Stack, Grid} from "@mui/material";
import * as React from "react";
export default function Badge(props) {
    return (
        <Tooltip title={props.description}>
            <Grid container direction="column" alignItems="center">
                <Grid item>
                    <img  width="50" height="50" src={`data:image/png;base64, ${props.icon}`}></img>
                </Grid>
                <Grid item>
                    <Typography>{props.name}</Typography>
                </Grid>
            </Grid>
        </Tooltip>
    )
}