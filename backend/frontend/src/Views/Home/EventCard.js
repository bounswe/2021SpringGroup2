import {Card, CardActionArea, CardContent, CardMedia, Grid, Stack, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Avatar from '@mui/material/Avatar';
import DateRangeIcon from '@mui/icons-material/DateRange';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
export default function EventInfoCard(props){
    const typoStyle = {fontSize:13,display:"flex", flexDirection: "column", justifyContent: "center"}
    return (
        <Card sx={{ maxWidth: 345 }}  style={{ background: '#dbf0f9', justifyContent: 'center', flexDirection: 'column'}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="100"
                    image={props.image}
                    alt={props.title}
                />
                <CardContent>
                    <Typography gutterBottom align="center" variant="h5" component="div">
                        {props.title}
                    </Typography>
                    <Typography align="center" variant="body2">
                        {props.desc}
                    </Typography>
                    <Stack spacing={1}>
                        <Stack spacing={1} direction="row" justifyContent="flex-start">
                                <IconButton>
                                    <Avatar  sx={{ width: 24, height: 24 }} src={props.avatar}/>
                                </IconButton>
                                <Typography style={typoStyle}>
                                    {props.username}
                                </Typography>
                        </Stack>
                        <Stack spacing={2} direction="row">
                            <LocationOnIcon style={{marginLeft:3}}/>
                            <Typography style={typoStyle}>
                                {props.location}
                            </Typography>
                        </Stack>
                        <Stack spacing={2} direction="row">
                            <DateRangeIcon/>
                            <Typography style={typoStyle}>
                                {props.date}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
