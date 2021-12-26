import {Dialog, DialogContent, DialogTitle, Grid, Button} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import SelectableBadge from "./SelectableBadge";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
            <Button variant="contained" onClick={handleClickOpen}>Give a badge</Button>
            <Dialog open={selectionOpen} onClose={handleClose} fullWidth maxWidth="sm" disableEnforceFocus>
                <DialogTitle>
                    <Typography align={"center"}>
                        Select a badge from the list
                    </Typography>
                </DialogTitle>
                <DialogContent style={{height:'300px',paddingTop:'50px',alignContent:"stretch"}}>
                    <Grid sx={{paddingLeft:5}} container direction="column" alignItems="center" spacing={5}>
                        {badgesGrid.map(d=>d)}
                    </Grid>
                    <Box sx={{"paddingTop":10,justifyItems:"space-between"}} textAlign={"center"}>
                        {selected?<Typography style={{"paddingBottom":10}}>Do you want to give {selected} badge?</Typography>:
                            <Typography style={{"paddingBottom":10}}>Please select a badge from the list</Typography>}
                        <Button variant="contained" disabled={!selected}>Confirm</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )
}