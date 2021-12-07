
import * as React from "react";
import Container from "@mui/material/Container";
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@mui/styles";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {ListItemText, TextField} from "@mui/material";
import EventInfoCard from "../Home/EventCard";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SportsInfoCard from "../Home/SportsInfoCard";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Button from "@mui/material/Button";
import {Link} from 'react-router-dom'
import Joi from 'joi'
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker'
import {Autocomplete} from "@mui/lab";
import {useEffect, useState} from "react";
import {getSportsList} from "../../Controllers/SportsController";


import BoardComponent from '../Event Page/Components/BoardComponent'
import eventData from './data/eventData.json'




export default function EventList (props){
    const [events, setEvents] = useState([]);
    useEffect(() => {
        setEvents(eventData);
    }, []);
    return(
        <div className='EventList'>
            <h1>Hellooo</h1>
            {
                <BoardComponent/>
            }
        </div>


    )

}
