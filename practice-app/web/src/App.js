import React from 'react'
import Events from "./screens/Events";
import EventPage from "./screens/EventPage";
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
import {Divider, makeStyles, ListItemIcon, ListItemText} from "@material-ui/core";
import SportsIcon from '@material-ui/icons/Sports';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

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
    const history = useHistory();

    return (
    <React.Fragment className="App">
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
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
        </Drawer>
        <Router>
            <Switch>
                <Redirect exact from="/" to="/events"/>}
                <Route path={'/events'} component={Events}/>
                <Route path={'/event/:id'} component={EventPage}/>
            </Switch>
        </Router>
    </React.Fragment>
    );
}

export default App;
