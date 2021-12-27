import React, {useState, useEffect} from 'react'
import Typography from "@mui/material/Typography";
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {getSports, getSportsList} from '../../../Controllers/SportsController';


export default function SportType(props){

    const handleChange = (event, newValue) => {
        props.setValue(props.ids)(newValue)
    };

    const [sportTypes, setSportTypes] = useState([{}])

    useEffect(_=>{
        getSportsList()
            .then(r=>setSportTypes(r))
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
                    <div>
                        {sportTypes.map((type)=>(<MenuItem>{type.label}</MenuItem>))}
                    </div>
                </Select>
            </FormControl>

        </React.Fragment>
    )
}
