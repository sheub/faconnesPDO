import React, { Component } from "react";
import classNames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./css/App.css";
import "./css/mdIcons.css";

const styles = (theme) => ({

    root: {
        display: "flex"
    },
    
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },

    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36
    },
    menuButtonHidden: {
        display: "none"
    },
    title: {
        flexGrow: 0
    },
    icon: {
        width: 25
    }
});

const drawerWidth = 270;
class MyAppBar extends Component{


    handleDrawerOpen = () => {
        this.props.handleDrawerOpen();
    };

    render() {
        const { open, classes } = this.props;
        return <div className={classes.root}>
            <CssBaseline />
            {/* ref={elem => (this.AppBar = elem)} */}
            <AppBar position="absolute" className={classNames(classes.appBar, open && classes.appBarShift)}> 
                <Toolbar disableGutters={!open} className={classes.toolbar}>
                    <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerOpen} className={classNames(classes.menuButton, open && classes.menuButtonHidden)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" align="right" color="inherit" noWrap className={classes.title}>
                        France découverte
                </Typography>
                </Toolbar>
            </AppBar>
        </div>
    }
}
export default withStyles(styles)(MyAppBar);