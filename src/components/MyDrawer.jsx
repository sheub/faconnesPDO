import React, { Component } from "react";
import { connect } from "react-redux";
import { I18n } from "react-i18next";
import { triggerMapUpdate, setStateValue, setStateValues } from "../actions/index";
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
import Typography from "@material-ui/core/Typography";

import { returnImage, layerSelector } from "../utils/displayUtils";
import MyDatePicker from "./MyDatePicker";
import Footer from "./Footer.js";

import "./App.css";
const ProfilePage = React.lazy(() => import("./ProfilePage.js"));

// const drawerWidth = 270;
const drawerWidth = (window.innerWidth > 340) ? 320 : window.innerWidth;

const styles = theme => ({
  root: {
    float: "left",
  },

  toolbarIcon: {
    // backgroundColor: "#EE2A39",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },

  drawerPaper: {
    height: "auto",
    minHeight: "100vh",
    position: "absolute",
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
    // overflowY: "auto",
  },

  expandIcons: {
    position: "absolute",
    right: "12px",
  },

  listItemStyle: {
    cursor: "default",
  },

  fontStyle: {
    // fontFamily: "Caslon",
    fontVariant: "small-caps",
    paddingLeft: "24px",
    marginBottom: "6px",
    marginTop: "8px",
    cursor: "default",
    display: "inline-block",
  },

  datePickerBackground: {
    backgroundColor: "#E5E5E5",
    marginBottom: "12px",
  },
});

class MyDrawer extends Component {
  constructor(props) {
    super(props);

    // Get all visible layers to set the checkboxes
    var filtered = Object.keys(props.visibility).filter(function(key) {
      return props.visibility[key];
    });

    this.state = {
      visibility: props.visibility,
      list1Open: false,
      listLoisirOpen: false,
      listAgendaOpen: false,
      listUsefullOpen: false,
      checked: filtered,
      dateFrom: new Date(), //Today
      dateTo: new Date(), // Today plus one day
      showProfilePage: false,
    };

    this._onClickProfilePage = this._onClickProfilePage.bind(this);
  }

  _onClickProfilePage() {
    if (!this.state.showProfilePage) {
      this.setState({ showProfilePage: true });
    } else {
      this.setState({ showProfilePage: false });
    }
  }

  handleClose = () => {
    this.setState({
      showProfilePage: false
    });
  };

  handleDateChange = date => {
    let tempDate = this.state.dateTo;
    if (this.state.dateTo < date) {
      this.setState({
        dateFrom: date,
        dateTo: date
      });
      tempDate = date;
    } else {
      this.setState({ dateFrom: date });
    }

    this.props.setStateValues({
      dateFrom: Date.parse(date),
      dateTo: Date.parse(tempDate),
      needMapFilterByDate: true
    });

    this.props.triggerMapUpdate();
  };

  handleDateToChange = date => {
    this.setState({ dateTo: date });

    this.props.setStateValues({
      dateFrom: Date.parse(this.state.dateFrom),
      dateTo: Date.parse(date),
      needMapFilterByDate: true
    });
    this.props.triggerMapUpdate();
  };

  handleDrawerClose = () => {
    this.props.open = false;
    this.props.setDrawerState(false);
  };

  handleClick = () => {
    this.setState(state => ({ list1Open: !state.list1Open }));
  };

  handleClickLoisirOpen = () => {
    this.setState(state => ({ listLoisirOpen: !state.listLoisirOpen }));
  };

  handleClickListAgendaOpen = () => {
    this.setState(state => ({ listAgendaOpen: !state.listAgendaOpen }));
  };

  handleClickListUsefullOpen = () => {
    this.setState(state => ({ listUsefullOpen: !state.listUsefullOpen }));
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
      checked: newChecked
    });

    this.props.setStateValues({
      toggleLayerVisibility: layerSelector[value].source,
      visibility: visibilityTemp,
      needMapToggleLayer: true
    });
    this.props.triggerMapUpdate();
  }

  render() {
    const { classes, i18n } = this.props;
    return (
      <div>
        <I18n ns="translations">
          {t => (
            <React.Fragment>
              <div className={classes.root}>
                <Drawer
                  variant="persistent"
                  anchor="left"
                  classes={{
                    paper: classNames(
                      classes.drawerPaper,
                      !this.props.drawerOpen && classes.drawerPaperClose
                    )
                  }}
                  open={this.props.drawerOpen}
                >
                  <div className={classes.toolbarIcon}>
                    <IconButton
                      onClick={() => this.props.handleDrawerClose()}
                      aria-label="Close drawer"
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                  </div>
                  <Divider />
                  <Typography variant="h6" className={classes.fontStyle}>
                    {" "}
                    {t("drawer.FilterByDate")}
                  </Typography>
                  <div className={classes.datePickerBackground}>
                    <MyDatePicker
                      t={t}
                      i18n={i18n}
                      state={this.state}
                      dateChange={this.handleDateChange.bind(this)}
                      dateToChange={this.handleDateToChange.bind(this)}
                    />
                  </div>

                  <Typography variant="h6" className={classes.fontStyle}>
                    {" "}
                    {t("drawer.SelectCategories")}
                  </Typography>
                  <Divider />

                  <ListItem
                    button
                    onClick={this.handleClick}
                    aria-label="Open Culture et Patrimoine"
                    id="ButtonCultureHeritage"
                  >
                    <ListSubheader
                      style={{ color: "black", fontSize: "16px" }}
                      title={t("drawer.main1Title")}
                    >
                      {" "}
                      {t("drawer.main1")}{" "}
                    </ListSubheader>
                    {this.state.list1Open ? (
                      <ExpandLess className={classes.expandIcons} />
                    ) : (
                      <ExpandMore className={classes.expandIcons} />
                    )}
                  </ListItem>
                  <Collapse
                    in={this.state.list1Open}
                    timeout="auto"
                    unmountOnExit
                    className={classes.collapses}
                  >
                    <List>
                      {[
                        "Villages",
                        "Unesco",
                        "Museum",
                        "Jardins",
                        "GSF",
                        "MN"
                      ].map((value, index) => (
                        <ListItem
                          key={value}
                          role={undefined}
                          dense
                          button
                          className={classes.listItemStyle}
                          title={t("drawer." + value + "Title")}
                          onClick={this.handleToggle.bind(this, value)}
                        >
                          <Checkbox
                            checked={this.state.checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={t("drawer." + value)} />
                          <ListItemSecondaryAction
                            className={classes.listItemStyle}
                          >
                            {returnImage(layerSelector[value].source)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider light />

                  <ListItem
                    button
                    onClick={this.handleClickLoisirOpen}
                    aria-label="Open Loisirs et Artisanat"
                    id="ButtonLoisir"
                  >
                    <ListSubheader
                      title={t("drawer.main2")}
                      style={{ color: "black", fontSize: "16px" }}
                    >
                      {t("drawer.main2")}
                    </ListSubheader>
                    {this.state.listLoisirOpen ? (
                      <ExpandLess className={classes.expandIcons} />
                    ) : (
                      <ExpandMore className={classes.expandIcons} />
                    )}
                  </ListItem>
                  <Collapse
                    in={this.state.listLoisirOpen}
                    timeout="auto"
                    unmountOnExit
                    className={classes.collapses}
                  >
                    <List>
                      {[
                        "LocalProdShop",
                        "CraftmanShop",
                        "WineCelar",
                        "Marches",
                        "VidesGreniers",
                        "OTFrance"
                      ].map(value => (
                        <ListItem
                          key={value}
                          role={undefined}
                          dense
                          button
                          className={classes.listItemStyle}
                          title={t("drawer." + value + "Title")}
                          onClick={this.handleToggle.bind(this, value)}
                        >
                          <Checkbox
                            checked={this.state.checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={t("drawer." + value)} />
                          <ListItemSecondaryAction
                            className={classes.listItemStyle}
                          >
                            {returnImage(layerSelector[value].source)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider light />

                  <ListItem
                    button
                    onClick={this.handleClickListAgendaOpen}
                    aria-label="Open Agenda"
                    id="ButtonAgenda"
                    style={{ backgroundColor: "white" }}
                  >
                    <ListSubheader
                      title={t("drawer.main3")}
                      style={{ color: "black", fontSize: "16px" }}
                    >
                      {t("drawer.main3")}
                    </ListSubheader>
                    {this.state.listAgendaOpen ? (
                      <ExpandLess className={classes.expandIcons} />
                    ) : (
                      <ExpandMore className={classes.expandIcons} />
                    )}
                  </ListItem>
                  <Collapse
                    in={this.state.listAgendaOpen}
                    timeout="auto"
                    unmountOnExit
                    className={classes.collapses}
                  >
                    <List>
                      {[
                        "ParcsJardins",
                        "AiresJeux",
                        "Exposition",
                        "Musique",
                        "Children"
                      ].map(value => (
                        <ListItem
                          key={value}
                          role={undefined}
                          dense
                          button
                          className={classes.listItemStyle}
                          title={t("drawer." + value + "Title")}
                          onClick={this.handleToggle.bind(this, value)}
                        >
                          <Checkbox
                            checked={this.state.checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={t("drawer." + value)} />
                          <ListItemSecondaryAction
                            className={classes.listItemStyle}
                          >
                            {returnImage(layerSelector[value].source)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider />

                  <ListItem
                    button
                    onClick={this.handleClickListUsefullOpen}
                    aria-label="Open Usefull facts"
                    id="Button"
                    style={{ backgroundColor: "white" }}
                  >
                    <ListSubheader
                      title={t("drawer.main4")}
                      style={{ color: "black", fontSize: "16px" }}
                    >
                      {t("drawer.main4")}
                    </ListSubheader>
                    {this.state.listUsefullOpen ? (
                      <ExpandLess className={classes.expandIcons} />
                    ) : (
                      <ExpandMore className={classes.expandIcons} />
                    )}
                  </ListItem>
                  <Collapse
                    in={this.state.listUsefullOpen}
                    timeout="auto"
                    unmountOnExit
                    className={classes.collapses}
                  >
                    <List>
                      {["Toilets", "Baignades"].map(value => (
                        <ListItem
                          key={value}
                          role={undefined}
                          dense
                          button
                          className={classes.listItemStyle}
                          title={t("drawer." + value + "Title")}
                          onClick={this.handleToggle.bind(this, value)}
                        >
                          <Checkbox
                            checked={this.state.checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText primary={t("drawer." + value)} />
                          <ListItemSecondaryAction
                            className={classes.listItemStyle}
                          >
                            {returnImage(layerSelector[value].source)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider />

                  <div>
                    <Typography onClick={() => this._onClickProfilePage()}>
                      {" "}
                      My Profile
                    </Typography>
                  </div>
                  {this.state.showProfilePage ? (
                    <React.Suspense fallback={<div> </div>}>
                      <ProfilePage handleClose={this.handleClose} />
                    </React.Suspense>
                  ) : null}

                  <Footer />
                </Drawer>
              </div>
            </React.Fragment>
          )}
        </I18n>
        {this.state.ProfilePageFormVisible ? (
          <React.Suspense fallback={<div> </div>}>
            <ProfilePage handleClose={this.handleClose} />
          </React.Suspense>
        ) : null}
      </div>
    );
  }
}

MyDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  setStateValues: PropTypes.func,
  toggleLayerVisibility: PropTypes.string,
  triggerMapUpdate: PropTypes.func,
  visibility: PropTypes.object,
  drawerOpen: PropTypes.bool,
  setDrawerState: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    toggleLayerVisibility: state.app.toggleLayerVisibility,
    visibility: state.app.visibility,
    drawerOpen: state.app.drawerOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setStateValues: obj => dispatch(setStateValues(obj)),
    triggerMapUpdate: v => dispatch(triggerMapUpdate(v)),
    setDrawerState: drawerOpen => dispatch(setStateValue("drawerOpen", drawerOpen)),
  };
};

export { MyDrawer };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MyDrawer));
