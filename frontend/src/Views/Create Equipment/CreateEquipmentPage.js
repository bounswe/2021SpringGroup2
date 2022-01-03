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
import {Alert, Autocomplete} from "@mui/lab";
import {useEffect, useState} from "react";
import {getSportsList} from "../../Controllers/SportsController";
import MapIcon from '@mui/icons-material/Map';
import IconButton from "@mui/material/IconButton";
import MapWithMarker from "../Create Event/MapWithMarker";
import {checkIfNumber} from "../Create Event/CreateEventPage";
import {postEquipment} from "../../Controllers/EquipmentController";

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
    equipment: {
        value: "",
        changed: false,
        error: undefined
    },
    url: {
        value: "",
        changed: false,
        error: undefined
    }
}
export function linkFormatChecker(link){
    if(link.match(/(http:\/\/|www\.|https:\/\/)\S+\.\S+/)){
        return true
    }
    return false
}
export default function CreateEquipmentPage(props){
    const paperStyle = {padding:20, height: '85vh', width:500, margin:"20px auto", background: "#e4f2f7"};
    const textFieldStyle = {backgroundColor: 'white', marginTop: 10, marginBottom: 10}
    const inputStyle = {height:"10mm",fontSize:"5px"}
    const typographyStyle = {paddingBottom:5,color:'#4c4c4c'}

    const [ sport, setSport ] = React.useState("");
    const [options, setOptions] = React.useState([{}]);

    const [inputs, setInputs] = useState(initialState)

    const [locationOpen, setLocationOpen] = React.useState(false);
    const centerValue = {
        lat:41.0082,
        lng:28.9784
    }
    const [position, setPosition] = useState(centerValue);

    const [latitude, setLatitude] = React.useState("");
    const [longitude, setLongitude] = React.useState("");
    const [urlAlert, setUrlAlert] = React.useState(null);

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
        equipment: inputs.equipment.value,
        url: inputs.url.value
    })
    const handleChange = e=>{
        const newInputs = {...inputs}
        const value = getValue(newInputs)
        value[e.target.id] = e.target.value
        newInputs[e.target.id] = {
            value: e.target.value,
            changed: true
        }
        if(e.target.id==="url"){
            if(!linkFormatChecker(e.target.value)){
                setUrlAlert("Please enter a valid URL")
            }
            else{
                setUrlAlert(null)
            }
        }
        setInputs(newInputs)
    }
    useEffect(_=>{
        getSportsList().then(r=>setOptions(r.sort(function (a, b) {
            return a.label.localeCompare(b.label);})
        )).catch(console.log)
    }, [])

    useEffect(()=>{
        if(position.lng!==centerValue.lng&&position.lat!==centerValue.lat){
            setLongitude(position.lng)
            setLatitude(position.lat)
        }
    },[position])


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
        if(!inputs.equipment.value||!latitude||!longitude||!inputs.title.value||!sport||!inputs.location.value){
            return
        }
        if(inputs.url.value!==null&&inputs.url.value!==undefined&&!linkFormatChecker(inputs.url.value)){
           return
        }
        const params={
            content: inputs.description.value,
            title: inputs.title.value,
            location: inputs.location.value,
            sport: sport,
            latitude: latitude,
            longitude: longitude,
            equipment: inputs.equipment.value,
            url: inputs.url.value
        }
        postEquipment(params)
    }

    return(
        <Container component="main" maxWidth="md">
            <Paper elevation={8} style={paperStyle}>
                <form style={{width: "100%", marginTop: 3}}>
                    <Typography align='center' component="h1" variant="h5" style={typographyStyle}>
                        Create a new equipment post
                    </Typography>
                    <TextField id="title" fullWidth required label="Equipment Title" size="small" variant="outlined" style={textFieldStyle}
                               value={inputs.title.value||""} onChange={handleChange}   InputProps={inputStyle}></TextField>
                    <TextField id="description" fullWidth label="Equipment Description" size="small" variant="outlined"style={textFieldStyle}
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
                        <Grid item xs={12} sm={12}>
                            <TextField id="equipment" fullWidth label="Equipment type" size="small" variant="outlined" style={textFieldStyle}
                                   required  value={inputs.equipment.value||""} onChange={handleChange}       InputProps={inputStyle}></TextField>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField id="url" fullWidth label="Link to the product" size="small" variant="outlined" style={textFieldStyle}
                                       value={inputs.url.value||""} onChange={handleChange}       InputProps={inputStyle}></TextField>
                            {urlAlert!==null?
                                    <Alert
                                        style={{marginTop:5}}
                                        severity="error">
                                        {urlAlert}
                                    </Alert> :null}
                        </Grid>
                    </Grid>

                    <Box textAlign='center'>
                        <Button  variant="contained" align="center" onClick={createEvent}
                                style={{margin:"8px 0",backgroundColor:"#41e5ff"}}>Create Equipment Post
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>);
}
