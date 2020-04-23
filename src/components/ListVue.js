import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { triggerMapUpdate, setStateValue } from "../actions/index";
import turfDistance from "@turf/distance";

import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import {returnImage} from "../utils/displayUtils";


import "./PopupInfo.css";

const styles = theme => ({

  listContainer: {
    display: "flex",
    flexDirection: "column",
    height: "33vh",
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

  blockWithText: {
    overflow: "hidden",
    padding: 0,
    letterSpacing: "-0.3px",
  },

  listItemIconClass: {
    marginRight: "3px",
    marginLeft: "-16px",
    verticalAlign: "top"
  },

  ListItemStyle: {
    paddingRight: "16px",
    cursor: "default"
  },

});

class ListVue extends React.Component {

    state = {
      open: true,
      infoPopup: null,
    };

    handleClick(index) {

      let infoItem = this.props.listVueItems[index];
      infoItem.geometry = this.props.listVueItems[index]._geometry;
      infoItem.layerId = this.props.listVueItems[index].layer.id;
      infoItem.listVueActive = true;
      infoItem.paintColor = this.props.listVueItems[index].layer.paint["circle-color"];
      infoItem.place_name = this.props.listVueItems[index].properties.label_fr;
      // infoItem.popupActive = true;
      infoItem.featureId = this.props.listVueItems[index].id;

      this.props.setStateValue("infoPopup", infoItem);
      this.props.setStateValue("popupActive", true);


      // Update the searchLocation so that the marker is jumping from position to position
      this.props.setStateValue("searchLocation", {
        type: "Feature",
        place_name: infoItem.place_name,
        properties: infoItem.properties,
        geometry: infoItem.geometry,
        layerId: infoItem.layerId,
        paintColor: infoItem.paintColor,
        featureId: infoItem.featureId,
        popupActive: true,
        listVueActive: true
      });
      this.props.triggerMapUpdate();

    }

    hideListVue() {
      this.props.setStateValue("listVueActive", false);
    }

    ListVueMainItem(item, index, coorOnClick) {

      const lang = this.props.i18n.language;
      const { classes } = this.props;
      var distance = turfDistance(coorOnClick, item.geometry.coordinates);
      distance = (distance.toFixed(2)).toString();

      let info = {};
      info.address = "";
      if ([
        "parcsjardins",
        "localproductshop",
        "craftmanshop",
        "exposition",
        "musique",
        "children",
        "marches",
        "videsgreniers",
        "OTFrance",
        "AiresJeux",
        "WineCelar"].includes(item.layer.id)) {
        info.address = item.properties.address_locality;
      }

      switch (lang) {
      case "fr":
        if (typeof (item.properties.label_fr) !== "undefined")
          info.label = item.properties.label_fr;
        else
          info.label = item.properties.label_en;
        break;

      case "en":
        if (typeof (item.properties.label_en) !== "undefined" && item.properties.label_en)
          info.label = item.properties.label_en;
        else
          info.label = item.properties.label_fr;
        break;

      default:
        if (typeof (item.properties.label_en) !== "undefined")
          info.label = item.properties.label_en;
        else
          info.label = item.properties.label_fr;
        break;
      }

      // else {
      //     info.label = item.properties.label;
      //     info.address = "";//<a target="_new" href={item.properties.link} rel="noopener">&rarr; Wikipedia</a>
      // }
      if (info.address !== "") {
        info.address = info.address + ", " + distance.concat(" kms");
      }
      else {
        info.address = distance.concat(" kms");
      }

      return (

        <ListItem button key={"listItem" + index} className={classes.ListItemStyle} onClick={this.handleClick.bind(this, index)} aria-label={info.label} >
          <ListItemIcon className={classes.listItemIconClass}>
            {returnImage(item.layer.id)}
          </ListItemIcon>
          <ListItemText className={classes.blockWithText} primary={info.label} secondary={info.address} />
        </ListItem>
      );
    };


    render() {
      const { classes } = this.props;
      let listVueActive = this.props.listVueActive;
      const items = this.props.listVueItems;
      let coorOnClick = this.props.coorOnClick;

      let styleListVue = { zIndex: 0 };
      if (!listVueActive) {
        styleListVue = { zIndex: -1, height: 0 };
      }

      if ((typeof (items) !== "undefined") && items.length) {
        return (
          <div className={classes.listContainer} style={styleListVue}>

            <List dense={true} className={classes.listRoot} component="div" disablePadding
              subheader={
                <ListSubheader component="div"> {items.length} Attractions
                  <div className={classes.btnClose} aria-label="Close">
                    <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hideListVue()}>
                      <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                    </IconButton>
                  </div>
                </ListSubheader>
              }

            >
              <div className={classes.listItemClass}>
                {
                  items.map((member, index) => {
                    return this.ListVueMainItem(member, index, coorOnClick);
                  })
                }
              </div>
            </List>
          </div>
        );
      }
      return null;
    }

    get styles() {
      return {
        input: "input px42 h42 border--transparent"
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
  featureId: PropTypes.number,
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
    featureId: state.app.infoPopup.featureId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStateValue: (key, value) => dispatch(setStateValue(key, value)),
    setInfoPopup: (infoPopup) => dispatch(setStateValue("infoPopup", infoPopup)),
    triggerMapUpdate: (v) => dispatch(triggerMapUpdate(v))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(translate("translations")(ListVue)));
