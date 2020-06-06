import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Geocoder from "./Geocoder";
import MyPlaceName from "./MyPlaceName";
// import CloseButton from "./CloseButton";
import PlaceInfo from "./PlaceInfo";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import SearchIcon from "@material-ui/icons/Search";
import {layersArray} from "../utils/displayUtils";

import {
  triggerMapUpdate,
  getPlaceInfo,
  resetStateKeys,
  setStateValue,
  setStateValues,
} from "../actions/index";

// import FormGroup from "@material-ui/core/FormGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Switch from "@material-ui/core/Switch";

const styles = theme => ({
  menuButton: {
    marginLeft: 0,
    marginRight: 0,
  },

  menuButtonHidden: {
    display: "none",
  },

  searchIcon: {
    display: "inline-flex",
    height: 24,
    width: 24,
    color: "gainsboro",
    margin: "auto",
    marginRight: 8,
  },
  switchButton: {
    height: 0,
  },
});

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drawerOpen: true,
      checkedA: true,
      modeString: "Event Search",
    };
  }

  handleDrawerOpen = () => {
    this.props.setDrawerState(true);
  };

  // handleDrawerClose = () => {
  //   this.props.setDrawerState(false);
  // };

  render() {
    const { open, classes } = this.props;
    let SearchBar;

    if (this.props.searchLocation === null) {
      // no place was selected yet
      SearchBar = (
        <div style={{ display: "contents" }}>
          <Geocoder
            onSelect={data => this.onSelect(data)}
            searchString={this.props.searchString}
            writeSearch={value => {
              this.props.triggerMapUpdate();
              this.props.writeSearch(value);
            }}
            resultsClass={this.styles.results}
            inputClass={this.styles.input}
            focusOnMount={true}
            source={this.state.source}
            endpoint={this.state.endpoint}
          />
          <SearchIcon
            className={classes.searchIcon}
            // conditional display of the search icon
            // style={{display: ((this.props.searchString !== "" || this.props.searchLocation !== null) ? "none" : "inline-flex") }}
          />
        </div>
      );
    } else {
      // There is a selected place
      SearchBar = (
        <div
          className={
            this.styles.input +
            " flex-parent flex-parent--center-cross flex-parent--space-between-main"
          }
          style={{ maxWidth: "362px" }}
          // style={{borderRadius: "8px"}}
        >
          <div
            className="pr42 txt-truncate w-full"
            style={{ maxWidth: "362px" }}
          >
            {/*w-full w240-mm */}
            <MyPlaceName
              location={this.props.searchLocation}
              onClick={() => {
                this.props.writeSearch(this.props.searchLocation.place_name);
                this.props.resetStateKeys(["searchLocation", "placeInfo"]);
              }}
            />
            {/* { (this.props.searchLocation && this.props.searchLocation.properties) ?
            <MyPlaceInfo info={this.props.searchLocation} isActive={true} />
            : null
        } */}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className={this.styles.main}>
          <Tooltip title="Menu">
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                open && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          {SearchBar}
          {/* <CloseButton
            show={
              this.props.searchString !== "" ||
              this.props.searchLocation !== null
            }
            on
            Click={() => this.closeSearch()}
          /> */}

          {this.props.searchLocation && this.props.placeInfo ? (
            <PlaceInfo
              info={this.props.placeInfo}
            />
          ) : null}
        </div>

        {/* <FormGroup row className={classes.switchButton}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.checkedA}
                onChange={() => this.handleSwitchChange()}
                value="checkedA"
              />
            }
            label={this.state.modeString}
          />
        </FormGroup> */}
      </div>
    );
  }

  getLayerId(property_id) {
    // get layerindex and return corresponding layerColor
    if (typeof property_id === "undefined") {
      return "gray";
    }
    var layerIndex = parseInt(property_id.substring(2, 4));
    return layersArray[layerIndex];
  }


  onSelect(data) {
    if (typeof data.place_name == "undefined") {
      data.place_name = data.properties.city;
    }
    // If search mode is geocoder -> do zoom in to place
    if (this.state.checkedA) {

      this.props.writeSearch(data.place_name);
      this.props.setSearchLocation(data);
      this.props.setInfoPopup(data);
      this.props.triggerMapUpdate("repan");

      // otherwize search mode is local search set filterString to layers
    } else {
      data.layerId = this.getLayerId(data.properties.featureId);
      this.props.setStateValues({
        filterString: data.place_name,
        needMapFilterString: true,

      });

      this.props.triggerMapUpdate();
    }
  }

  handleSwitchChange() {
    this.setState({ checkedA: !this.state.checkedA });
    if (this.state.checkedA) {
      this.props.setSearchMode("search");
      this.setState({ modeString: "Geocoder" });
    } else {
      this.props.setSearchMode("localAutocomplete");
      this.setState({ modeString: "Event search" });
    }
  }

  get styles() {
    return {
      main: "h42 bg-white shadow-darken25 flex-parent flex-parent--row flex-parent--flex-start-main round-bold",
      input: "input h42 border--transparent pr6",
      results: "results bg-white shadow-darken25 mt6 border-darken10",
    };
  }
}

Search.propTypes = {
  getPlaceInfo: PropTypes.func,
  placeInfo: PropTypes.object,
  resetStateKeys: PropTypes.func,
  searchLocation: PropTypes.object,
  searchString: PropTypes.string,
  setSearchMode: PropTypes.func,
  setPlaceInfo: PropTypes.func,
  setSearchLocation: PropTypes.func,
  setStateValues: PropTypes.func,
  triggerMapUpdate: PropTypes.func,
  writeSearch: PropTypes.func,
  setDrawerState: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    placeInfo: state.app.placeInfo,
    searchLocation: state.app.searchLocation,
    searchString: state.app.searchString,
    modeString: state.app.mode,
    drawerOpen: state.app.drawerOpen,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPlaceInfo: id => dispatch(getPlaceInfo(id)),
    resetStateKeys: keys => dispatch(resetStateKeys(keys)),
    setSearchMode: mode => dispatch(setStateValue("mode", mode)),
    setPlaceInfo: info => dispatch(setStateValue("placeInfo", info)),
    setInfoPopup: info => dispatch(setStateValue("infoPopup", info)),
    setSearchLocation: location => dispatch(setStateValue("searchLocation", location)),
    setStateValues: obj => dispatch(setStateValues(obj)),
    triggerMapUpdate: repan => dispatch(triggerMapUpdate(repan)),
    writeSearch: input => dispatch(setStateValue("searchString", input)),
    setDrawerState: drawerOpen => dispatch(setStateValue("drawerOpen", drawerOpen)),
  };
};

export { Search };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Search));
