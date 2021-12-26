import {Tooltip, Typography, Stack, Grid} from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
export default function SelectableBadge(props) {
    return (
        <Box sx={{border:3,borderColor:((props.selected===props.name)?"green":"white")}}>
            <Tooltip title={props.description}>
                <Grid container direction="column" alignItems="center" onClick={()=>props.setSelected(
                    props.selected===props.name?null:props.name)}
                        sx={{cursor:"pointer"}}>
                    <Grid item>
                        <img width="50" height="50" src={`data:image/png;base64, ${props.icon}`}></img>
                    </Grid>
                    <Grid item>
                        <Typography>{props.name}</Typography>
                    </Grid>
                </Grid>
            </Tooltip>
        </Box>
    )
}