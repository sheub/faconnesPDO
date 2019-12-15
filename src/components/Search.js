import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Geocoder from "./Geocoder";
import MyPlaceName from "./MyPlaceName";
import CloseButton from "./CloseButton";
import PlaceInfo from "./PlaceInfo";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import directionsIcon from "../assets/directions.svg";
import SearchIcon from "@material-ui/icons/Search";

import {
  triggerMapUpdate,
  setDirectionsLocation,
  getPlaceInfo,
  resetStateKeys,
  setStateValue,
} from "../actions/index";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

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
      modeString: "Geocoder",
    };
  }

  handleDrawerOpen = () => {
    this.props.setDrawerState(true);
  };

  handleDrawerClose = () => {
    this.props.setDrawerState(false);
  };

  render() {
    const { open, classes } = this.props;
    let SearchBar;

    if (this.props.searchLocation === null) {
      // no place was selected yet
      SearchBar = (
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
      );
    } else {
      // There is a selected place
      SearchBar = (
        <div
          className={
            this.styles.input +
            " flex-parent flex-parent--center-cross flex-parent--center-main"
          }
        >
          <div className="w-full w240-mm pr42 txt-truncate">
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
          <div
            id="search-directions"
            className={"mr30 cursor-pointer right " + this.styles.icon}
            onClick={() => this.clickDirections()}
          >
            <img src={directionsIcon} alt="directions" />
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
          <CloseButton
            show={
              this.props.searchString !== "" ||
              this.props.searchLocation !== null
            }
            on
            Click={() => this.closeSearch()}
          />

          < SearchIcon className={classes.searchIcon}
            // conditional display of the search icon
            style={{display: ((this.props.searchString !== "" || this.props.searchLocation !== null) ? "none" : "inline-flex") }}
          />

          {this.props.searchLocation && this.props.placeInfo ? (
            <PlaceInfo
              info={this.props.placeInfo}
              clickDirections={() => this.clickDirections()}
            />
          ) : null}
        </div>

        <FormGroup row className={classes.switchButton}>
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
        </FormGroup>
      </div>
    );
  }

  onSelect(data) {
    this.props.writeSearch(data.place_name);
    this.props.setSearchLocation(data);
    this.props.triggerMapUpdate("repan");
    // if (data.place_name) this.props.getPlaceInfo(data.place_name);
    if (data.properties.wikidata)
      this.props.getPlaceInfo(data.properties.wikidata);
  }

  closeSearch() {
    this.props.resetStateKeys(["searchString", "searchLocation", "placeInfo"]);
    this.props.triggerMapUpdate();
  }

  clickDirections() {
    this.props.setMode("directions");
    this.props.writeSearch(this.props.searchLocation.place_name);
    this.props.setDirectionsLocation("to", this.props.searchLocation);
  }

  handleSwitchChange() {
    this.setState({ checkedA: !this.state.checkedA });
    if (this.state.checkedA) {
      this.props.setMode("localAutocomplete");
      this.setState({ modeString: "Local search" });
    } else {
      this.props.setMode("search");
      this.setState({ modeString: "Geocoder" });
    }
  }

  get styles() {
    return {
      main: "h42 bg-white shadow-darken25 flex-parent flex-parent--row flex-parent--space-between-main round-bold-xs",
      input: "input h42 border--transparent",
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
  setDirectionsLocation: PropTypes.func,
  setMode: PropTypes.func,
  setPlaceInfo: PropTypes.func,
  setSearchLocation: PropTypes.func,
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
    setDirectionsLocation: (kind, location) =>
      dispatch(setDirectionsLocation(kind, location)),
    setMode: mode => dispatch(setStateValue("mode", mode)),
    setPlaceInfo: info => dispatch(setStateValue("placeInfo", info)),
    setSearchLocation: location =>
      dispatch(setStateValue("searchLocation", location)),
    triggerMapUpdate: repan => dispatch(triggerMapUpdate(repan)),
    writeSearch: input => dispatch(setStateValue("searchString", input)),
    setDrawerState: drawerOpen =>
      dispatch(setStateValue("drawerOpen", drawerOpen)),
  };
};

export { Search };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Search));
