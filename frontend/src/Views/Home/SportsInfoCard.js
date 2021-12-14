import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";


export default function SportsInfoCard(props){
    return (
        <Card sx={{ maxWidth: 345 }}  style={{ background: '#dbf0f9',justifyContent: 'center',  flexDirection: 'column'}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={props.img}
                    alt={props.title}
                />
                <CardContent>
                    <Typography gutterBottom align="center" variant="h5" component="div">
                        {props.title}
                    </Typography>
                    <Typography align="justify" variant="body2" color="text.secondary">
                        {props.desc}
                    </Typography>

                </CardContent>
            </CardActionArea>
            <Button fullWidth style={{margin:"8px 0",padding:"auto"}}>
                {"See " + props.title + " events"}
            </Button>
        </Card>
    );
}