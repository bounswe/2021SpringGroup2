import React, {useState} from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const fields = [
    "Age",
    "Location",
    "Location Range",
    "Gender",
    "Skill Level"
]

export default function FilterEventModal(props){
    const [filter, setFilter] = useState({})
    const sendFilter = _=>{
        props.setFilter(filter)
        props.handleClose()
    }
    const handleChange = e=>{
        const id = e.target.id
        const value = e.target.value
        const filters = {...filter}
        if(value === "")filters[""+id] = undefined
        else filters[""+id] = value
        setFilter(filters)
    }
    return (
        <React.Fragment>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Choose Filters</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can choose filters to search events.
                    </DialogContentText>

                    {
                        fields.map(field=>(
                            <TextField
                                key={field}
                                autoFocus
                                margin="dense"
                                id={field}
                                label={field}
                                type="string"
                                fullWidth
                                onChange={handleChange}
                                value={filter[field]}
                            />
                        ))
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={sendFilter} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}