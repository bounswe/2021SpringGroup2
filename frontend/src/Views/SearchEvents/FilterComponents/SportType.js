import React, {useState, useEffect} from 'react'
import Typography from "@mui/material/Typography";
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {getSports, getSportsList} from '../../../Controllers/SportsController';
import {Autocomplete} from "@mui/lab";
import {Grid, TextField} from "@mui/material";
import {checkIfNumber} from "../../Create Event/CreateEventPage";
const initialState = {
    title: {
        value: "",
        changed: false,
        error: undefined
    }
}

export default function SportType(props){
    const [options, setOptions] = React.useState([{}]);
    const [inputs, setInputs] = useState(initialState)
    const textFieldStyle = {backgroundColor: 'white', marginTop: 10, marginBottom: 10}
    const [sportTypes, setSportTypes] = React.useState("");
    const getValue = inputs => ({
        title: inputs.title.value
    })
    const handleChange = e=>{
        const newInputs = {...inputs}
        const value = getValue(newInputs)
        value[e.target.id] = e.target.value
        setInputs(newInputs)
    }

    useEffect(_=>{
        getSportsList().then(r=>setOptions([""].concat(r.sort(function (a, b) {
            return a.label.localeCompare(b.label);})
        ))).catch(console.log)
    }, [])

    return(
        <React.Fragment>
            <Typography variant="body1">
                Sport Types
            </Typography>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    value={sportTypes}
                    options={options}
                    onChange={(event, value) =>value ? setSportTypes(value.label) : setSportTypes(event.target.value)}
                    renderInput={params => {
                        return (
                            <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                style={textFieldStyle}
                            />
                        )}}/>

            </Grid>
            {/*<FormControl fullWidth>*/}
            {/*    <Select*/}
            {/*        getAriaLabel={() => 'Sport Types'}*/}
            {/*        value={props[props.id]}*/}
            {/*        onChange={handleChange}*/}
            {/*        valueLabelDisplay="auto"*/}

            {/*    >*/}
            {/*        <div>*/}
            {/*            {sportTypes.map((type)=>(<MenuItem>{type.label}</MenuItem>))}*/}
            {/*        </div>*/}
            {/*    </Select>*/}
            {/*</FormControl>*/}

        </React.Fragment>
    )
}
