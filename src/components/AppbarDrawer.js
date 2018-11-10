import React, { Component } from "react";
import { connect } from "react-redux";
import { I18n } from "react-i18next";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MyAppBar from "./AppBar";
import "./App.css";

// import MyDrawer from "./MyDrawer";
const MyDrawer = React.lazy(() => import("./MyDrawer"));

const drawerWidth = 270;

const styles = (theme) => ({

    root: {
        float: "left"
    },

    toolbarIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },

    appBar: {
        position: "absolute",
    },

    title: {
        flexGrow: 0
    },

    drawerPaper: {
        // height: "100vh",
        minHeight: "100vh",
        position: "absolut",
        top: "0",
        left: "0",
        whiteSpace: "nowrap",
        display: "flex",
        paddingBottom: "100px",
        width: drawerWidth,
        overflowX: "hidden",
        overflowY: "auto",
        "&:hover": {
            overflowY: "auto",
        },
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },
    drawerPaperClose: {
        overflowX: "hidden",
        width: 0,
    },
    collapses: {
        overflowY: "auto",
    },

    icon: {
        width: 25,
        color: "#ff0000",
    },

    expandIcons: {
        position: "absolute",
        right: "12px"
    },

    listItemStyle: {
        cursor: "default",
    },

});


class AppbarDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {

            open: false, // (window.innerWidth > 412), // true if windowSize > 412 (Drawer opened per Default)

        };
    }


    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <I18n ns="translations">
                {
                    (t) => (
                        <React.Fragment>
                            <div className={classes.root}>
                                <MyAppBar open={this.state.open} handleDrawerOpen={this.handleDrawerOpen} />
                                <React.Suspense fallback={<div> Loading Marvelous Drawer...</div>}>
                                    <MyDrawer open={this.state.open} handleDrawerClose={this.handleDrawerClose}/>
                                </React.Suspense>
                            </div>
                        </React.Fragment>)
                }
            </I18n>
        );
    }
}

AppbarDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    dateFrom: PropTypes.number,
    dateTo: PropTypes.number,
};

const mapStateToProps = (state) => {
    return {
        dateFrom: state.app.dateFrom,
        dateTo: state.app.dateTo,
    };
};


export { AppbarDrawer };

export default connect(mapStateToProps)(withStyles(styles)(AppbarDrawer));