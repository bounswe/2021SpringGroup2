import {Grid} from "@mui/material";
import * as React from "react";
import Badge from "./Badge"
export default function BadgeList(props) {
    const badgesGrid = []
    for(let level=0;level<=props.badges.length;level+=3){
        badgesGrid.push(
            <Grid container spacing={3} alignItems="stretch">
                {props.badges.slice(level,level+3).map(badge=>(
                        <Grid item md={4}>
                            <Badge icon={badge.icon} name={badge.name} description={badge.description}/>
                        </Grid>
                    )
                )}
            </Grid>
        )
    }
    return(
            <Grid container direction="column" spacing={5}>
                {badgesGrid.map(d=>d)}
            </Grid>

    )
}