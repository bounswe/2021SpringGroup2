import React from 'react'
import Container from "@mui/material/Container";
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@mui/styles";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {ListItemText} from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
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
}));

const profile = {
    firstName: {
        value: "Doğukan",
        changed: false,
        error: undefined
    },

    lastName: {
        value: "Akar",
        changed: false,
        error: undefined
    },
    username: {
        value: "dogukanakar",
        changed: false,
        error: undefined
    },
    bio: {
        value: "Doğukan Akar bu sayfanın geliştiricisidir",
        changed: false,
        error: undefined
    },
    age: {
        value: "22",
        changed: false,
        error: undefined
    },
    location: {
        value: "Sarıyer, İstanbul",
        changed: false,
        error: undefined
    },
    favSports: {
        value: ["tenis", "basketbol", "futbol"],
        changed: false,
        error: undefined
    },
}

const Index = props =>{
    const classes = useStyles()
    const params = useParams()
    const userid = params.userid
    console.log(userid)
    return(
        <div className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Typography variant="h4" component="div" align={"center"}>
                        {profile.firstName.value} {profile.lastName.value}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        @{profile.username.value}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography gutterBottom variant="body1" align={"center"}>
                        {profile.bio.value}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography className={classes.fav} variant="body1" align={"center"}>
                        Favourite Sports
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Stack spacing={2} direction={"row"} justifyContent={"space-around"}>
                        {
                            profile.favSports.value.map((f, i)=>(
                                <Item key={i}>{f}</Item>
                            ))
                        }
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography className={classes.other} variant="body1" align={"center"}>
                        Info
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Grid container spacing={2} justifyContent={"space-between"}>
                        <Grid item xs={12} sm={6}>
                            <ListItemText primary="Age" secondary={profile.age.value} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItemText style={{textAlign:"right"}} primary="Location" secondary={profile.location.value} />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

        </div>
    )

}


export default Index