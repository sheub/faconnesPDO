import React, { Component } from "react";
import { translate } from "react-i18next";

import classNames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import LanguageIcon from "@material-ui/icons/Language";

import "./css/App.css";
import "./css/mdIcons.css";

const styles = (theme) => ({

    root: {
        flexGrow: 1,
    },
    // grow: {
    //     flexGrow: 1,
    // },

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
        flexGrow: 1
    },
    icon: {
        width: 25
    },

});

const drawerWidth = 270;
class MyAppBar extends Component {
    state = {
        anchorEl: null,
    };

    handleDrawerOpen = () => {
        this.props.handleDrawerOpen();
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { open, classes } = this.props;
        const { anchorEl } = this.state;
        const openMenu = Boolean(anchorEl);
        const { t, i18n } = this.props;

        const changeLanguage = (lng) => {
            this.setState({ anchorEl: null });
            i18n.changeLanguage(lng);
        }
        return (

            <div className={classes.root}>

                <CssBaseline />
                {/* ref={elem => (this.AppBar = elem)} */}
                <AppBar position="absolute" className={classNames(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar disableGutters={!open}>
                        <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerOpen} className={classNames(classes.menuButton, open && classes.menuButtonHidden)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" noWrap className={classes.title}>
                            {t("title")}
                        </Typography>
                        <div>
                            <IconButton
                                aria-owns={open ? "menu-appbar" : null}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <LanguageIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={openMenu}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={() => changeLanguage("en")}>en</MenuItem>
                                <MenuItem onClick={() => changeLanguage("fr")}>fr</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
export default withStyles(styles)(translate("translations")(MyAppBar));