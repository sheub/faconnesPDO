import React, { Component } from "react";
import { connect } from "react-redux";
import { I18n } from "react-i18next";

import { triggerMapUpdate, setStateValues } from "../actions/index";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import MyAppBar from "./AppBar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import SvgIcon from "@material-ui/core/SvgIcon";
import InputLabel from "@material-ui/core/InputLabel";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

import ListSubheader from "@material-ui/core/ListSubheader";


import Star15_4AA52C from '../assets/Star15_4AA52C.svg'; // gardens
import Star15_1F08A6 from '../assets/Star15_1F08A6.svg'; // monuments
import Star15_33BAAB from '../assets/Star15_33BAAB.svg'; // Museums
import Star15_14222D from '../assets/Star15_14222D.svg'; // unesco
import Star15_961313 from '../assets/Star15_961313.svg'; // villages
import Star15_19766E from '../assets/Star15_19766E.svg'; // grandsSites

import Square15_4AA52C from '../assets/Square15_4AA52C.svg'; // parcsJardins
import Square15_E8EF1F from '../assets/Square15_E8EF1F.svg'; // localpropshop
import Square15_EE8568 from '../assets/Square15_EE8568.svg'; // craftmanShop
import Square15_318CE7 from '../assets/Square15_318CE7.svg'; // OTFrance
import Square15_6B0D0D from '../assets/Square15_6B0D0D.svg'; // WineCelar


import Footer from "./Footer.js"
// import MyDatePicker from "./MyDatePicker";


import "./App.css";

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="10" cy="10" r="9" />
    </SvgIcon>
  );
}

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
  menuButton: {
    marginLeft: 12,
    marginRight: 36
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
    position: "absolute", right: "12px"
  },

});

// Layer id patterns by category
const layerSelector = {
  Museum: /museesFrance/,
  Villages: /plusBeauxVillagesDeFrance/,
  Unesco: /patrimoinemondialenfrance/, // This is the Layer id
  Jardins: /jardinremarquable/,
  GSF: /grandSiteDeFrance/,
  MN: /monumentsnationaux/,
  ParcsJardins: /parcsjardins/,
  LocalProdShop: /localproductshop/,
  CraftmanShop: /craftmanshop/,
  WineCelar: /WineCelar/,
  OTFrance: /OTFrance/,
  Exposition: /exposition/,
  Musique: /musique/,
  Children: /children/,
  Marches: /marches/,
  VidesGreniers: /videsgreniers/
};

class MyDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: props.visibility,

      // Drawer opened per Default
      open: false,
      list1Open: false,
      listLoisirOpen: false,
      listAgendaOpen: false,
      // dateFrom: new Date(), //Today
      // dateTo: new Date() // Today plus one day

    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
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

  // handleDateChange = (date) => {

  //   let tempDate = this.state.dateTo;
  //   if (this.state.dateTo < date) {

  //     this.setState({
  //       dateFrom: date,
  //       dateTo: date
  //     });
  //     tempDate = date;
  //   }
  //   else {
  //     this.setState({ dateFrom: date });
  //   }

  //   this.props.setStateValues({
  //     dateFrom: Date.parse(date),
  //     dateTo: Date.parse(tempDate),
  //     needMapFilterByDate: true
  //   });

  //   this.props.triggerMapUpdate();
  // }

  // handleDateToChange = (date) => {
  //   this.setState({ dateTo: date });

  //   this.props.setStateValues({
  //     dateFrom: Date.parse(this.state.dateFrom),
  //     dateTo: Date.parse(date),
  //     needMapFilterByDate: true
  //   });
  //   this.props.triggerMapUpdate();
  // }

  _onVisibilityChange(name, event) {

    const visibility = { ...this.props.visibility, [name]: event.target.checked };
    this.setState({ visibility });

    this.props.setStateValues({
      toggleLayerVisibility: layerSelector[name].source,
      visibility: visibility,
      needMapToggleLayer: true
    });
    this.props.triggerMapUpdate();
  }

  render() {
    const { classes } = this.props;
    const { visibility } = this.state;

    return (
      <I18n ns="translations">
        {
          (t, { i18n }) => (
            <React.Fragment>
              <div className={classes.root}>
                <MyAppBar open={this.state.open} handleDrawerOpen={this.handleDrawerOpen} />
                <Drawer variant="persistent" anchor='left' classes={{ paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose) }} open={this.state.open}>
                  <div className={classes.toolbarIcon}>
                    <IconButton onClick={this.handleDrawerClose} aria-label="Close drawer">
                      <ChevronLeftIcon />
                    </IconButton>
                  </div>
                  <Divider />

                  {/* <ul> */}
                    <ListItem button onClick={this.handleClick} aria-label="Open Culture et Patrimoine" id="ButtonCultureHeritage">
                      <ListSubheader style={{ color: "black", fontSize: "16px" }} title={t("drawer.main1Title")}> {t("drawer.main1")} </ListSubheader>
                      {this.state.list1Open ? <ExpandLess className={classes.expandIcons} /> : <ExpandMore className={classes.expandIcons} />}
                    </ListItem>
                    <Collapse in={this.state.list1Open} timeout="auto" unmountOnExit className={classes.collapses}>
                      <List>
                        <ListItem key={"Villages"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={visibility["Villages"]} onChange={this._onVisibilityChange.bind(this, "Villages")} value="true" color="default" aria-label="VillagesCheckbox" htmlFor="VillagesListItemText" id="VillagesCheckbox" disableRipple />
                          <InputLabel htmlFor="VillagesCheckbox" id="VillagesListItemText" primary={"Villages"} title={t("drawer.villagesTitle")}>
                            {t("drawer.villages")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Star15_961313} className={classes.icon} alt={t("drawer.villagesTitle")} title={t("drawer.villagesTitle")} />
                            {/* <FaStar className={classes.icon} style={{color: "hsl(0, 78%, 33%)"}} alt={t("drawer.villagesTitle")} title={t("drawer.villagesTitle")}/> */}
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={"Unesco"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={visibility["Unesco"]} onChange={this._onVisibilityChange.bind(this, "Unesco")} value="true" color="default" id="UnescoCheckbox" disableRipple />
                          <InputLabel htmlFor="UnescoCheckbox" primary={"Unesco"} title={t("drawer.unescoTitle")}>
                            {t("drawer.unesco")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Star15_14222D} className={classes.icon} alt={t("drawer.unescoTitle")} title={t("drawer.unescoTitle")} />
                          </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem key={"Museum"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["Museum"]} onChange={this._onVisibilityChange.bind(this, "Museum")} value="true" color="default" id="MuseumCheckbox" disableRipple />
                          <InputLabel htmlFor="MuseumCheckbox" primary={"Museum"} title={t("drawer.museum")}>
                            {t("drawer.museum")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Star15_33BAAB} alt={t("drawer.museum")} className={classes.icon} />
                          </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem key={"Jardins"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={visibility["Jardins"]} onChange={this._onVisibilityChange.bind(this, "Jardins")} value="true" color="default" id="JardinsCheckbox" disableRipple />
                          <InputLabel htmlFor="JardinsCheckbox" primary={"Jardins"} title={t("drawer.gardensTitle")}>
                            {t("drawer.gardens")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Star15_4AA52C} alt={t("drawer.gardensTitle")} className={classes.icon} />
                          </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem key={"GSF"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["GSF"]} onChange={this._onVisibilityChange.bind(this, "GSF")} value="true" color="default" id="GSFCheckbox" disableRipple />
                          <InputLabel htmlFor="GSFCheckbox" primary={"Grands Sites"} title={t("drawer.grandsSitesTitle")}>
                            {t("drawer.grandsSites")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Star15_19766E} className={classes.icon} alt={t("drawer.grandsSitesTitle")} title={t("drawer.grandsSitesTitle")} />
                          </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem key={"MN"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["MN"]} onChange={this._onVisibilityChange.bind(this, "MN")} value="true" color="default" id="MNCheckbox" disableRipple />
                          <InputLabel htmlFor="MNCheckbox" primary={"Monuments"} title={t("drawer.monumentsTitle")}>
                            {t("drawer.monuments")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Star15_1F08A6} className={classes.icon} alt={t("drawer.monumentsTitle")} title={t("drawer.monumentsTitle")} />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </Collapse>
                    <Divider light />

                    <ListItem button onClick={this.handleClickLoisirOpen} aria-label="Open Loisirs et Artisanat" id="ButtonLoisir">
                      <ListSubheader title={t("drawer.main2")} style={{ color: "black", fontSize: "16px" }}>{t("drawer.main2")}</ListSubheader>
                      {this.state.listLoisirOpen ? <ExpandLess className={classes.expandIcons} /> : <ExpandMore className={classes.expandIcons} />}
                    </ListItem>

                    <Collapse in={this.state.listLoisirOpen} timeout="auto" unmountOnExit className={classes.collapses}>
                      <List>
                        <ListItem key={"LocalProdShop"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["LocalProdShop"]} onChange={this._onVisibilityChange.bind(this, "LocalProdShop")} value="true" color="default" aria-label="LocalProdShopCheckbox" htmlFor="LocalProdShopListItemText" id="LocalProdShopCheckbox" disableRipple />
                          <InputLabel htmlFor="LocalProdShopCheckbox" id="LocalProdShopListItemText" primary={"LocalProdShop"} title={t("drawer.localpropshop")}>
                            {t("drawer.localpropshop")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Square15_E8EF1F} alt={t("drawer.localpropshop")} className={classes.icon} />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={"CraftmanShop"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["CraftmanShop"]} onChange={this._onVisibilityChange.bind(this, "CraftmanShop")} value="true" color="default" aria-label="CraftmanShopCheckbox" htmlFor="CraftmanShopListItemText" id="CraftmanShopCheckbox" disableRipple />
                          <InputLabel htmlFor="CraftmanShopCheckbox" id="CraftmanShopListItemText" primary={"CraftmanShop"} title={t("drawer.craftmanShop")}>
                            {t("drawer.craftmanShop")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Square15_EE8568} alt={t("drawer.craftmanShop")} className={classes.icon} />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={"WineCelar"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["WineCelar"]} onChange={this._onVisibilityChange.bind(this, "WineCelar")} value="true" color="default" aria-label="WineCelarCheckbox" htmlFor="WineCelarListItemText" id="WineCelarCheckbox" disableRipple />
                          <InputLabel htmlFor="WineCelarCheckbox" id="WineCelarListItemText" primary={"WineCelar"} title={t("drawer.winecelar")}>
                            {t("drawer.winecelar")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Square15_6B0D0D} alt={t("drawer.winecelar")} className={classes.icon} />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={"Marches"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["Marches"]} onChange={this._onVisibilityChange.bind(this, "Marches")} value="true" color="default" aria-label="MarchesCheckbox" htmlFor="MarchesListItemText" id="MarchesCheckbox" disableRipple />
                          <InputLabel htmlFor="MarchesCheckbox" id="MarchesListItemText" primary={"Marches"} title={t("drawer.markets")}>
                            {t("drawer.markets")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <HomeIcon className={classes.icon} style={{ color: "#4AA52C" }} alt={t("drawer.markets")} title={t("drawer.markets")} />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={"VidesGreniers"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["VidesGreniers"]} onChange={this._onVisibilityChange.bind(this, "VidesGreniers")} value="true" color="default" aria-label="VidesGreniersCheckbox" htmlFor="VidesGreniersListItemText" id="VidesGreniersCheckbox" disableRipple />
                          <InputLabel htmlFor="VidesGreniersCheckbox" id="VidesGreniersListItemText" primary={"VidesGreniers"} title={t("drawer.fleaMarket")}>
                            {t("drawer.fleaMarket")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <HomeIcon className={classes.icon} style={{ color: "#007CBF" }} title={t("drawer.fleaMarket")} />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={"OTFrance"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["OTFrance"]} onChange={this._onVisibilityChange.bind(this, "OTFrance")} value="true" color="default" aria-label="OTFranceCheckbox" htmlFor="OTFranceListItemText" id="OTFranceCheckbox" disableRipple />
                          <InputLabel htmlFor="OTFranceCheckbox" id="OTFranceListItemText" primary={"OTFrance"} title={t("drawer.OTFrance")}>
                            {t("drawer.OTFrance")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Square15_318CE7} alt={t("drawer.OTFrance")} className={classes.icon} />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </Collapse>
                    <Divider light />
                    <ListItem button onClick={this.handleClickListAgendaOpen} aria-label="Open Agenda" id="ButtonAgenda" style={{ backgroundColor: "white" }}>
                      <ListSubheader title={t("drawer.main3")} style={{ color: "black", fontSize: "16px" }}>{t("drawer.main3")}</ListSubheader>
                      {this.state.listAgendaOpen ? <ExpandLess className={classes.expandIcons} /> : <ExpandMore className={classes.expandIcons} />}
                    </ListItem>
                    <Collapse in={this.state.listAgendaOpen} timeout="auto" unmountOnExit className={classes.collapses}>
                      <List>
                        {/* <ListItem style={{ backgroundColor: "#ECEDED", paddingLeft: "17px", paddingRight: "17px" }}>
                          <MyDatePicker t={t} i18n={i18n} state={this.state} dateChange={this.handleDateChange.bind(this)} dateToChange={this.handleDateToChange.bind(this)} />
                        </ListItem> */}

                        <ListItem key={"ParcsJardins"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["ParcsJardins"]} onChange={this._onVisibilityChange.bind(this, "ParcsJardins")} value="true" color="default" aria-label="ParcsJardinsCheckbox" htmlFor="ParcsJardinsListItemText" id="ParcsJardinsCheckbox" disableRipple />
                          <InputLabel htmlFor="ParcsJardinsCheckbox" id="ParcsJardinsListItemText" primary={"ParcsJardins"} title={t("drawer.parcsJardins")}>
                            {t("drawer.parcsJardins")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <img src={Square15_4AA52C} alt={t("drawer.parcsJardins")} className={classes.icon} />
                          </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem key={"Exposition"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["Exposition"]} onChange={this._onVisibilityChange.bind(this, "Exposition")} value="true" color="default" aria-label="ExpositionCheckbox" htmlFor="ExpositionListItemText" id="ExpositionCheckbox" disableRipple />
                          <InputLabel htmlFor="ExpositionCheckbox" id="ExpositionListItemText" primary={"Exposition"} title={t("drawer.exposition")}>
                            {t("drawer.exposition")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <HomeIcon className={classes.icon} style={{ color: "#E10E0E" }} alt={t("drawer.exposition")} title={t("drawer.exposition")} />
                          </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem key={"Musique"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["Musique"]} onChange={this._onVisibilityChange.bind(this, "Musique")} value="true" color="default" aria-label="MusiqueCheckbox" htmlFor="MusiqueListItemText" id="MusiqueCheckbox" disableRipple />
                          <InputLabel htmlFor="MusiqueCheckbox" id="MusiqueListItemText" primary={"Musique"} title={t("drawer.musiqueSpectacles")}>
                            {t("drawer.musiqueSpectacles")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <HomeIcon className={classes.icon} style={{ color: "#A52C56" }} alt={t("drawer.musiqueSpectacles")} title={t("drawer.musiqueSpectacles")} />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key={"Children"} dense button className={classes.listItem}>
                          <Checkbox tabIndex={-1} checked={this.state.visibility["Children"]} onChange={this._onVisibilityChange.bind(this, "Children")} value="true" color="default" aria-label="ChildrenCheckbox" htmlFor="ChildrenListItemText" id="ChildrenCheckbox" disableRipple />
                          <InputLabel htmlFor="ChildrenCheckbox" id="ChildrenListItemText" primary={"Children"} title={t("drawer.childrensCorner")}>
                            {t("drawer.childrensCorner")}
                          </InputLabel>
                          <ListItemSecondaryAction>
                            <HomeIcon className={classes.icon} style={{ color: "#15178A" }} alt={t("drawer.childrensCorner")} title={t("drawer.childrensCorner")} />
                          </ListItemSecondaryAction>
                        </ListItem>

                      </List>
                    </Collapse>

                  {/* </ul> */}
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
  dateFrom: PropTypes.number,
  dateTo: PropTypes.number,
  setStateValues: PropTypes.func,
  toggleLayerVisibility: PropTypes.string,
  triggerMapUpdate: PropTypes.func,
  visibility: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    dateFrom: state.app.dateFrom,
    dateTo: state.app.dateTo,
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

