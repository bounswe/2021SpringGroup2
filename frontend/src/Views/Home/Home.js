import './Home.css';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from '@mui/material';
import {useEffect, useState} from "react";
import {getSports} from "../../Controllers/SportsController";
import SportsInfoCard from "./SportsInfoCard";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {getSampleEvents} from "../../Controllers/SampleEventController";
import EventInfoCard from "./EventCard";
import AuthInfo from "../../Controllers/AuthInfo";
function Homepage() {
    const [sports, setSports] = useState([{}])
    const [events, setEvents] = useState([{}])
    const [sportIndex, setSportIndex] = useState((0))
    const [eventIndex, setEventIndex] = useState((0))
    useEffect(_=>{
        getSports().then(r=>setSports(r))
            .catch(console.log)
        getSampleEvents().then(r=>setEvents(r))
            .catch(console.log)
    }, [])
  return (
    <div className="Homepage">
        <h2 style={{ color: "#FF7518", fontFamily: 'Trocchi', fontSize: "30px", fontWeight: "normal", lineHeight: "48px", textAlign: "center", marginTop: 30, marginBottom: 30}}>
            Discover Sports
        </h2>
        <div style={{
            display: 'flex',
            alignItems: 'center'}}>
            <IconButton style={{marginRight:25,marginLeft: 10}} onClick={() => {
                setSportIndex(sportIndex>2?sportIndex-3:0);}}>
                <ArrowBackIosIcon/>
            </IconButton>
            <Grid container spacing={2} alignItems="stretch">
                {sports.slice(sportIndex,sportIndex+3).map(s=>(
                    <Grid item md={4} style={{display: 'flex'}}>
                        <SportsInfoCard {...s}/>
                    </Grid>)
                )}
            </Grid>
            <IconButton style={{marginRight:10}} onClick={() => {
                setSportIndex(sportIndex<9?sportIndex+3:9);}}>
                <ArrowForwardIosIcon/>
            </IconButton>
        </div>
        <h2 style={{ color: "#FF7518", fontFamily: 'Trocchi', fontSize: "30px", fontWeight: "normal", lineHeight: "48px", textAlign: "center", marginTop: 30, marginBottom: 30}}>
            Browse Events
        </h2>
        <div style={{
            display: 'flex',
            alignItems: 'center'}}>
            <IconButton style={{marginRight:25,marginLeft: 10}} onClick={() => {
                setEventIndex(eventIndex>2?eventIndex-3:0);}}>
                <ArrowBackIosIcon/>
            </IconButton>
            <Grid container spacing={2} alignItems="stretch">
                {events.slice(eventIndex,eventIndex+3).map(s=>(
                    <Grid item md={4} style={{display: 'flex'}}>
                        <EventInfoCard {...s}/>
                    </Grid>)
                )}
            </Grid>
            <IconButton style={{marginRight:10}} onClick={() => {
                setEventIndex(eventIndex<9?eventIndex+3:9);}}>
                <ArrowForwardIosIcon/>
            </IconButton>
        </div>
    </div>
  );
}

export default Homepage;
