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

export default function MapWithMarker() {
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    const centerValue = {
        lat:41.0082,
        lng:28.9784
    }
    const [location, setLocation] = useState(null);
    const [locationText, setLocationText] = useState("");
    const [locations, setLocations] = React.useState([{}]);
    const [position, setPosition] = useState(centerValue);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setPosition(marker.getLatLng())
                }
            },
        }),
        [],
    )

    function SetViewOnClick({ coords }) {
        const map = useMap();
        map.setView(coords, map.getZoom());
        console.log(position)
        return null;
    }
    const handleLocationSearch = (event,inputQuery) => {
        setLocationText(inputQuery)
        if(inputQuery&&inputQuery.length>=3){
            getLocationMatches(inputQuery).then(results=> {
                    setLocations(results)
                }
            )
        }
        else{
            setLocations([])
        }
    }
    const selectLocation = (input) => {
        let coords = {lat:input.lat, lng:input.lng}
        setPosition(coords)
    }
    return (
        <div>
        <Autocomplete
            value={location}
            inputValue={locationText}
            options={locations}
            getOptionLabel={d=>d.name ||""}
            filterOptions={(x)=>x}
            onChange={(event, value) =>value ? selectLocation(value) : selectLocation(event.target.value)}
            onInputChange={handleLocationSearch}
            renderInput={params => {
                return (
                    <TextField  {...params} id="location" fullWidth label="Event Location" placeholder="Search for city, district, street..." size="small" variant="outlined"
                            style={{marginTop: 10, marginBottom: 10}} value={locationText|""}></TextField>
                )}} />
        <div id="map">
        <MapContainer style={{width: "100%", height: "70vh"}} center={centerValue} zoom={13}
                      scrollWheelZoom={false} attributionControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={position}
                draggable={"true"}
                ref={markerRef}
                eventHandlers={eventHandlers}>
                <SetViewOnClick coords={position}/>
            </Marker>
        </MapContainer>
    </div>
        </div>);
}