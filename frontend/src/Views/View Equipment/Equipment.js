import React, {useState, useEffect} from 'react'
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@mui/styles";
import {ListItemText, TextField} from "@mui/material";
import {getSports} from '../../Controllers/SportsController';

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
    "object": {
        "type": "Equipment",
        "postId": "",
        "ownerId": "",
        "content": "",
        "title": "Beginner friendly tennis racket",
        "creationDate": "2014-11-31T23:00:00-08:00",
        "lastUpdateDate": "2014-11-31T23:00:00-08:00",
        "numberOfClicks": 0,
        "location": {
            "name": "Etiler Tennis Club",
            "type": "Place",
            "longitude": 12.34,
            "latitude": 56.78,
            "altitude": 90,
            "units": "m"
        },
        "sport": "Tennis",
        "minSkillLevel": 1,
        "maxSkillLevel": 5,
        "equipmentType": "racket"
    }
}

export default function Equipment (){
    const classes = useStyles()
    const params = useParams()
    const equipmentid = params.equipmentid
    const [equipment, setEquipment] = useState(initialEquipment)

    // useEffect(() => {
    //     fetch("http://34.68.66.109/api/equipments/"+equipmentid+"/")
    //         .then(r=>r.json())
    //         .then(r=>setEquipment(r))
    // }, []);

    return(
        <div style={{background:`url(${Capture})`,backgroundRepeat:"no-repeat",backgroundSize:"contain",height:2500,width:1900}}>

            <Grid container spacing={2}>

                <Grid item xs={12} sm={12}>
                    <Typography className={classes.fav} variant="h4" component="div" align={"center"}>
                        {equipment.object.title}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        Type of Sport: {equipment.sport}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"} >
                        Location: {equipment.object.location.type} {equipment.object.location.longitude} {equipment.object.location.latitude}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <Grid container spacing={2} justifyContent={"space-between"} >
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Minimum Skill Level" secondary={event.object.eventMinSkillLevel} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Maximum Skill Level" secondary={event.object.eventMaxSkillLevel} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Grid container spacing={2} justifyContent={"space-between"}>
                        <Grid item xs={12} sm={6}>
                            <ListItemText className={classes.fav} primary="Creation Date" secondary={event.object.creationDate} />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>


        </div>


    )

}
