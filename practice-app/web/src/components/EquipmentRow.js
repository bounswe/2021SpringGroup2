import React from 'react'
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

export default function EquipmentRow(equipment){
    return(
        <React.Fragment>
            <TableRow key={equipment.postId} onClick={equipment.onClick}>
                <TableCell component="th" scope="row">
                    {equipment.equipmentType}
                </TableCell>
                <TableCell align="right">{equipment.content}</TableCell>
                <TableCell align="right">{equipment.location}</TableCell>
                <TableCell align="right">{equipment.websiteName}</TableCell>
                <TableCell align="right">{equipment.link}</TableCell>
            </TableRow>
        </React.Fragment>
    )
}
