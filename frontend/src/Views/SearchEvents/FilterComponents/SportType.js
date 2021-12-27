import React, {useState, useEffect} from 'react'
import Typography from "@mui/material/Typography";
import Slider from '@mui/material/Slider';
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {getSports} from '../../Controllers/SportsController';


export default function SportType(props){
    const handleChange = (event, newValue) => {
        props.setValue(props.ids)(newValue)
    };

    const [sport, setSport] = useState([{}])

    // const getSportInfo = sport => console.log(sport) || getSports()
    //     .then(sports=>sports.find(s=>s.title===sport))

    // useEffect(() => {
    //     fetch("http://34.68.66.109/api/posts/"+eventid+"/")
    //         .then(r=>r.json())
    //         .then(r=>setEvent(r)||r)
    //         .then(r=>getSportInfo(r.object.eventSport))
    //         //.then(r=>getSportInfo("Tennis"))
    //         .then(setSport)
    // }, []);
    useEffect(() => {
        getSports(r=>r.object.eventSport)
            .then(setSport)
    }, [])

    return(
        <React.Fragment>
            <Typography variant="body1">
                Sport Types
            </Typography>
            <FormControl fullWidth>
                <Select
                    getAriaLabel={() => 'Sport Types'}
                    value={props.id}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                >
                    <MenuItem value={10}>Tennis</MenuItem>
                    <MenuItem value={20}>Football</MenuItem>
                    <MenuItem value={30}>Basketball</MenuItem>
                </Select>
            </FormControl>
        </React.Fragment>
    )
}
