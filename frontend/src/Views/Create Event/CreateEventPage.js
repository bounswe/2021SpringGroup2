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
    DialogContent, DialogTitle, Stack
} from "@mui/material";
import {makeStyles, createStyles} from '@mui/styles'
import {Link} from 'react-router-dom'
import Joi from 'joi'
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker'
import {Alert, Autocomplete, DateTimePicker} from "@mui/lab";
import {useEffect, useState} from "react";
import {getSportsList} from "../../Controllers/SportsController";
import MapIcon from '@mui/icons-material/Map';
import IconButton from "@mui/material/IconButton";
import MapWithMarker from "./MapWithMarker";
import {postEvent} from "../../Controllers/EventController";

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

export function checkIfDateIsLater(start,end){
    let date_start = new Date(start)
    let date_end = new Date(end)
    return date_start<=date_end
}
export function checkIfNumber(number){
    return (!isNaN(parseFloat(number)) && !isNaN(number - 0))|number==""
}
export default function CreateEventPage(props){
    const paperStyle = {padding:20, height: '97vh', width:500, margin:"20px auto", background: "#e4f2f7"};
    const textFieldStyle = {backgroundColor: 'white', marginTop: 10, marginBottom: 10}
    const inputStyle = {height:"10mm",fontSize:"5px"}
    const typographyStyle = {paddingBottom:5,color:'#4c4c4c'}

    const [dateStart, setDateStart] = React.useState(null);
    const [dateEnd, setDateEnd] = React.useState(null);
    const [dateError, setDateError] = useState(null);

    const [ sport, setSport ] = React.useState("");
    const [options, setOptions] = React.useState([{}]);

    const [minSkill, setMinSkill] = React.useState(null);
    const [maxSkill, setMaxSkill] = React.useState(null);
    const [skillError, setSkillError] = React.useState(null);
    const skillOptions = [{label: "Beginner"},
        {label: "Preintermediate"},
        {label: "Intermediate"},
        {label: "Advanced"},
        {label: "Expert"}]

    const skillsToIntegers = {
        "Beginner":0,
        "Preintermediate":1,
        "Intermediate":2,
        "Advanced":3,
        "Expert":4
    }
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

    useEffect(()=>{
        if(dateStart&&!checkIfDateIsLater(new Date().toLocaleString(),dateStart)){
            setDateError("You cannot create an event in the past")
        }
        else if(dateStart&&dateEnd&&!checkIfDateIsLater(dateStart,dateEnd)){
            setDateError("Starting date must be earlier than the finish date")
        }
        else{
            setDateError(null)
        }
    },[dateStart,dateEnd])

    useEffect(()=>{
        if(skillsToIntegers[maxSkill]<skillsToIntegers[minSkill]){
            setSkillError("Maximum skill level must be higher than the minimum skill level")
        }
        else{
            setSkillError(null)
        }
    },[minSkill,maxSkill])

    const handleDateStartChange = (newValue) => {
        setDateStart(newValue);
    };
    const handleDateEndChange = (newValue) => {
        setDateEnd(newValue);
    };
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
        if(dateStart&&!checkIfDateIsLater(new Date().toISOString(),dateStart)){
            setDateError("You cannot create an event in the past")
            return
        }
        else if(dateStart&&dateEnd&&!checkIfDateIsLater(dateStart,dateEnd)){
            setDateError("Starting date must be earlier than the finish date")
            return
        }
        if(skillsToIntegers[maxSkill]<skillsToIntegers[minSkill]){
            setSkillError("Maximum skill level must be higher than the minimum skill level")
            return
        }
        if(!dateStart||!dateEnd||!latitude||!longitude||!inputs.title||!sport||!inputs.location){
            return;
        }
        let duration = Math.floor(((dateEnd-dateStart)/1000)/60)
        const params={
            content: inputs.description.value,
            title: inputs.title.value,
            location: inputs.location.value,
            date: dateStart.toISOString(),
            duration: duration,
            sport: sport,
            min_age: inputs.minAge.value,
            max_age: inputs.maxAge.value,
            player_capacity: inputs.playerCapacity.value,
            spec_capacity: inputs.spectatorCapacity.value,
            min_skill_level: minSkill?skillsToIntegers[minSkill]:null,
            max_skill_level: maxSkill?skillsToIntegers[maxSkill]:null,
            latitude: latitude,
            longitude: longitude
        }
        postEvent(params)
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
                               required value={inputs.location.value||""} onChange={handleChange} ></TextField>

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
                        <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        style = {{backgroundColor: "#ffffff"}}
                                        label="Event Date Start"
                                        inputFormat="dd/MM/yyyy HH:mm"
                                        value={dateStart}
                                        minDate={new Date()}
                                        ampm={false}
                                        onChange={handleDateStartChange}
                                        renderInput={(params) => <TextField  style={textFieldStyle} size="small" variant="outlined" fullWidth required {...params} />}
                                    />
                                </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    style = {{backgroundColor: "#ffffff"}}
                                    label="Event Date End"
                                    inputFormat="dd/MM/yyyy HH:mm"
                                    value={dateEnd}
                                    minDate={new Date()}
                                    ampm={false}
                                    onChange={handleDateEndChange}
                                    renderInput={(params) => <TextField  style={textFieldStyle} size="small" variant="outlined" fullWidth required {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    {dateError!==null?<Alert severity="error">{dateError}</Alert>:null}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                value={minSkill}
                                options={skillOptions}
                                onChange={(event, value) =>value ? setMinSkill(value.label) : setMinSkill(event.target.value)}
                                renderInput={params => {
                                    return (
                                        <TextField
                                            {...params}
                                            label="Minimum Skill Level"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            style={textFieldStyle}
                                        />
                                    )}} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                value={maxSkill}
                                options={skillOptions}
                                onChange={(event, value) =>value ? setMaxSkill(value.label) : setMaxSkill(event.target.value)}
                                renderInput={params => {
                                    return (
                                        <TextField
                                            {...params}
                                            label="Maximum Skill Level"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            style={textFieldStyle}
                                        />
                                    )}} />
                        </Grid>
                    </Grid>
                    {skillError!==null?<Alert severity="error">{skillError}</Alert>:null}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField id="minAge" fullWidth label="Minimum Age" size="small" variant="outlined" style={textFieldStyle}
                                       value={inputs.minAge.value} onChange={handleChange}       InputProps={inputStyle}></TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="maxAge" fullWidth label="Maximum Age" size="small" variant="outlined" style={textFieldStyle}
                                       value={inputs.maxAge.value} onChange={handleChange} InputProps={inputStyle}></TextField>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
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
