import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { triggerMapUpdate, setStateValue } from "../actions/index";
// import turfDistance from "@turf/distance";
import {push} from "connected-react-router";


import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";

import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import {
  RenderUrl,
  RenderAddress,
  RenderDateTime,
  RenderLastUpdate,
  RenderThumbnail,
  returnImage,
  returnLayerIDfromFeatureId,
} from "../utils/displayUtils";

import "./PopupInfo.css";

const styles = (theme) => ({
  listContainer: {
    display: "flex",
    flexDirection: "column",
    height: "33vh",
    // height: "auto",
    marginTop: "7px",
    boxShadow: "0 0 10px 2px rgba(0, 0, 0, .25)",
  },

  listRoot: {
    width: "100%",
    backgroundColor: "white",
    position: "relative",
    overflowY: "auto",
    overflowX: "hidden",
    flex: 1,
  },

  listItemClass: {
    backgroundColor: "#FFF",
    position: "absolute",
    right: 0,
    left: 0,
  },

  btnClose: {
    position: "absolute",
    top: "-4px",
    right: "0px",
    cursor: "pointer",
    zIndex: 2,
  },

  listItemIconClass: {
    marginRight: "-25px",
    marginLeft: "-16px",
    marginTop: "5px",
  },

  ExpansionPanelRoot: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },

  ExpansionPanelSummaryRoot: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },

  ExpansionPanelDetailsRoot: {
    padding: theme.spacing(2),
    display: "grid",
  },
});

class ListVue extends React.Component {
  state = {
    open: true,
    infoPopup: null,
  };

  hideListVue() {
    this.props.setStateValue("listVueActive", false);
  }

  handleClick(index) {

    let infoItem = this.props.listVueItems[index];
    infoItem.geometry = this.props.listVueItems[index]._geometry ? this.props.listVueItems[index]._geometry : this.props.listVueItems[index].geometry;
    infoItem.layerId = this.props.listVueItems[index].layerId;
    // infoItem.listVueActive = true;
    // infoItem.paintColor = this.props.listVueItems[index].layer.paint["circle-color"];
    infoItem.place_name = this.props.listVueItems[index].properties.productName;
    // infoItem.featureId = this.props.listVueItems[index].id ? this.props.listVueItems[index].id : this.props.listVueItems[index].properties.feature_id;
    infoItem.featureId = this.props.listVueItems[index].properties.feature_id;


    this.props.setStateValue("infoPopup", infoItem);
    this.props.setStateValue("popupActive", false);


    // Update the searchLocation so that the marker is jumping from position to position
    this.props.setStateValue("searchLocation", {
      type: "Feature",
      place_name: infoItem.place_name,
      properties: infoItem.properties,
      geometry: infoItem.geometry,
      // layerId: infoItem.layerId,
      // paintColor: infoItem.paintColor,
      featureId: infoItem.featureId,
      // popupActive: true,
      // listVueActive: true
    });
    this.props.triggerMapUpdate();

  }

