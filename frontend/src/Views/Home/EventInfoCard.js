import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";


export default function EventInfoCard(props){
    return (
        <Card sx={{ maxWidth: 500 }}  style={{ background: '#dbf0f9',justifyContent: 'center',  flexDirection: 'column'}} align={"center"}>
            <CardActionArea align={"center"}>
                <CardMedia
                    component="img"
                    height="400"
                    image={props.img}
                    alt={props.title}
                />
                {/*<CardContent>*/}
                {/*    <Typography gutterBottom align="center" variant="h5" component="div">*/}
                {/*        {props.title}*/}
                {/*    </Typography>*/}
                {/*</CardContent>*/}
            </CardActionArea>
        </Card>
    );
}
