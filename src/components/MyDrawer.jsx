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
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import ListSubheader from "@material-ui/core/ListSubheader";

import { layerSelector, classEUSelector } from "../utils/displayUtils";
import ButtonsUser from "./ButtonsUser";
import Footer from "./Footer.js";

import "./App.css";

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

  // drawerClass: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  // },

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

  listSubHeader: {
    color: "black",
    fontSize: "16px",
  }
});

class MyDrawer extends Component {
  constructor(props) {
    super(props);

    // Get all visible layers to set the checkboxes
    var filtered = Object.keys(props.visibility).filter(function(key) {
      return props.visibility[key];
    });
    // Get all visible layers to set the checkboxes
    var categoriesFiltered = Object.keys(props.categoriesVisibility).filter(function(key) {
      return props.categoriesVisibility[key];
    });

    this.state = {
      visibility: props.visibility,
      categoriesVisibility: props.categoriesVisibility,
      list1Open: false,
      // listLoisirOpen: false,
      listDesignationOpen: true,
      listCategoriesOpen: false,
      checked: filtered,
      categoriesChecked: categoriesFiltered,
      leftState: false,
    };

  }

  handleDrawerClose = () => {
    this.props.open = false;
    this.props.setDrawerState(false);
  };

  toggleDrawer = () => event => {
    // if (
    //   event.type === "keydown" &&
    //   (event.key === "Tab" || event.key === "Shift")
    // ) {
    //   return;
    // }
    this.props.setDrawerState(false);
    // this.setState({ ...this.state, [side]: open });
  };

  handleClick = () => {
    this.setState(state => ({ list1Open: !state.list1Open }));
  };

  // handleClickLoisirOpen = () => {
  //   this.setState(state => ({ listLoisirOpen: !state.listLoisirOpen }));
  // };

  handleClickListDesignationOpen = () => {
    this.setState(state => ({ listDesignationOpen: !state.listDesignationOpen }));
  };

  handleClickListCategoriesOpen = () => {
    this.setState(state => ({ listCategoriesOpen: !state.listCategoriesOpen }));
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

  handleToggleClassEU(value) {
    const { categoriesChecked } = this.state;
    const currentIndex = categoriesChecked.indexOf(value);
    const newChecked = [...categoriesChecked];

    // let visibilityTemp = { ...this.props.visibility };
    if (currentIndex === -1) {
      newChecked.push(value);
      // newCheckedCategories.push(classEUSelector[value].source);
      // visibilityTemp = { ...this.props.visibility, [value]: true };
    } else {
      newChecked.splice(currentIndex, 1);
      // newCheckedCategories.splice(currentIndex, 1);
      // visibilityTemp = { ...this.props.visibility, [value]: false };
    }
    this.setState({
      categoriesChecked: newChecked
    });
    const newCheckedCategoriesArray = [];

    // loop over values
    for (let value of Object.values(categoriesChecked)) {
      // if(classEUSelector[value]) {
        newCheckedCategoriesArray.push(classEUSelector[value].source);
      // }
    }

    this.props.setStateValues({
      checkedCategoriesArray: newCheckedCategoriesArray,
      needMapFilterCategories: true
    });
    this.props.triggerMapUpdate();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <I18n ns="translations">
          {t => (
            <React.Fragment>
              <div className={classes.root}>
                <Drawer
                  anchor="left"
                  transitionDuration={{ enter: 500, exit: 500 }}
                  classes={{
                    paper: classNames(
                      classes.drawerPaper,
                    )
                  }}
                  open={this.props.drawerOpen}
                  ModalProps={{ onBackdropClick: this.toggleDrawer("left", false) }}
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


                  <ListItem
                    button
                    onClick={this.handleClickListDesignationOpen}
                    aria-label={t("drawer.main3")}
                    id="ButtonDesignation"
                    style={{ backgroundColor: "white" }}
                  >
                    <ListSubheader title={t("drawer.main3")} className={classes.listSubHeader} >
                      {t("drawer.main3")}
                    </ListSubheader>

                    {this.state.listDesignationOpen ? (
                      <ExpandLess className={classes.expandIcons} />
                    ) : (
                      <ExpandMore className={classes.expandIcons} />
                    )}
                  </ListItem>
                  <Collapse
                    in={this.state.listDesignationOpen}
                    timeout="auto"
                    unmountOnExit
                    className={classes.collapses}
                  >
                    <List dense={true}>
                      {Object.keys(layerSelector).map(value => (
                        <ListItem
                          key={value}
                          role={undefined}
                          dense
                          button
                          className={classes.listItemStyle}
                          title={t("drawer." + value + "Title")}
                          onClick={this.handleToggle.bind(this, value)}
                        >
                          <Checkbox checked={this.state.checked.indexOf(value) !== -1} tabIndex={-1} disableRipple />
                          <ListItemText primary={t("drawer." + value)} />
                          {/* <ListItemSecondaryAction className={classes.listItemStyle} >
                            { returnImage(layerSelector[value].source) }
                          </ListItemSecondaryAction> */}
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider />

                  <ListItem
                    button
                    onClick={this.handleClickListCategoriesOpen}
                    aria-label="Open Categories"
                    id="Button"
                    style={{ backgroundColor: "white" }}
                  >
                    <ListSubheader title={t("drawer.main4")} className={classes.listSubHeader} >
                      {t("drawer.main4")}
                    </ListSubheader>
                    {this.state.listCategoriesOpen ? (
                      <ExpandLess className={classes.expandIcons} />
                    ) : (
                      <ExpandMore className={classes.expandIcons} />
                    )}
                  </ListItem>
                  <Collapse
                    in={this.state.listCategoriesOpen}
                    timeout="auto"
                    unmountOnExit
                    className={classes.collapses}
                  >
                    <List>
                      {Object.keys(classEUSelector).map(value => (
                        <ListItem
                          key={value}
                          role={undefined}
                          dense
                          button
                          className={classes.listItemStyle}
                          title={t("drawer." + value)}
                          onClick={this.handleToggleClassEU.bind(this, value)}
                        >
                          <Checkbox categoriesChecked={this.state.categoriesChecked.indexOf(value) !== -1} tabIndex={-1} disableRipple />
                          <ListItemText primary={t("drawer." + value)} />
                          {/* <ListItemSecondaryAction className={classes.listItemStyle} >
                            { returnImage(layerSelector[value].source) }
                          </ListItemSecondaryAction> */}
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider />
                  {/* Buttons/Menus user Login and Language Settings */}
                  <ButtonsUser/>

                  <Footer />
                </Drawer>
              </div>
            </React.Fragment>
          )}
        </I18n>
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
  categoriesVisibility:  PropTypes.object,
  drawerOpen: PropTypes.bool,
  setDrawerState: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    toggleLayerVisibility: state.app.toggleLayerVisibility,
    visibility: state.app.visibility,
    categoriesVisibility: state.app.categoriesVisibility,
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
