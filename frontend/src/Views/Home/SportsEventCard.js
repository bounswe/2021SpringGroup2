import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";


export default function EventInfo(props){
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={props.img}
                    alt={props.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.desc}
                    </Typography>
                    <Button>
                        {"See " + props.title + " events"}
                    </Button>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
