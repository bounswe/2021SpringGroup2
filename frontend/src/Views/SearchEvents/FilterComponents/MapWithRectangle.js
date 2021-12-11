import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker, CircleMarker, useMap, Rectangle} from 'react-leaflet';
import * as React from "react";
import {useEffect, useMemo, useRef, useState} from "react";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {Autocomplete} from "@mui/lab";
import {TextField} from "@mui/material";
import {getLocationBoundaryBoxes} from "../../../Controllers/GeocodingController";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';

export default function MapWithRectangle(props) {
    let DefaultIcon = L.icon({
        iconUrl: icon,
        iconSize: new L.Point(15, 25),
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
    const markerBottomLeft = useRef(null);
    const markerTopRight = useRef(null);


    const [bounds, setBounds] = useState([
        [props.bottomLeft.lat,props.bottomLeft.lng],
        [props.topRight.lat,props.topRight.lng]
    ])

    useEffect(()=>{
        props.setCenter(
            {lat:(props.bottomLeft.lat+props.topRight.lat)/2,
                lng:(props.bottomLeft.lng+props.topRight.lng)/2}
        )
        updateRectangle(props.bottomLeft.lat,props.bottomLeft.lng,props.topRight.lat,props.topRight.lng)
    },[props.bottomLeft,props.topRight])

    const updateRectangle = (lat1,lng1,lat2,lng2) => {
        setBounds([
            [lat1,lng1],
            [lat2,lng2]
        ])
    }

    const eventHandlersBottomLeft = useMemo(
        () => ({
            dragend() {
                const marker = markerBottomLeft.current
                if (marker != null) {
                    let coords = marker.getLatLng()
                    props.setBottomLeft({lat:coords.lat,lng:coords.lng})
                }
            },
        }),
        [],
    )
    const eventHandlersTopRight = useMemo(
        () => ({
            dragend() {
                const marker = markerTopRight.current
                if (marker != null) {
                    let coords = marker.getLatLng()
                    props.setTopRight({lat:coords.lat,lng:coords.lng})
                }
            },
        }),
        [],
    )


    function SetViewOnClick({ coords }) {
        const map = useMap()
        map.setView(coords, map.getZoom());
        return null;
    }
    const handleLocationSearch = (event,inputQuery) => {
        setLocationText(inputQuery)
    }
    const handleSearch = () => {
        getLocationBoundaryBoxes(locationText).then(results=> {
                setLocations(results)
            }
        )
        setOptionsOpen(true)
    }
    const selectLocation = (input) => {
        setOptionsOpen(false)
        let bottomLeft = {lat:input.bottomLeft.lat, lng:input.bottomLeft.lng}
        let topRight = {lat:input.topRight.lat, lng:input.topRight.lng}
        props.setBottomLeft(bottomLeft)
        props.setTopRight(topRight)
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
                                <TextField  {...params} id="location" fullWidth label="Event Location" placeholder="Search for city, district, street..." size="small" variant="outlined"
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
                        position={props.bottomLeft}
                        draggable={"true"}
                        ref={markerBottomLeft}
                        eventHandlers={eventHandlersBottomLeft}>
                        <SetViewOnClick coords={props.center}/>
                    </Marker>
                    <Marker
                        position={props.topRight}
                        draggable={"true"}
                        ref={markerTopRight}
                        eventHandlers={eventHandlersTopRight}>
                        <SetViewOnClick coords={props.center}/>
                    </Marker>
                    <Rectangle bounds={bounds} pathOptions={{ color: 'black' }} />


                </MapContainer>
            </div>
        </div>);
}