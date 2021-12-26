import {Dialog, DialogContent, DialogTitle, Grid, Button} from "@mui/material";
import * as React from "react";
import BadgeList from "./BadgeList"
import MapWithRectangle from "../SearchEvents/FilterComponents/MapWithRectangle";
import {useState} from "react";
import Badge from "./Badge";
import SelectableBadge from "./SelectableBadge";
import Typography from "@mui/material/Typography";
export default function BadgeSelection(props) {
    const [selectionOpen,setSelectionOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const handleClickOpen = () => {
        setSelectionOpen(true);
    };

    const handleClose = () => {
        setSelectionOpen(false);
    };
    const badgesGrid = []
    for(let level=0;level<=props.badges.length;level+=3){
        badgesGrid.push(
            <Grid container spacing={3} alignItems="stretch">
                {props.badges.slice(level,level+3).map(badge=>(
                        <Grid item md={4}>
                            <SelectableBadge icon={badge.icon} name={badge.name} description={badge.description}
                                selected={selected} setSelected={setSelected}/>
                        </Grid>
                    )
                )}
            </Grid>
        )
    }
    return (
        <div>
            <Button onClick={handleClickOpen}>Give a badge</Button>
            <Dialog open={selectionOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Select a badge from the list</DialogTitle>
                <DialogContent style={{height:'300px',paddingTop:'50px',alignContent:"center"}}>
                    <Grid container direction="column" alignItems="center" spacing={5}>
                        {badgesGrid.map(d=>d)}
                    </Grid>
                    {selected?<Typography>Do you want to give {selected} badge?</Typography>:null}
                    <Button disabled={!selected}>Confirm</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}