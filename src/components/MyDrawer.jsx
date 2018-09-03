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

import ListSubheader from "@material-ui/core/ListSubheader";
import VillagesIcon from "./mbstyle/icons/village-11.svg";
import MuseumIcon from "./mbstyle/icons/museum-11.svg";
import UnescoIcon from "./mbstyle/icons/World_Heritage_Logo_global_small.svg";
import JardinsIcon from "./mbstyle/icons/Jardins_Remarquables_15.svg";
//import AOPIcon from "./mbstyle/icons/AOP.svg";


import "./css/App.css";
import "./css/mdIcons.css";

// var defaultMapStyle = fromJS(MAP_STYLE);

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
    menuButtonHidden: {
        display: "none"
    },
    title: {
        flexGrow: 0
    },
    drawerPaper: {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        overflowX: "hidden",
        overflowY: "hidden",
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
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 0,
    padding: theme.spacing.unit * 0
  },
  icon: {
    width: 25
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  pickers: {
    display: "flex",
    justifyContent: "space-around",
  }
});

const categories = ["Museum", 
                    "Villages", 
                    "Unesco",
                    "AOP",
                    "Jardins",
                    "GSF",
                    "MN",
                    "ParcsJardins",
                    "Restaurants",
                    "LocalProdShop",
                    "CraftmanShop",
                    "Exposition",
                    "Musique",
                    "Children",
                    "Marches",
                    "VidesGreniers"];



