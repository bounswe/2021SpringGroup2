import * as React from "react";
import Button from "@mui/material/Button";
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Box,
    SvgIcon,
    Container,
    Divider,
    Dialog,
    DialogContent, DialogTitle
} from "@mui/material";
import {makeStyles, createStyles} from '@mui/styles'
import {Link} from 'react-router-dom'
import Joi from 'joi'
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker'
import {Autocomplete} from "@mui/lab";
import {useEffect, useState} from "react";
import {getSportsList} from "../../Controllers/SportsController";
import {getLocationMatches} from "../../Controllers/GeocodingController";
import MapWithMarker from "./MapWithMarker";
import MapIcon from '@mui/icons-material/Map';
import IconButton from "@mui/material/IconButton";

const initialState = {
    title: {
        value: "",
        changed: false,
        error: undefined
    },
    description: {
        value: "",
        changed: false,
        error: undefined
    },
    location: {
        value: "",
        changed: false,
        error: undefined
    },
    minAge: {
        value: 18,
        changed: false,
        error: undefined
    },
    maxAge: {
        value: 80,
        changed: false,
        error: undefined
    },
    playerCapacity: {
        value: 2,
        changed: false,
        error: undefined
    },
    spectatorCapacity: {
        value: 0,
        changed: false,
        error: undefined
    },

}



