import './Home.css';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from '@mui/material';
import {useEffect, useState} from "react";
import {getSports} from "../../Controllers/SportsController";
import SportsEventCard from './SportsEventCard'
import Button from "@mui/material/Button";
function Homepage() {
    const [sports, setSports] = useState([{}])
    const [index, setIndex] = useState((0))
    useEffect(_=>{
        getSports().then(r=>setSports(r))
            .catch(console.log)
    }, [])
  return (
    <div className="Homepage">
             <Button onClick={() => {
                 setIndex(index>0?index-1:0);
            }}>Previous</Button>
            <Grid container spacing={2}>
                {sports.slice(index,index+3).map(s=>(
                    <Grid item md={4}>
                        <SportsEventCard {...s}/>
                    </Grid>)
                )}
            </Grid>
            <Button onClick={() => {
            setIndex(index<9?index+1:9);
            }}>Next</Button>

    </div>
  );
}

export default Homepage;