  ListVueMainItem(item, index, coorOnClick) {
    const lang = this.props.i18n.language;
    const { classes } = this.props;
    // var distance = turfDistance(coorOnClick, item.geometry.coordinates);
    // distance = distance.toFixed(2).toString();
    if(typeof item.layer === "undefined") {
      item.layer = {};
      // item.layer.id = returnLayerIDfromFeatureId(item.properties.feature_id);
      item.layerId = returnLayerIDfromFeatureId(item.properties.feature_id);
    } else {
      item.layerId = item.layer.id;
    }

    let info = {};
    info.address = "";
    if (
      [
        "PDO",
      ].includes(item.layerId)//item.layer.id)
    ) {
      info.address = item.properties.address_locality;
    }

    switch (lang) {
    case "fr":
      if (typeof item.properties.productName !== "undefined") {
        info.label = item.properties.productName;
        info.description = item.properties.productDescription ? item.properties.productDescription : item.properties.wiki_abstract_fr;

      } else {
        info.label = item.properties.productName;
        info.description = item.properties.productDescription ? item.properties.productDescription : item.properties.wiki_abstract_fr;
      }
      break;

    case "en":
      if (
        typeof item.properties.productName !== "undefined" &&
          item.properties.productName
      ) {
        info.label = item.properties.productName;
        info.description = item.properties.productDescription ? item.properties.productDescription : item.properties.wiki_abstract_fr;
      } else {
        info.label = item.properties.productName;
        info.description = item.properties.productDescription ? item.properties.productDescription : item.properties.wiki_abstract_fr;
      }
      break;

    default:
      if (typeof item.properties.productName !== "undefined") {
        info.label = item.properties.productName;
        info.description = item.properties.productDescription ? item.properties.productDescription : item.properties.wiki_abstract_fr;
      } else {
        info.label = item.properties.productName;
        info.description = item.properties.productDescription ? item.properties.productDescription : item.properties.wiki_abstract_fr;
      }
      break;
    }

    // else {
    //     info.label = item.properties.label;
    //     info.address = "";//<a target="_new" href={item.properties.link} rel="noopener">&rarr; Wikipedia</a>
    // }
    // if (info.address !== "") {
    //   info.address = info.address + ", " + distance.concat(" kms");
    // } else {
    //   info.address = distance.concat(" kms");
    // }
    // const [expanded, setExpanded] = React.useState('panel1');

    // const handleChange = (panel) => (event, newExpanded) => {
    //   setExpanded(newExpanded ? panel : false);
    // };
    return (
      // expanded={expanded === 'panel' + index} onChange={handleChange('panel' + index)}
      <MuiExpansionPanel
        square
        key={"listItem" + index}
        className={classes.ExpansionPanelRoot}
      >
        <MuiExpansionPanelSummary
          className={classes.ExpansionPanelSummaryRoot}
          aria-controls={"panel " + index + "d-content"}
          aria-label={info.label}
          id={"panel" + index + "d-header"}
          onClick={this.handleClick.bind(this, index)}
        >
          <ListItemIcon className={classes.listItemIconClass}>
            {returnImage(item.layerId)}
          </ListItemIcon>
          {/* <Typography>{info.label}</Typography> */}
          <Typography dangerouslySetInnerHTML={{ __html: info.label }} />

        </MuiExpansionPanelSummary>
        <MuiExpansionPanelDetails className={classes.ExpansionPanelDetailsRoot}>
          {/* <Typography>{info.description}</Typography> */}
          <RenderThumbnail props={this.props.infoPopup.properties}/>
          <Typography><span dangerouslySetInnerHTML={{ __html: info.description }} /></Typography>
          <RenderDateTime infoPopup={item} props={this.props} />
          <RenderUrl infoPopup={item} props={this.props} />
          <RenderAddress infoPopup={item} />
          <RenderLastUpdate infoPopup={item} props={this.props} />
        </MuiExpansionPanelDetails>
      </MuiExpansionPanel>
    );
  }

  render() {
    const { classes } = this.props;
    let listVueActive = this.props.listVueActive;
    const items = this.props.listVueItems;
    let coorOnClick = this.props.coorOnClick;

    let styleListVue = { zIndex: 0 };
    if (!listVueActive) {
      styleListVue = { zIndex: -1, height: 0 };
    }

    if (typeof items !== "undefined" && items.length) {
      return (
        <div className={classes.listContainer} style={styleListVue}>
          <List
            dense={true}
            className={classes.listRoot}
            component="div"
            disablePadding
            subheader={
              <ListSubheader component="div">
                {" "}
                {items.length} Attractions
                <div className={classes.btnClose} aria-label="Close">
                  <IconButton
                    aria-label="Close"
                    data-dismiss="alert"
                    onClick={() => this.hideListVue()}
                  >
                    <svg className="btn-icon">
                      <use xlinkHref="#icon-close"></use>
                    </svg>
                  </IconButton>
                </div>
              </ListSubheader>
            }
          >
            <div className={classes.listItemClass}>
              {items.map((member, index) => {
                return this.ListVueMainItem(member, index, coorOnClick);
              })}
            </div>
          </List>
        </div>
      );
    }
    return null;
  }

  get styles() {
    return {
      input: "input px42 h42 border--transparent",
    };
  }
}

ListVue.propTypes = {
  classes: PropTypes.object.isRequired,
  infoPopup: PropTypes.object,
  coorOnClick: PropTypes.array,
  listVueActive: PropTypes.bool,
  listVueItems: PropTypes.array,
  searchLocation: PropTypes.object,
  // featureId: PropTypes.number,
  setInfoPopup: PropTypes.func,
  setStateValue: PropTypes.func,
  triggerMapUpdate: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    // coorOnClick: state.app.coorOnClick,
    listVueActive: state.app.listVueActive,
    infoPopup: state.app.infoPopup,
    searchLocation: state.app.searchLocation,
    // featureId: state.app.infoPopup.featureId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    pushHistory: (url) => dispatch(push(url)),
    setStateValue: (key, value) => dispatch(setStateValue(key, value)),
    setInfoPopup: (infoPopup) => dispatch(setStateValue("infoPopup", infoPopup)),
    triggerMapUpdate: (repan) => dispatch(triggerMapUpdate(repan)),
    // triggerMapUpdate: (v) => dispatch(triggerMapUpdate(v)),
  };
};


// const mapDispatchToProps = (dispatch) => {
//   return {
//     pushHistory: (url) => dispatch(push(url)),
//     setStateValue: (key, value) => dispatch(setStateValue(key, value)),
//     setUserLocation: (coordinates) => dispatch(setUserLocation(coordinates)),
//     triggerMapUpdate: (repan) => dispatch(triggerMapUpdate(repan)),
//     resetStateKeys: (keys) => dispatch(resetStateKeys(keys)),
//   };
// };


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(translate("translations")(ListVue)));
