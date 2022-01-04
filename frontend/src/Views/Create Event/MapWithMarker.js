import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import * as React from "react";
import {useMemo, useRef, useState} from "react";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {Autocomplete} from "@mui/lab";
import {TextField} from "@mui/material";
import {getLocationMatches} from "../../Controllers/GeocodingController";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';

export default function MapWithMarker(props) {
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        opacity: 0
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    const centerValue = {
        lat:41.0082,
        lng:28.9784
    }
    const [location, setLocation] = useState(null);
    const [locationText, setLocationText] = useState("");
    const [locations, setLocations] = useState([{}]);
    const [optionsOpen,setOptionsOpen] = useState(false);
    const textFieldStyle = {backgroundColor: 'white', marginTop: 10, marginBottom: 10};
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    let coords = marker.getLatLng()
                    props.setCoordinates({lat:Number(coords.lat),lng:Number(coords.lng)})
                }
            },
        }),
        [],
    )

    function SetViewOnClick({ coords }) {
        const map = useMap();
        map.setView(coords, map.getZoom());
        return null;
    }
    const handleLocationSearch = (event,inputQuery) => {
        setLocationText(inputQuery)
    }
    const handleSearch = () => {
        getLocationMatches(locationText).then(results=> {
                setLocations(results)
            }
        )
        setOptionsOpen(true)
    }
    const selectLocation = (input) => {
        setOptionsOpen(false)
        let coords = {lat:input.lat, lng:input.lng}
        props.setCoordinates(coords)
    }
    return (
        <div>
        <Grid container spacing={1}>
            <Grid item sm={11}>
                <Autocomplete
                    open={optionsOpen}
                    value={location}
                    inputValue={locationText}
                    options={locations}
                    getOptionLabel={d=>d.name ||""}
                    filterOptions={(x)=>x}
                    onChange={(event, value) =>value ? selectLocation(value) : selectLocation(event.target.value)}
                    onInputChange={handleLocationSearch}
                    clearOnBlur={false}
                    renderInput={params => {
                        return (
                            <TextField  {...params} id="location" fullWidth label="Select Location" placeholder="Search for city, district, street..." size="small" variant="outlined"
                                        style={textFieldStyle} value={locationText|""}></TextField>
                        )}} />
            </Grid>
            <Grid item sm={1}>
                <IconButton style={{marginTop: "10%"}} onClick={handleSearch}>
                    <SearchIcon style={{width:"70%", height:"70%"}}/>
                </IconButton>
            </Grid>
        </Grid>


        <div id="map">
        <MapContainer style={{width: "100%", height: "70vh"}} center={centerValue} zoom={13}
                      scrollWheelZoom={false} attributionControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={props.coordinates}
                draggable={"true"}
                ref={markerRef}
                eventHandlers={eventHandlers}>
                <SetViewOnClick coords={props.coordinates}/>
            </Marker>
        </MapContainer>
    </div>
        </div>);
}