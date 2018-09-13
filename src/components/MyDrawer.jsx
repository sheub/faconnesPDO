import React, { Component } from "react";
import {connect} from 'react-redux';
import {triggerMapUpdate, setStateValues} from '../actions/index';

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

import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DatePicker from "material-ui-pickers/DatePicker";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import frLocale from 'date-fns/locale/fr';

import ListSubheader from "@material-ui/core/ListSubheader";
import VillagesIcon from "./../styles/icons/village-11.svg";
import MuseumIcon from "./../styles/icons/museum-11.svg";
import UnescoIcon from "./../styles/icons/World_Heritage_Logo_global_small.svg";
import JardinsIcon from "./../styles/icons/Jardins_Remarquables_15.svg";
import Footer from "./Footer.js"
//import AOPIcon from "./../styles/icons/AOP.svg";


import "./css/App.css";
import "./css/mdIcons.css";

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
    display: "flex"
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  // menuButtonHidden: {
  //   display: "none"
  // },
  title: {
    flexGrow: 0
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    display:"flex",
    paddingBottom: "100px",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
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
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: 0,//theme.spacing.unit * 7,
    // [theme.breakpoints.up("sm")]: {
    //     width: theme.spacing.unit * 9
    // }
  },
  collapses: {
    overflowY: "auto",
    //     "&:hover": {
    //   overflowY: "auto",
    // },
    // "&::-webkit-scrollbar": {
    //   display: "none",
    // },
  },
  // appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 0,
    padding: theme.spacing.unit * 0
  },
  icon: {
    width: 25
  },

  pickers: {
    display: "flex",
    justifyContent: "space-around",
  },
  expandIcons:{
    position: "absolute", right: "12px"    
  },
  MuiInputInput:{
    textAlign:"center"
  },

    // container: {
  //   display: "flex",
  //   flexWrap: "wrap",
  // },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },

  // Name of the component ⚛️
  MuiListItemSecondaryAction: {
    // The properties to apply
    right: "10px",
  },
  MuiInput: {
    textAlign: "inherit"
  },
  overrides: {

    // Name of the component ⚛️
    MuiListItemSecondaryAction: {
      // The properties to apply
      right: "10px",
    },
    MuiInput: {
      textAlign: "inherit"
    }
  },

});

