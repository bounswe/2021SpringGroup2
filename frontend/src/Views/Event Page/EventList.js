import React, {useState, useEffect} from 'react'
import Container from "@mui/material/Container";
import {useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {createStyles, makeStyles, styled} from "@mui/styles";
import Paper from "@mui/material/Paper";


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const useStyles = makeStyles(theme => createStyles({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    fav: {
        color: theme.palette.warning.light,
        fontsize: 20,
    },
    other: {
        color: theme.palette.secondary.light,
        fontsize: 20,
    },
    info: {
        color: theme.palette.primary.light,
        fontsize: 20,
    },
    infotext: {
        color: theme.palette.secondary.light,
        fontsize: 20,
    },



    appBar: {
        backgroundColor: "#fff"
    },
    hero: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://penaltyfile.com/wp-content/uploads/2020/06/different-types-of-sports-June32020-1-min.jpg')`,
        height: "250px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: "4rem",
        [theme.breakpoints.down("sm")]: {
            height: 300,
            fontSize: "3em"
        }
    },
    blogsContainer: {
        paddingTop: theme.spacing(3)
    },
    blogTitle: {
        fontWeight: 800,
        paddingBottom: theme.spacing(3)
    },
    card: {
        maxWidth: "100%",
    },
    media: {
        height: 240
    },
    cardActions: {
        display: "flex",
        margin: "0 10px",
        justifyContent: "space-between"
    },
    author: {
        display: "flex"
    },
    paginationContainer: {
        display: "flex",
        justifyContent: "center"
    }
}));

const events = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "summary": "Object history",
    "type": "OrderedCollection",
    "totalItems": 2,
    "totalPages": 2,
    "orderedItems": [
        {
            "type": "Create",
            "actor": {
                "type": "Person",
                "name": "Sally"
            },
            "object": "/api/posts/1"
        },
        {
            "type": "Create",
            "actor": {
                "type": "Person",
                "name": "Sally"
            },
            "object": "/api/posts/2"
        }
    ]
}

// const classes = useStyles()
// const params = useParams()
// const [events, setEvent] = useState(events)

export default function EventList (){


    loading: true
    events: []

    
    const url = "";
    const response = fetch(url);
    const data = response.json();
    this.setState({events: data.results, loading: false})



    if(this.state.loading){
        return <div>Loading...</div>
    }
    if(!this.state.loading){
        return <div>There is no event.</div>
    }


    return(
        <div className='text-4xl'>

        {this.events.map(event => (
                <div>
                    {/*<AppBar className={classes.appBar} position="static" >*/}
                    {/*    <Toolbar>*/}
                    {/*        <Typography variant="h6" color="primary" >*/}
                    {/*            EVENTS*/}
                    {/*        </Typography>*/}
                    {/*    </Toolbar>*/}
                    {/*</AppBar>*/}
                    <Box className={classes.hero}>
                        <Box>EVENTS</Box>
                    </Box>
                    <h1>Hellooo</h1>


                    <Container>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.media}
                                            //image="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                                            title="Contemplative Reptile"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {events.object.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {events.object.content}
                                                Burda content var.
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                        </Grid>

                    </Container>
                </div>

                ))}
        </div>
    );



}
