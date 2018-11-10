import React, { Component } from "react";
import { connect } from "react-redux";
import { I18n } from "react-i18next";
import { triggerMapUpdate, setStateValues } from "../actions/index";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import ListSubheader from "@material-ui/core/ListSubheader";

import { returnImage, layerSelector } from "../utils/displayUtils";

import Footer from "./Footer.js"

import "./App.css";

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


class MyDrawer extends Component {
  constructor(props) {
    super(props);

    // Get all visible layers to set the checkboxes
    var filtered = Object.keys(props.visibility).filter(function (key) {
      return props.visibility[key]
    });

    this.state = {

      visibility: props.visibility,
      list1Open: false,
      listLoisirOpen: false,
      listAgendaOpen: false,
      checked: filtered,

    };
  }


  handleDrawerClose = () => {
    this.props.open = false;
    // this.setState({ open: false });
  };

  handleClick = () => {
    this.setState(state => ({ list1Open: !state.list1Open }));
  };

  handleClickLoisirOpen = () => {
    this.setState(state => ({ listLoisirOpen: !state.listLoisirOpen }));
  };

  handleClickListAgendaOpen = () => {
    this.setState((state) => ({ listAgendaOpen: !state.listAgendaOpen }));
  };

  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    let visibilityTemp = { ...this.props.visibility };
    if (currentIndex === -1) {
      newChecked.push(value);
      visibilityTemp = { ...this.props.visibility, [value]: true };
    } else {
      newChecked.splice(currentIndex, 1);
      visibilityTemp = { ...this.props.visibility, [value]: false };
    }
    this.setState({
      checked: newChecked,
    });

    this.props.setStateValues({
      toggleLayerVisibility: layerSelector[value].source,
      visibility: visibilityTemp,
      needMapToggleLayer: true
    });
    this.props.triggerMapUpdate();
  };

  render() {
    const { classes } = this.props;
    return (
      <I18n ns="translations">
        {
          (t) => (
            <React.Fragment>
              <div className={classes.root}>
                {/* <MyAppBar open={this.state.open} handleDrawerOpen={this.handleDrawerOpen} /> */}
                
                <Drawer variant="persistent" anchor='left' classes={{ paper: classNames(classes.drawerPaper, !this.props.open && classes.drawerPaperClose) }} open={this.props.open}>
                  <div className={classes.toolbarIcon}>
                    <IconButton onClick={ () => this.props.handleDrawerClose()} aria-label="Close drawer">
                      <ChevronLeftIcon />
                    </IconButton>
                  </div>
                  <Divider />
                  <ListItem button onClick={this.handleClick} aria-label="Open Culture et Patrimoine" id="ButtonCultureHeritage">
                    <ListSubheader style={{ color: "black", fontSize: "16px" }} title={t("drawer.main1Title")}> {t("drawer.main1")} </ListSubheader>
                    {this.state.list1Open ? <ExpandLess className={classes.expandIcons} /> : <ExpandMore className={classes.expandIcons} />}
                  </ListItem>
                  <Collapse in={this.state.list1Open} timeout="auto" unmountOnExit className={classes.collapses}>
                    <List>
                      {["Villages", "Unesco", "Museum", "Jardins", "GSF", "MN"].map((value, index) => (
                        <ListItem key={value} role={undefined} dense button className={classes.listItemStyle} title={t("drawer." + value + "Title")} onClick={this.handleToggle.bind(this, value)}>
                          <Checkbox
                            checked={this.state.checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={t("drawer." + value)} />
                          <ListItemSecondaryAction className={classes.listItemStyle}>
                            {returnImage(layerSelector[value].source)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider light />
                  <ListItem button onClick={this.handleClickLoisirOpen} aria-label="Open Loisirs et Artisanat" id="ButtonLoisir">
                    <ListSubheader title={t("drawer.main2")} style={{ color: "black", fontSize: "16px" }}>{t("drawer.main2")}</ListSubheader>
                    {this.state.listLoisirOpen ? <ExpandLess className={classes.expandIcons} /> : <ExpandMore className={classes.expandIcons} />}
                  </ListItem>
                  <Collapse in={this.state.listLoisirOpen} timeout="auto" unmountOnExit className={classes.collapses}>
                    <List>
                      {["LocalProdShop", "CraftmanShop", "WineCelar", "Marches", "VidesGreniers", "OTFrance"].map((value) => (
                        <ListItem key={value} role={undefined} dense button className={classes.listItemStyle} title={t("drawer." + value + "Title")} onClick={this.handleToggle.bind(this, value)}>
                          <Checkbox
                            checked={this.state.checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={t("drawer." + value)} />
                          <ListItemSecondaryAction className={classes.listItemStyle}>
                            {returnImage(layerSelector[value].source)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>

                  <Divider light />
                  <ListItem button onClick={this.handleClickListAgendaOpen} aria-label="Open Agenda" id="ButtonAgenda" style={{ backgroundColor: "white" }}>
                    <ListSubheader title={t("drawer.main3")} style={{ color: "black", fontSize: "16px" }}>{t("drawer.main3")}</ListSubheader>
                    {this.state.listAgendaOpen ? <ExpandLess className={classes.expandIcons} /> : <ExpandMore className={classes.expandIcons} />}
                  </ListItem>
                  <Collapse in={this.state.listAgendaOpen} timeout="auto" unmountOnExit className={classes.collapses}>
                    <List>
                      {["ParcsJardins", "Exposition", "Musique", "Children"].map((value) => (
                        <ListItem key={value} role={undefined} dense button className={classes.listItemStyle} title={t("drawer." + value + "Title")} onClick={this.handleToggle.bind(this, value)}>
                          <Checkbox
                            checked={this.state.checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={t("drawer." + value)} />
                          <ListItemSecondaryAction className={classes.listItemStyle}>
                            {returnImage(layerSelector[value].source)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider />
                  <Footer />
                </Drawer>
              </div>
            </React.Fragment>)
        }
      </I18n>
    );
  }
}

MyDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  setStateValues: PropTypes.func,
  toggleLayerVisibility: PropTypes.string,
  triggerMapUpdate: PropTypes.func,
  visibility: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    toggleLayerVisibility: state.app.toggleLayerVisibility,
    visibility: state.app.visibility
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStateValues: (obj) => dispatch(setStateValues(obj)),
    triggerMapUpdate: (v) => dispatch(triggerMapUpdate(v))
  };
};

export { MyDrawer };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyDrawer));

