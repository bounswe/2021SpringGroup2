import React, {useState, useEffect} from 'react'
import Typography from "@mui/material/Typography";
import Slider from '@mui/material/Slider';
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {getSportsList} from '../../../Controllers/SportsController';
import SportTypesInfoCard from "../../Home/SportTypesInfoCard";
import Grid from "@mui/material/Grid";
import {createStyles, makeStyles, styled} from "@mui/styles";


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


export default function SportType(props){
    const classes = useStyles()

    const handleChange = (event, newValue) => {
        props.setValue(props.ids)(newValue)
    };


    // useEffect(() => {
    //     fetch("http://34.68.66.109/api/posts/"+eventid+"/")
    //         .then(r=>r.json())
    //         .then(r=>setEvent(r)||r)
    //         .then(r=>getSportInfo(r.object.eventSport))
    //         //.then(r=>getSportInfo("Tennis"))
    //         .then(setSport)
    // }, []);

    const [sportTypes, setSportTypes] = useState([{}])

    useEffect(() => {
        getSportsList()
            .then(setSportTypes)
    }, [])

    return(
        <React.Fragment>
            <Typography variant="body1">
                Sport Types
            </Typography>
            <FormControl fullWidth>
                <Select
                    getAriaLabel={() => 'Sport Types'}
                    value={props.id}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                >
                    <MenuItem value={10}>Tennis</MenuItem>
                    <MenuItem value={20}>Football</MenuItem>
                    <MenuItem value={30}>Basketball</MenuItem>
                </Select>
            </FormControl>
            <Grid item  style={{display: 'flex'}} align={"center"}>
                {sportTypes.map(s => <div>{s.title}</div>)}

            </Grid>

        </React.Fragment>
    )
}
