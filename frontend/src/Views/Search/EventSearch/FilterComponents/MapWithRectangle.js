import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'
import {MapContainer, TileLayer, Marker, CircleMarker, useMap, Rectangle, FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw'
import * as React from "react";
import {useEffect, useMemo, useRef, useState} from "react";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {Autocomplete} from "@mui/lab";
import {TextField} from "@mui/material";
import {getLocationBoundaryBoxes} from "../../../../Controllers/GeocodingController";
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

    const [drawOptions, setDrawOptions] = useState({
        marker: false,
        circle: false,
        rectangle: true,
        polygon: false,
        polyline: false,
        circlemarker: false
    })

    useEffect(()=>{
        if(props.bottomLeft!==null&&props.topRight!==null){
            props.setCenter(
                {lat:(props.bottomLeft.lat+props.topRight.lat)/2,
                    lng:(props.bottomLeft.lng+props.topRight.lng)/2}
            )
        }
    },[props.bottomLeft,props.topRight])
    useEffect(()=>{
        if(props.center===null&&(props.bottomLeft===null||props.topRight===null)){
            props.setCenter(centerValue)
        }
    })
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
        props.setCenter(
                {lat:(bottomLeft.lat+topRight.lat)/2,
                    lng:(bottomLeft.lng+topRight.lng)/2}
            )
    }
    const _onCreated = e =>{
        props.setBottomLeft(
            {lat:e.layer._bounds._southWest.lat,lng:e.layer._bounds._southWest.lng})
        props.setTopRight(
            {lat:e.layer._bounds._northEast.lat,lng:e.layer._bounds._northEast.lng})
        setDrawOptions({
            marker: false,
            circle: false,
            rectangle: false,
            polygon: false,
            polyline: false,
            circlemarker: false
        })
    }
    const _onEdited = e => {
        for(let key in e.layers._layers){
            let drawing = e.layers._layers[key]
            props.setBottomLeft(
                {lat:drawing._bounds._southWest.lat,lng:drawing._bounds._southWest.lng})
            props.setTopRight(
                {lat:drawing._bounds._northEast.lat,lng:drawing._bounds._northEast.lng})
        }
    }
    const _onDelete = (e) => {
        props.setTopRight(null)
        props.setBottomLeft(null)
        setDrawOptions({
            marker: false,
            circle: false,
            rectangle: true,
            polygon: false,
            polyline: false,
            circlemarker: false
        })
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
                    <FeatureGroup>
                        <EditControl
                            position="topright"
                            onEdited={_onEdited}
                            onCreated={_onCreated}
                            onDeleted={_onDelete}
                            draw={drawOptions}
                        />
                        <SetViewOnClick coords={props.center}/>

                    </FeatureGroup>

                </MapContainer>
            </div>
        </div>);
}
