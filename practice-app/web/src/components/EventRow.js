import React from 'react'
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

export default function EventRow(event){

    return(
        <React.Fragment>
            <TableRow key={event.title} onClick={event.onClick}>
                <TableCell component="th" scope="row">
                    {event.owner}
                </TableCell>
                <TableCell align="right">{event.sport}</TableCell>
                <TableCell align="right">{event.location}</TableCell>
                <TableCell align="right">{event.players.length}/{event.playerCapacity}</TableCell>
                <TableCell align="right">{event.spectators.length}/{event.spectatorCapacity}</TableCell>
                <TableCell align="right">{event.date} {event.hours}</TableCell>
            </TableRow>
        </React.Fragment>
    )
}