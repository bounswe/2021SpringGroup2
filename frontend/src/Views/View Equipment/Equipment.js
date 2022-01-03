import React, {useState, useEffect} from 'react'
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@mui/styles";
import {ListItemText, TextField} from "@mui/material";

const useStyles = makeStyles(theme => createStyles({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    fav: {
        color: theme.palette.warning.light,
        fontsize: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    other: {
        color: theme.palette.secondary.light,
        fontsize: 20,
    },
    info: {
        color: theme.palette.primary.light,
        fontsize: 20,
    },
    infotext: {
        color: theme.palette.secondary.light,
        fontsize: 20,
    },
    others: {
        color: theme.palette.warning.light,
        fontsize: 20,
    },
    media: {
        height: 350
    },
    typography: {
        align: "center"
    }


}));

const initialEquipment = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "summary": "egecky posted an equipment",
    "type": "Create",
    "actor": {
        "type": "Person",
        "name": "egecky"
    },
    "object": {
        "type": "Equipment",
        "postId": 1,
        "ownerId": 2,
        "content": "i can't drive my car so i'm selling it",
        "title": "car for sale",
        "creationDate": "2022-01-02T18:46:46.313518Z",
        "numberOfClicks": 0,
        "location": {
            "name": "Monaco",
            "type": "Place",
            "longitude": 1.0,
            "latitude": 1.0,
            "units": "m"
        },
        "url": "www.google.com",
        "sport": "f1",
        "equipmentType": "car"
    }
}

export default function Equipment (){
    const classes = useStyles()
    const params = useParams()
    const equipmentid = params.equipmentid
    const [equipment, setEquipment] = useState(initialEquipment)
    useEffect(() => {
        fetch("http://34.68.66.109/api/equipments/"+equipmentid+"/")
            .then(r=>r.json())
            .then(r=>setEquipment(r))
    }, []);
    return(
        //style={{background:`url(${Capture})`,backgroundRepeat:"no-repeat",backgroundSize:"contain",height:2500,width:1900}}
        <div >

            <Grid container spacing={2}>

                <Grid item xs={12} sm={12}>
                    <Typography className={classes.fav} variant="h4" component="div" align={"center"}>
                        {equipment.object.title}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        Content: {equipment.object.content}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Grid container spacing={2} justifyContent={"space-between"} >
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Type of Sport" secondary={equipment.object.sport} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Type of Equipment" secondary={equipment.object.equipmentType} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Creation Date" secondary={equipment.object.creationDate} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Location" secondary={equipment.object.location.type + " " + equipment.object.location.longitude + " " + equipment.object.location.latitude} />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>


        </div>


    )

}
