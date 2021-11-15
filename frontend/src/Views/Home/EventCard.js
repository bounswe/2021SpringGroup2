import {Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Avatar from '@mui/material/Avatar';
import DateRangeIcon from '@mui/icons-material/DateRange';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
export default function EventInfoCard(props){
    return (
        <Card sx={{ maxWidth: 345 }}  style={{ background: '#dbf0f9', justifyContent: 'center', flexDirection: 'column'}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={props.image}
                    alt={props.title}
                />
                <CardContent>
                    <Typography gutterBottom align="center" variant="h5" component="div">
                        {props.title}
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={3}>
                            <IconButton>
                                <Avatar src={props.avatar}/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography>
                                {props.username}
                            </Typography>
                        </Grid>
                    </Grid>

                    <LocationOnIcon/>
                    <Typography>
                        {props.location}
                    </Typography>
                    <DateRangeIcon/>
                    <Typography>
                        {props.date}
                    </Typography>

                    <GroupIcon/>
                    <Typography align="justify" variant="body2" color="text.secondary">
                        {props.desc}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