// Layer id patterns by category
const layerSelector = {
            Museum: /liste-et-localisation-des-mus-5iczl9/,
            Villages: /plus-beaux-villages-de-france/,
            Unesco: /patrimoine-mondial-en-france/, // This is the Layer id
            AOP: /n-inao-aop-fr-16md1w/,
            Jardins: /jardin-remarquable/,
            GSF: /grand-site-de-france/,
            MN: /monuments-nationaux/,
            ParcsJardins: /parcsjardins/,
            Restaurants: /restaurants/,
            LocalProdShop: /localproductshop/,
            CraftmanShop: /craftmanshop/,
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
            visibility: {
                Museum: false,
                Villages: false,
                Unesco: true, 
                AOP: false,
                Jardins: false,
                GSF: false,
                MN: false,
                ParcsJardins: false,
                Restaurants: false,
                LocalProdShop: false,
                CraftmanShop: false,
                Exposition: false,
                Musique: false,
                Children: false,
                Marches: false,
                VidesGreniers: false
            },

            // Drawer opened per Default
            mapStyle: "",
            open: false,
            list1Open: false,
            listLoisirOpen: false,
            listAgendaOpen: true,
            dateFrom: new Date(), //Today
            dateTo: new Date() // Today plus one day

        };

        if (window.innerWidth < 600) {
            // Close Drawer per default for small screens
            this.state.open = false;
        }
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

    handleDateChange = (date) => {

      let tempDate = this.state.dateTo;
      if (this.state.dateTo < date) {
        // var tomorrow = date;
        // tomorrow.setDate(tomorrow.getDate() + 1);

        this.setState({
          dateFrom: date,
          dateTo: date
        });
        tempDate = date;
      }
      else {
        this.setState({ dateFrom: date });
      }

      this.props.setStateValues({
        dateFrom: Date.parse(date),
        dateTo:  Date.parse(tempDate),
        needMapFilterByDate: true
      });

      this.props.triggerMapUpdate();
    }

    handleDateToChange = (date) => {
      this.setState({ dateTo: date });

      this.props.setStateValues({
        dateFrom: Date.parse(this.state.dateFrom),
        dateTo: Date.parse(date),
        needMapFilterByDate: true
      });
      this.props.triggerMapUpdate();
    }

    _onVisibilityChange(name, event) {

      const visibility = { ...this.state.visibility, [name]: event.target.checked };
      this.setState({ visibility });

      this.props.setStateValues({
        toggleLayerVisibility: layerSelector[name].source,
        // needMapRestyle: true,
        needMapToggleLayer: true
      });
      this.props.triggerMapUpdate();
    }

    componentDidMount() {
      //this.dateTo = this.dateTo.getDate() + 1;
      //this.handleDateChange(Date());
    }


    render() {
        const { classes } = this.props;
        const {visibility, dateFrom, dateTo } = this.state;


        return <React.Fragment>
            <div className={classes.root}>
              <MyAppBar open={this.state.open} handleDrawerOpen={this.handleDrawerOpen}/>
              {/* ref={elem => (this.Drawer = elem)} */}
              <Drawer variant="temporary" classes={{ paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose) }} open={this.state.open}>
                <div className={classes.toolbarIcon}>
                  <IconButton onClick={this.handleDrawerClose} aria-label="Close drawer">
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />

               <ListItem button onClick={this.handleClick} aria-label="Open Culture et Patrimoine" id="ButtonCultureHeritage">
                  <ListSubheader style={{color:"black", fontSize:"16px" }} title="Richesses architecturales, naturelles et culturelles">Culture &amp; Patrimoine</ListSubheader>
                  {this.state.list1Open ? <ExpandLess className={classes.expandIcons}/> : <ExpandMore className={classes.expandIcons}/>}
                </ListItem>
                <Collapse in={this.state.list1Open} timeout="auto" unmountOnExit className={classes.collapses}>
                  <List>
                    <ListItem key={"Villages"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={visibility["Villages"]} onChange={this._onVisibilityChange.bind(this, "Villages")} value="true" color="default" aria-label="VillagesCheckbox" htmlFor="VillagesListItemText" id="VillagesCheckbox" disableRipple />
                      <InputLabel htmlFor="VillagesCheckbox" id="VillagesListItemText" primary={"Villages"} title="Plus beaux Villages de France">
                        Villages
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <img className={classes.icon} alt="Plus beaux Villages de France" title="Plus beaux Villages de France" src={VillagesIcon} />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"Unesco"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={visibility["Unesco"]} onChange={this._onVisibilityChange.bind(this, "Unesco")} value="true" color="default" id="UnescoCheckbox" disableRipple />
                      <InputLabel htmlFor="UnescoCheckbox" primary={"Unesco"} title="Patrimoine mondial de l'UNESCO">
                        Unesco
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <img className={classes.icon} alt="Patrimoine mondial de l'UNESCO" title="Patrimoine mondial de l'UNESCO" src={UnescoIcon} />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem key={"Museum"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["Museum"]} onChange={this._onVisibilityChange.bind(this, "Museum")} value="true" color="default" id="MuseumCheckbox" disableRipple />
                      <InputLabel htmlFor="MuseumCheckbox" primary={"Museum"} title="Musées">
                        Musées
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <img className={classes.icon} alt="Musées" title="Musées" src={MuseumIcon} />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem key={"Jardins"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={visibility["Jardins"]} onChange={this._onVisibilityChange.bind(this, "Jardins")} value="true" color="default" id="JardinsCheckbox" disableRipple />
                      <InputLabel htmlFor="JardinsCheckbox" primary={"Jardins"} title="Jardins remarquables">
                        Jardins
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <img className={classes.icon} alt="Jardins remarquables" title="Jardins remarquables" src={JardinsIcon} />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem key={"GSF"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["GSF"]} onChange={this._onVisibilityChange.bind(this, "GSF")} value="true" color="default" id="GSFCheckbox" disableRipple />
                      <InputLabel htmlFor="GSFCheckbox" primary={"Grands Sites"} title="Grands Sites de France">
                        Grands Sites
                      </InputLabel>
                      <ListItemSecondaryAction>
                      <HomeIcon className={classes.icon} style={{ color: "#217619" }} alt="Grands Sites de France" title="Grands Sites de France" />
                        {/* <img className={classes.icon} alt="Grand Site de France" title="Grand Site de France" src={GSFIcon} /> */}
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem key={"MN"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["MN"]} onChange={this._onVisibilityChange.bind(this, "MN")} value="true" color="default" id="MNCheckbox" disableRipple />
                      <InputLabel htmlFor="MNCheckbox" primary={"Monuments"} title="Édifices gérés par le centre des monuments nationaux">
                        Monuments
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#1f08a6" }} alt="Monuments Nationaux" title="Édifices gérés par le centre des monuments nationaux" />
                      </ListItemSecondaryAction>
                    </ListItem>

                    {/* <ListItem key={"AOP"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["AOP"]} onChange={this._onVisibilityChange.bind(this, "AOP")} value="true" color="default" id="AOPCheckbox" disableRipple />
                      <InputLabel htmlFor="AOPCheckbox" primary={"AOP"} title="Apellations d'origine controllée">
                        AOP
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <img className={classes.icon} alt="Apellations d'origine controllée" title="Apellations d'origine controllée" src={AOPIcon} />
                      </ListItemSecondaryAction>
                    </ListItem> */}
                    
                    </List>
                    </Collapse>
                    <Divider light/>

                  <ListItem button onClick={this.handleClickLoisirOpen} aria-label="Open Loisirs et Artisanat" id="ButtonLoisir">
                  <ListSubheader style={{color:"black", fontSize:"16px" }}>Loisirs &amp; Artisanat</ListSubheader>
                  {this.state.listLoisirOpen ? <ExpandLess className={classes.expandIcons}/> : <ExpandMore className={classes.expandIcons}/>}
                </ListItem>

                <Collapse in={this.state.listLoisirOpen} timeout="auto" unmountOnExit className={classes.collapses}>
                  <List>
                    <ListItem key={"ParcsJardins"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["ParcsJardins"]} onChange={this._onVisibilityChange.bind(this, "ParcsJardins")} value="true" color="default" aria-label="ParcsJardinsCheckbox" htmlFor="ParcsJardinsListItemText" id="ParcsJardinsCheckbox" disableRipple />
                      <InputLabel htmlFor="ParcsJardinsCheckbox" id="ParcsJardinsListItemText" primary={"ParcsJardins"} title="Parcs et jardins">
                        Parcs &amp; jardins
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#4aa52c" }} alt="Parcs et jardins" title="Parcs et jardins" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"Restaurants"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["Restaurants"]} onChange={this._onVisibilityChange.bind(this, "Restaurants")} value="true" color="default" aria-label="RestaurantsCheckbox" htmlFor="RestaurantsListItemText" id="RestaurantsCheckbox" disableRipple />
                      <InputLabel htmlFor="RestaurantsCheckbox" id="RestaurantsListItemText" primary={"Restaurants"} title="Restaurants">
                        Restaurants
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#a22020" }} alt="Restaurants" title="Restaurants" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"LocalProdShop"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["LocalProdShop"]} onChange={this._onVisibilityChange.bind(this, "LocalProdShop")} value="true" color="default" aria-label="LocalProdShopCheckbox" htmlFor="LocalProdShopListItemText" id="LocalProdShopCheckbox" disableRipple />
                      <InputLabel htmlFor="LocalProdShopCheckbox" id="LocalProdShopListItemText" primary={"LocalProdShop"} title="Commerce local">
                        Commerce local
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#E8EF1F" }} alt="Commerce local" title="Commerce local" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"CraftmanShop"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["CraftmanShop"]} onChange={this._onVisibilityChange.bind(this, "CraftmanShop")} value="true" color="default" aria-label="CraftmanShopCheckbox" htmlFor="CraftmanShopListItemText" id="CraftmanShopCheckbox" disableRipple />
                      <InputLabel htmlFor="CraftmanShopCheckbox" id="CraftmanShopListItemText" primary={"CraftmanShop"} title="Atelier artisanal">
                        Atelier artisanal
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#ee8568" }} alt="Atelier artisanal" title="Atelier artisanal" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>                  
                </Collapse>
                <Divider light/>
                <ListItem button onClick={this.handleClickListAgendaOpen} aria-label="Open Agenda" id="ButtonAgenda" style={{backgroundColor: "white" }}>
                  <ListSubheader style={{color:"black", fontSize:"16px" }}>Agenda</ListSubheader>
                  {this.state.listAgendaOpen ? <ExpandLess className={classes.expandIcons} /> : <ExpandMore className={classes.expandIcons} />}
                </ListItem>
                <Collapse in={this.state.listAgendaOpen} timeout="auto" unmountOnExit className={classes.collapses}>
                


                <List>
                  <ListItem style={{ backgroundColor: "#eceded", paddingLeft: "17px", paddingRight: "17px"}}>

                    <div style={{ backgroundColor: "#eceded", width: "50%", padding: "6px", float: "left" }} >
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
                        <DatePicker style={{ maxWidth: "100%", textAlign: "center" }} value={dateFrom} minDate={Date()} disablePast={true} onChange={this.handleDateChange.bind(this)} />
                      </MuiPickersUtilsProvider>
                    </div>

                    <div style={{ backgroundColor: "#eceded", width: "50%", padding: "6px", float: "right" }}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
                        <DatePicker style={{ maxWidth: "100%", textAlign: "center" }} value={dateTo} minDate={dateFrom} onChange={this.handleDateToChange} />
                      </MuiPickersUtilsProvider>
                    </div>
                  </ListItem>

                    <ListItem key={"Exposition"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["Exposition"]} onChange={this._onVisibilityChange.bind(this, "Exposition")} value="true" color="default" aria-label="ExpositionCheckbox" htmlFor="ExpositionListItemText" id="ExpositionCheckbox" disableRipple />
                      <InputLabel htmlFor="ExpositionCheckbox" id="ExpositionListItemText" primary={"Exposition"} title="Expositions">
                        Expositions
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#E10E0E" }} alt="Expositions" title="Expositions" />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem key={"Musique"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["Musique"]} onChange={this._onVisibilityChange.bind(this, "Musique")} value="true" color="default" aria-label="MusiqueCheckbox" htmlFor="MusiqueListItemText" id="MusiqueCheckbox" disableRipple />
                      <InputLabel htmlFor="MusiqueCheckbox" id="MusiqueListItemText" primary={"Musique"} title="Musique et spectacles">
                        Musique et spectacles
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#a52c56" }} alt="Musique et spectacles" title="Musique et spectacles" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"Children"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["Children"]} onChange={this._onVisibilityChange.bind(this, "Children")} value="true" color="default" aria-label="ChildrenCheckbox" htmlFor="ChildrenListItemText" id="ChildrenCheckbox" disableRipple />
                      <InputLabel htmlFor="ChildrenCheckbox" id="ChildrenListItemText" primary={"Children"} title="Children's Corner">
                        Children's Corner
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#15178a" }} alt="Children's Corner" title="Children's Corner" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"Marches"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["Marches"]} onChange={this._onVisibilityChange.bind(this, "Marches")} value="true" color="default" aria-label="MarchesCheckbox" htmlFor="MarchesListItemText" id="MarchesCheckbox" disableRipple />
                      <InputLabel htmlFor="MarchesCheckbox" id="MarchesListItemText" primary={"Marches"} title="Marches">
                        Marchés
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#4aa52c" }} alt="Marches" title="Marches" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"VidesGreniers"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["VidesGreniers"]} onChange={this._onVisibilityChange.bind(this, "VidesGreniers")} value="true" color="default" aria-label="VidesGreniersCheckbox" htmlFor="VidesGreniersListItemText" id="VidesGreniersCheckbox" disableRipple />
                      <InputLabel htmlFor="VidesGreniersCheckbox" id="VidesGreniersListItemText" primary={"VidesGreniers"} title="Vide-greniers">
                        Vide-greniers
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#007cbf" }} alt="Vide-greniers" title="Vide-greniers" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>                  
                </Collapse>
                <Divider />
                <Footer />
              </Drawer>
            </div>
          </React.Fragment>;
    }
}


MyDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  setStateValues: PropTypes.func,
  dateFrom: PropTypes.number,
  dateTo: PropTypes.number,
  toggleLayerVisibility: PropTypes.string,
  triggerMapUpdate: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    dateFrom: state.app.dateFrom,
    dateTo: state.app.dateTo,
    toggleLayerVisibility: state.app.toggleLayerVisibility
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStateValues: (obj) => dispatch(setStateValues(obj)),
    triggerMapUpdate: (v) => dispatch(triggerMapUpdate(v))
  };
};
export {MyDrawer};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyDrawer));

