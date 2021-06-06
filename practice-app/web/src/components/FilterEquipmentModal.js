import React, {useState} from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LocationPicker from "react-leaflet-location-picker";

const fields = [
    "Type",
    "Website Name",
    "Link"
]

export default function FilterEquipmentModal(props){
  const [filter, setFilter] = useState({})

  const pointMode = {
      banner: false,
      control: {
          values: filter["Location"]?(filter["Location"].split(",").length>1?[filter["Location"].split(",")]:[]):[],
          onClick: point =>setLocation(point),
          onRemove: point =>setLocation(undefined)
      }
  };
  const sendFilter = _=>{
      props.setFilter(filter)
      props.handleClose()
  }
  console.log(pointMode)
  const handleChange = e=>{
      const id = e.target.id
      const value = e.target.value
      const filters = {...filter}
      if(value === "")filters[""+id] = undefined
      else filters[""+id] = value
      setFilter(filters)
  }
  const setLocation = l=>{
      const filters = {...filter}
      filters["Location"] = l[0] + "," + l[1]
      setFilter(filters)
  }
  return (
      <React.Fragment>
          <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Choose Filters</DialogTitle>
              <DialogContent>
                  <DialogContentText>
                      You can choose filters to search equipments.
                  </DialogContentText>
                  <LocationPicker
                      pointMode={pointMode}
                      showInputs={false}
                      overlayAll={false}
                      useDynamic={false}
                  />
                  {
                      fields.map(field=>(
                          <TextField
                              key={field}
                              autoFocus
                              margin="dense"
                              id={field}
                              label={field}
                              InputLabelProps={{ shrink: true }}
                              type="string"
                              fullWidth
                              onChange={handleChange}
                              value={filter[field]}
                          />
                      ))
                  }
                  <TextField
                      autoFocus
                      margin="dense"
                      id={"Istanbul"}
                      label={"location"}
                      InputLabelProps={{ shrink: true }}
                      type="string"
                      fullWidth
                      onChange={handleChange}
                      value={filter["location"]}
                  />
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
  // TODO (@Bikem): Remove .map's and define text fields one by one.

}
