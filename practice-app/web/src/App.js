import React, {useEffect, useState} from 'react'
import Events from "./screens/Events";
import EventPage from "./screens/EventPage";
import Equipments from "./screens/Equipments";
import EquipmentPage from "./screens/EquipmentPage";
import {
    Route,
    Switch,
    BrowserRouter as Router,
    Redirect,
    useHistory
} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {Divider, makeStyles, ListItemIcon, ListItemText, IconButton} from "@material-ui/core";
import SportsIcon from '@material-ui/icons/Sports';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';
import CreateEvent from "./screens/CreateEvent";
import CreateEquipment from "./screens/CreateEquipment";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));

function App() {
    const classes = useStyles()
    const [open, setOpen] = useState(false)

    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    return (
    <React.Fragment>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={_=>setOpen(true)}
            edge="start"
            style={{
                left:5,
                top:5
            }}
        >
            <MenuIcon />
        </IconButton>
        <Drawer
            className={classes.drawer}
            open={open}
            onClose={_=>setOpen(false)}
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
            variant={width >= 1450?"permanent":null}
        >
            <List>
                <ListItem button onClick={_=>{document.location.href="/events"}}>
                    <ListItemIcon><SportsIcon/></ListItemIcon>
                    <ListItemText primary={"Events"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={_=>{document.location.href="/equipments"}}>
                    <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
                    <ListItemText primary={"Equipments"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={_=>{document.location.href="/create-event"}}>
                    <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
                    <ListItemText primary={"Create Event"}/>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={_=>{document.location.href="/create-equipment"}}>
                    <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
                    <ListItemText primary={"Create Equipment"} />
                </ListItem>
            </List>
        </Drawer>
        <Router>
            <Switch>
                <Redirect exact from="/" to="/events"/>}
                <Route path={'/events'} component={Events}/>
                <Route path={'/event/:id'} component={EventPage}/>
                <Route path={'/create-event'} component={CreateEvent}/>
                <Redirect exact from="/" to="/equipments"/>}
                <Route path={'/equipments'} component={Equipments}/>
                <Route path={'/equipment/:id'} component={EquipmentPage}/>
                <Route path={'/create-equipment'} component={CreateEquipment}/>
            </Switch>
        </Router>
    </React.Fragment>
    );
}

export default App;
