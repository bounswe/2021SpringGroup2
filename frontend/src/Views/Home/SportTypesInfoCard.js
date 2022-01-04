import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";


export default function SportTypesInfoCard(props){
    console.log(props)
    return (
        <Card sx={{ maxWidth: 500 }}  style={{ background: '#dbf0f9',justifyContent: 'center',  flexDirection: 'column'}} align={"center"}>
            <CardActionArea align={"center"}>
                <CardContent>
                    <Typography gutterBottom align="center" variant="h5" component="div">
                        {props.eventSport}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