// Layer id patterns by category
const layerSelector = {
            Museum: /listeetlocalisationdesmuseesdefrance/,
            Villages: /villages-frenchcorrected-3gqhy6/,
            Unesco: /whs-frenchcorrected-dq63pv/, // This is the Layer id
            AOP: /n-inao-aop-fr-16md1w/,
            Jardins: /jardinfr-8nabpa/,
            GSF: /gsf-frenchcorrected/,
            MN: /edifice-geres-par-les-monumen-3inr6v/,
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
            listAgendaOpen: true,
            dateFrom: new Date(),
            dateTo: new Date()

        };
        // this._defaultLayers = defaultMapStyle.get("layers");

        if (window.innerWidth < 600) {
            // Close Drawer per default for small screens
            this.state.open = false;
        }
    }

    _updateMapStyle({ visibility }) {

      // this.props.setStateValues({
      //   toggleLayerVisibility: visibility,
      //   // needMapRestyle: true,
      //   needMapToggleLayer: true
      // });
      // this.props.triggerMapUpdate();

      //   const layers = this._defaultLayers.filter(
      //       layer => {
      //           const id = layer.get("id");
      //           return categories.every(name => visibility[name] || !layerSelector[name].test(id));
      //       }
      //   );

      //   let mapStyle = defaultMapStyle.set("layers", layers);

      //   // Add source layers
      //   if (visibility["Marches"]) {
      //       mapStyle = this._loadJsonData(mapStyle, "marches");
      //   }

      //   // Add source layers
      //   if (visibility["VidesGreniers"]) {
      //       mapStyle = this._loadJsonData(mapStyle, "videsgreniers");
      //   }        

      //   // Add source layers
      //   if (visibility["Exposition"]) {
      //       mapStyle = this._loadJsonData(mapStyle, "exposition");
      //   }

      //   // Add source layers
      //   if (visibility["Musique"]) {
      //       mapStyle = this._loadJsonData(mapStyle, "musique");
      //   }
      // // Add source layers
      // if (visibility["Children"]) {
      //   mapStyle = this._loadJsonData(mapStyle, "children");
      // }

      //   this.props.onChange(mapStyle);

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

      this._updateMapStyle({ ...this.state, visibility });

    }

    componentDidMount() {
       // this._updateMapStyle(this.state);
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
    handleClickListAgendaOpen = () => {
        this.setState((state) => ({ listAgendaOpen: !state.listAgendaOpen }));
    };

    handleDateChange = (date) => {

        // const { visibility } = this.state;
        this.setState({ dateFrom: date });
        this._updateMapStyle(this.state);
    }

    _loadJsonData(mapStyle, dataStr) {

        // // Get data from json file
        // let { dateFrom, dateTo } = this.state;
        // dateFrom = Date.parse(dateFrom);
        // dateTo = Date.parse(dateTo);


        // const AllData = {
        //     marches: fromJS(require("./data/marches.json")),
        //     exposition: fromJS(require("./data/exposition.json")),
        //     musique: fromJS(require("./data/musique.json")),
        //     children: fromJS(require("./data/children.json")),
        //     videsgreniers: fromJS(require("./data/videsGreniers.json"))
        //   };

        // const marchesData = AllData[dataStr];
 
        // // Filter by date
        // const FilteredData = marchesData.set("features", marchesData.get("features")
        //     .filter((marcheEvent) => marcheEvent.getIn(["properties", "valid_from"]) >= dateFrom 
        //             && marcheEvent.getIn(["properties", "valid_through"]) >= dateTo ));

        // // Add geojson source to map
        // mapStyle = mapStyle.setIn(["sources", dataStr], fromJS({ type: "geojson" }));

        // // mapStyle = mapStyle.setIn(["sources", dataStr], fromJS({ cluster: true }));
        // // // Max zoom to cluster points on
        // // mapStyle = mapStyle.setIn(["sources", dataStr], fromJS({ clusterMaxZoom: 14 }));
        // // // Radius of each cluster when clustering points (defaults to 50)
        // // mapStyle = mapStyle.setIn(["sources", dataStr], fromJS({ clusterRadius: 50  }));
        

        // // Update data source
        // mapStyle = mapStyle.setIn(["sources", dataStr, "data"], FilteredData);

        // return mapStyle;
    }

    render() {
        const { classes } = this.props;
        const {visibility, dateFrom } = this.state;
        // var pointColor = null;
        //  if("paint" in defaultMapStyle.layers["name"])
        //    {pointColor = defaultMapStyle.layers["name"].paint["circle-color"];}

        return <React.Fragment>
            <div className={classes.root}>
              <MyAppBar open={this.state.open} handleDrawerOpen={this.handleDrawerOpen}/>
              <Drawer ref={elem => (this.Drawer = elem)} variant="permanent" classes={{ paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose) }} open={this.state.open}>
                <div className={classes.toolbarIcon}>
                  <IconButton onClick={this.handleDrawerClose} aria-label="Close drawer">
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />

                <ListItem button onClick={this.handleClick} aria-label="Open Culture et Patrimoine" id="ButtonCultureHeritage">
                  <ListSubheader>Culture et Patrimoine</ListSubheader>
                  {this.state.list1Open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.list1Open} timeout="auto" unmountOnExit>
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
                      <InputLabel htmlFor="UnescoCheckbox" primary={"Unesco"} title="Unesco World Heritage">
                        Unesco
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <img className={classes.icon} alt="Unesco World Heritage" title="Unesco World Heritage" src={UnescoIcon} />
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem key={"Museum"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["Museum"]} onChange={this._onVisibilityChange.bind(this, "Museum")} value="true" color="default" id="MuseumCheckbox" disableRipple />
                      <InputLabel htmlFor="MuseumCheckbox" primary={"Museum"} title="Museum">
                        Musées
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <img className={classes.icon} alt="Museum" title="Museum" src={MuseumIcon} />
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
                      <InputLabel htmlFor="GSFCheckbox" primary={"Grands Sites"} title="Grand Site de France">
                        Grands Sites
                      </InputLabel>
                      <ListItemSecondaryAction>
                      <HomeIcon className={classes.icon} style={{ color: "#217619" }} alt="Grand Site de France" title="Grand Site de France" />
                        {/* <img className={classes.icon} alt="Grand Site de France" title="Grand Site de France" src={GSFIcon} /> */}
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem key={"MN"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["MN"]} onChange={this._onVisibilityChange.bind(this, "MN")} value="true" color="default" id="MNCheckbox" disableRipple />
                      <InputLabel htmlFor="MNCheckbox" primary={"Monuments"} title="Monuments Nationaux">
                        Monuments
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#1f08a6" }} alt="Monuments Nationaux" title="Monuments Nationaux" />
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

                    <ListItem key={"ParcsJardins"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["ParcsJardins"]} onChange={this._onVisibilityChange.bind(this, "ParcsJardins")} value="true" color="default" aria-label="ParcsJardinsCheckbox" htmlFor="ParcsJardinsListItemText" id="ParcsJardinsCheckbox" disableRipple />
                      <InputLabel htmlFor="ParcsJardinsCheckbox" id="ParcsJardinsListItemText" primary={"ParcsJardins"} title="Parcs et jardins">
                        Parcs et jardins
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
                      <InputLabel htmlFor="LocalProdShopCheckbox" id="LocalProdShopListItemText" primary={"LocalProdShop"} title="LocalProdShop">
                        Commerce local
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#E8EF1F" }} alt="LocalProdShop" title="LocalProdShop" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"CraftmanShop"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["CraftmanShop"]} onChange={this._onVisibilityChange.bind(this, "CraftmanShop")} value="true" color="default" aria-label="CraftmanShopCheckbox" htmlFor="CraftmanShopListItemText" id="CraftmanShopCheckbox" disableRipple />
                      <InputLabel htmlFor="CraftmanShopCheckbox" id="CraftmanShopListItemText" primary={"CraftmanShop"} title="CraftmanShop">
                        Atelier artisanal
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#ee8568" }} alt="CraftmanShop" title="CraftmanShop" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                  <Divider />
                </Collapse>
                <ListItem button onClick={this.handleClickListAgendaOpen} aria-label="Open Agenda" id="ButtonAgenda" style={{ backgroundColor: "red" }}>
                  <ListSubheader>Agenda</ListSubheader>
                  {this.state.listAgendaOpen ? <ExpandLess style={{ flex: 1, float: "right" }} /> : <ExpandMore style={{ flex: 1, float: "right" }} />}
                </ListItem>
                <Collapse in={this.state.listAgendaOpen} timeout="auto" unmountOnExit>
                  <List>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker style={{ marginLeft: 24 }} value={dateFrom} minDate={dateFrom} onChange={this.handleDateChange} />
                    </MuiPickersUtilsProvider>

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
                      <InputLabel htmlFor="MusiqueCheckbox" id="MusiqueListItemText" primary={"Musique"} title="Musique">
                        Musique
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#a52c56" }} alt="Musique" title="Musique" />
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
                        <HomeIcon className={classes.icon} style={{ color: "#007cbf" }} alt="Marches" title="Marches" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem key={"VidesGreniers"} dense button className={classes.listItem}>
                      <Checkbox tabIndex={-1} checked={this.state.visibility["VidesGreniers"]} onChange={this._onVisibilityChange.bind(this, "VidesGreniers")} value="true" color="default" aria-label="VidesGreniersCheckbox" htmlFor="VidesGreniersListItemText" id="VidesGreniersCheckbox" disableRipple />
                      <InputLabel htmlFor="VidesGreniersCheckbox" id="VidesGreniersListItemText" primary={"VidesGreniers"} title="Vide-greniers">
                        Vide-greniers
                      </InputLabel>
                      <ListItemSecondaryAction>
                        <HomeIcon className={classes.icon} style={{ color: "#15178a" }} alt="Vide-greniers" title="Vide-greniers" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>

                  <Divider />
                </Collapse>
              </Drawer>
            </div>
          </React.Fragment>;
    }
}


MyDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  setStateValues: PropTypes.func,
  toggleLayerVisibility: PropTypes.string,
  triggerMapUpdate: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    toggleLayerVisibility: state.app.toggleLayerVisibility,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStateValues: (obj) => dispatch(setStateValues(obj)),
    triggerMapUpdate: (v) => dispatch(triggerMapUpdate(v))
  };
};
export {MyDrawer};
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(MyDrawer);

// export default withStyles(styles)(MyDrawer);
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyDrawer));

// export {TrafficSwitch};
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(TrafficSwitch);
