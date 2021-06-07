import React, {useEffect, useState} from 'react'
import Container from "@material-ui/core/Container";
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import EventRow from '../components/EventRow'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {useHistory} from "react-router-dom";
import FilterEventModal from "../components/FilterEventModal";
import TextField from "@material-ui/core/TextField";

const equipments = [
  {
		"postId": 1,
		"ownerId": 1,
		"content": "A nice ball",
		"title": "Well-conditioned ball",
		"creationDate": "29.05.2021",
		"lastUpdateDate": "29.05.2021",
		"numberOfClicks": 1,
		"location": "İstanbul",
		"equipmentType": "Ball",
		"websiteName": "ismycomputeron",
		"link": "www.ismycomputeron.com"
	}
]

const fields = [
    "Type",
    "Website Name",
    "Link"
]

export default function CreateEquipment() {
    return (
        <React.Fragment>
            <Container maxWidth={"md"}>
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
                        />
                    ))
                }
            </Container>
        </React.Fragment>
    );
}