export default function CreateEventPage(props){
    const paperStyle = {padding:20, height: '87vh', width:500, margin:"20px auto", background: "#e4f2f7"};
    const textFieldStyle = {backgroundColor: 'white', marginTop: 10, marginBottom: 10}
    const inputStyle = {height:"10mm",fontSize:"5px"}
    const typographyStyle = {paddingBottom:5,color:'#4c4c4c'}
    const [date, setDate] = React.useState(null);
    const [timeStart, setTimeStart] = React.useState(null );
    const [timeEnd, setTimeEnd] = React.useState( null );
    const [ sport, setSport ] = React.useState("");
    const [options, setOptions] = React.useState([{}]);
    const [skill, setSkill] = React.useState(null);
    const skillOptions = [{label: "Beginner"},{label: "Preintermediate"},{label: "Intermediate"},
        {label: "Advanced"},{label: "Expert"}]
    const [inputs, setInputs] = useState(initialState)
    const [locationOpen, setLocationOpen] = React.useState(false);
    const [latitude, setLatitude] = React.useState("");
    const [longitude, setLongitude] = React.useState("");
    const centerValue = {
        lat:41.0082,
        lng:28.9784
    }
    const [position, setPosition] = useState(centerValue);
    const numberInputs = ["minAge","maxAge","playerCapacity","spectatorCapacity"]

    const handleClickOpen = () => {
        setLocationOpen(true);
    };

    const handleClose = () => {
        setLocationOpen(false);
    };
    const getValue = inputs => ({
        title: inputs.title.value,
        description: inputs.description.value,
        location: inputs.location.value,
        minAge: inputs.minAge.value,
        maxAge: inputs.maxAge.value,
        playerCapacity: inputs.playerCapacity.value,
        spectatorCapacity: inputs.spectatorCapacity.value
    })
    const handleChange = e=>{
        const newInputs = {...inputs}
        const value = getValue(newInputs)
        value[e.target.id] = e.target.value
        newInputs[e.target.id] = {
            value: numberInputs.includes(e.target.id)?(checkIfNumber(e.target.value)?e.target.value:newInputs[e.target.id].value):e.target.value,
            changed: true
        }
        setInputs(newInputs)
    }
    useEffect(_=>{
        getSportsList().then(r=>setOptions(r.sort(function (a, b) {
            return a.label.localeCompare(b.label);})
        )).catch(console.log)
    }, [])
    useEffect(()=>{
        setLongitude(position.lng)
        setLatitude(position.lat)
    },[position])

    const handleDateChange = (newValue) => {
        setDate(newValue);
    };
    const handleStartChange = (newValue) => {
        setTimeStart(newValue);
    };
    const handleEndChange = (newValue) => {
        setTimeEnd(newValue);
    }
    const checkIfNumber = (number) => {
        return (!isNaN(parseFloat(number)) && !isNaN(number - 0))|number==""
    }
    const handleLatitude = (event) => {
        if(checkIfNumber(event.target.value)){
            setLatitude(event.target.value)
            let current = position
            current.lat = Number(event.target.value)
            setTimeout(()=>{
                setPosition(current)
            },300)
        }
    }
    const handleLongitude = (event) => {
        if(checkIfNumber(event.target.value)){
            setLongitude(event.target.value)
            let current = position
            current.lng = Number(event.target.value)
            setTimeout(()=>{
                setPosition(current)
            },300)
        }
    }

    function createEvent(){
        if(!date||!timeStart|!timeEnd||!latitude||!longitude||!inputs.title||!sport||!skill){
            return;
        }


    }

    return(
        <Container component="main" maxWidth="md">
            <Paper elevation={8} style={paperStyle}>
                <form style={{width: "100%", marginTop: 3}}>
                    <Typography align='center' component="h1" variant="h5" style={typographyStyle}>
                        Create a new event
                    </Typography>
                    <TextField id="title" fullWidth required label="Event Title" size="small" variant="outlined" style={textFieldStyle}
                               value={inputs.title.value||""} onChange={handleChange}   InputProps={inputStyle}></TextField>
                    <TextField id="description" fullWidth label="Event Description" size="small" variant="outlined"style={textFieldStyle}
                               value={inputs.description.value||""} onChange={handleChange} ></TextField>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                value={sport}
                                options={options}
                                onChange={(event, value) =>value ? setSport(value.label) : setSport(event.target.value)}
                                renderInput={params => {
                                    return (
                                    <TextField
                                        {...params}
                                        label="Sport"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        required
                                        style={textFieldStyle}
                                    />
                                )}}/>

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="location" fullWidth label="Location Name" size="small" variant="outlined"style={textFieldStyle}
                                       value={inputs.location.value||""} onChange={handleChange} ></TextField>

                        </Grid>

                    </Grid>

                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="Latitude"
                                variant="outlined"
                                size="small"
                                required
                                fullWidth
                                onChange={handleLatitude}
                                style={textFieldStyle}
                                value={latitude}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="Longitude"
                                variant="outlined"
                                size="small"
                                required
                                fullWidth
                                onChange={handleLongitude}
                                style={textFieldStyle}
                                value={longitude}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <IconButton style={{marginTop:"10%"}} onClick={handleClickOpen}>
                                <MapIcon style={{width:"80%", height:"80%"}}/>
                            </IconButton>
                            <Dialog open={locationOpen} onClose={handleClose} fullWidth maxWidth="md">
                                <DialogTitle>Select location from map</DialogTitle>
                                <DialogContent>
                                    <MapWithMarker coordinates={position} setCoordinates={e=>setPosition(e)}/>
                                </DialogContent>
                            </Dialog>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    style = {{backgroundColor: "#ffffff"}}
                                    label="Event Date"
                                    inputFormat="dd/MM/yyyy"
                                    value={date}
                                    minDate={new Date()}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField  style={textFieldStyle} size="small" variant="outlined" fullWidth required {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="Event Start"
                                        value={timeStart}
                                        ampm={false}
                                        minDate={new Date()}
                                        onChange={handleStartChange}
                                        renderInput={(params) => <TextField  style={textFieldStyle} size="small" variant="outlined" fullWidth required {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="Event End"
                                        value={timeEnd}
                                        ampm={false}
                                        minDate={new Date()}
                                        onChange={handleEndChange}
                                        renderInput={(params) => <TextField  style={textFieldStyle} size="small" variant="outlined" fullWidth required {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                value={skill}
                                options={skillOptions}
                                onChange={(event, value) =>value ? setSkill(value.label) : setSkill(event.target.value)}
                                renderInput={params => {
                                    return (
                                        <TextField
                                            {...params}
                                            label="Skill Level"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            style={textFieldStyle}
                                        />
                                    )}} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField id="minAge" fullWidth label="Minimum Age" size="small" variant="outlined" style={textFieldStyle}
                                       value={inputs.minAge.value} onChange={handleChange}       InputProps={inputStyle}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField id="maxAge" fullWidth label="Maximum Age" size="small" variant="outlined" style={textFieldStyle}
                                       value={inputs.maxAge.value} onChange={handleChange} InputProps={inputStyle}></TextField>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField id="playerCapacity" fullWidth label="Player Capacity" size="small" variant="outlined" style={textFieldStyle}
                                value={inputs.playerCapacity.value} onChange={handleChange}    InputProps={inputStyle}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="spectatorCapacity" fullWidth label="Spectator Capacity" size="small" variant="outlined" style={textFieldStyle}
                                       value={inputs.spectatorCapacity.value} onChange={handleChange}  InputProps={inputStyle}></TextField>
                        </Grid>
                    </Grid>
                    <Box textAlign='center'>
                        <Button type="submit" variant="contained" align="center" onClick={createEvent}
                                style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Create Event
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>);
}
