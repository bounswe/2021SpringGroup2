import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import {CircularProgress, ListItemText} from "@mui/material";
import {getProfile} from "../../Controllers/ProfileController";
import BadgeList from "../Badges/BadgeList";
import {getAllBadges, getAllBadgesOfAUser, getAllEventsAvailableForBadgeGift} from "../../Controllers/BadgeController";
import {getUserInfoLoggedIn} from "../../Controllers/AuthInfo";
import RelatedEvents from "../Badges/RelatedEvents";
import Box from "@mui/material/Box";

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

const initialProfile = {
    loading: true,
    id: {
        value: 0,
        changed: false,
        error: undefined
    },
    avatar: {
        value: 0,
        changed: false,
        error: undefined
    },

    first_name: {
        value: "Doğukan",
        changed: false,
        error: undefined
    },

    last_name: {
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
    privacy: {
        value: "",
        changed: false,
        error: undefined
    },
    fav_sport_1: {
        value: "",
        changed: false,
        error: undefined
    },
    fav_sport_2: {
        value: "",
        changed: false,
        error: undefined
    },
    fav_sport_3: {
        value: "",
        changed: false,
        error: undefined
    },
}

const Index = _ =>{
    const classes = useStyles()
    const params = useParams()
    const userid = params.userid
    const [profile, setProfile] = useState(initialProfile)
    const [badges, setBadges] = useState([])
    const [loggedUser, setLoggedUser] = useState(null)
    const [relatedEvents, setRelatedEvents] = useState([])
    const [allBadges, setAllBadges] = useState([])
    useEffect(async function () {
        if(profile.loading){
            let newProfile
            getProfile(userid)
                .then(p=>{
                    newProfile = {...profile}
                    for(let i in p){
                        if(newProfile[i] === undefined)continue
                        console.log(i)
                        newProfile[i].value = p[i]
                    }
                    newProfile.username.value = userid
                    newProfile.loading = false
                })
                .catch(console.log)
            await getAllBadgesOfAUser(userid).then(badges => {
                    console.log(badges)
                    setBadges(badges)
                }
            ).catch(console.log)
            getAllEventsAvailableForBadgeGift(userid).then(events =>
                setRelatedEvents(events)
            ).catch(console.log)
            getAllBadges().then(allBadges =>
                setAllBadges(allBadges))
                .catch(console.log)
            setProfile(newProfile)
        }
    }, [])


    return profile.loading? <div align={"center"} >
            <CircularProgress /></div>
        :
    (
        <div className={classes.paper}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Typography variant="h4" component="div" align={"center"}>
                        {profile.first_name.value} {profile.last_name.value}
                    </Typography>
                    <Typography variant="subtitle1" component="div" align={"center"}>
                        @{profile.username.value}
                    </Typography>
                </Grid>
                {relatedEvents!==null&&relatedEvents!==undefined&&relatedEvents.length>0
                    ?<Grid item xs={12} sm={12} align={"center"}>
                        <RelatedEvents events={relatedEvents} badges={allBadges} target={userid}/>
                    </Grid>
                    :null}
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
                        <Item>{profile.fav_sport_1.value}</Item>
                        <Item>{profile.fav_sport_2.value}</Item>
                        <Item>{profile.fav_sport_3.value}</Item>
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
                {badges&&badges.length>0?
                    <Grid item xs={12} sm={12}>
                        <Stack spacing={3}>
                            <Typography textAlign={"center"} style={{color:"#006400"}} className={classes.other}>
                                Badges
                            </Typography>
                            <BadgeList badges={badges}/>
                        </Stack>
                    </Grid>
                    :null
                }


            </Grid>

        </div>
    )

}


export default Index