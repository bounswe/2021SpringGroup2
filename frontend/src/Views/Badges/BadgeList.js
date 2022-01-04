import {Grid} from "@mui/material";
import * as React from "react";
import Badge from "./Badge"
import {Badge as BadgeMUI} from "@mui/material";
export default function BadgeList(props) {
    const badgesGrid = []
    const counts = new Map();

    for (const badge of props.badges) {
        counts.set(badge.name, counts.get(badge.name)?counts.get(badge.name)+1:1);
    }
    for(let level=0;level<=counts.size;level+=3){
        badgesGrid.push(
            <Grid container spacing={3} alignItems="stretch">
                {
                Array.from(counts).slice(level,level+3).map((badge)=> {
                    let badgeName = badge[0];
                    let badgeCount = badge[1];
                    let badgeInfo = props.badges.find(({name}) => name === badgeName);
                    return badgeCount === 1 ?
                        <Grid item md={4}>
                            <Badge icon={badgeInfo.icon} name={badgeInfo.name} description={badgeInfo.description}/>
                        </Grid>
                        :
                        <Grid item md={4}>
                            <BadgeMUI badgeContent={badgeCount} color="primary">
                                <Badge icon={badgeInfo.icon} name={badgeInfo.name} description={badgeInfo.description}/>
                            </BadgeMUI>
                        </Grid>
                })
                }
            </Grid>
        )
    }
    return(
            <Grid container direction="column" spacing={5}>
                {badgesGrid.map(d=>d)}
            </Grid>

    )
}