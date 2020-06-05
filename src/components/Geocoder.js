// forked from https://github.com/mapbox/react-geocoder
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import MyPlaceName from "./MyPlaceName";
import xhr from "xhr";
import {displayColors, layersArray} from "../utils/displayUtils";

import {
  setStateValue,
  triggerMapUpdate
} from "../actions/index";

/**
 * Geocoder component: connects to endpoint: 'https://api-adresse.data.gouv.fr
 * and provides an autocompleting interface for finding locations.
 */
class Geocoder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      focus: null,
      loading: false,
      searchTime: new Date(),
      geocode: true,
      source: this.props.source,
      endpoint: this.props.endpoint,
      iconColor: "rgba(0, 0, 0, .25)",
    };

    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResult = this.onResult.bind(this);
  }

  componentDidMount() {
    if (this.props.focusOnMount && this.input) this.input.focus();
  }

  onInput(e) {
    this.setState({ loading: true });
    var value = e.target.value;
    if (value.length < 3) {
      this.setState({
        results: [],
        focus: null,
        loading: false,
      });
    } else {
      this.switchGeocoder(this.props.searchMode);
      search(
        this.state.endpoint,
        this.state.source,
        // this.props.accessToken,
        this.props.proximity,
        this.props.bbox,
        this.props.types,
        value,
        this.onResult,
      );
    }
    this.props.writeSearch(value);
  }

  moveFocus(dir) {
    if (this.state.loading) return;
    this.setState({
      focus:
        this.state.focus === null
          ? 0
          : Math.max(
            0,
            Math.min(this.state.results.length - 1, this.state.focus + dir),
          ),
    });
  }

  acceptFocus() {
    if (this.state.focus !== null) {
      this.props.onSelect(this.state.results[this.state.focus]);
    }
  }

  onKeyDown(e) {
    switch (e.which) {
    // up
    case 38:
      e.preventDefault();
      this.moveFocus(-1);
      break;
      // down
    case 40:
      this.moveFocus(1);
      break;
      // accept
    case 13:
      if (this.state.results.length > 0 && this.state.focus === null) {
        this.clickOption(this.state.results[0], 0);
      }  else {
        this.props.setListVueActive(false);
        this.resultsGeocoder = null;
      }

      this.acceptFocus();
      break;

    default:
      break;
    }
  }

  onResult(err, res, body, searchTime) {
    // searchTime is compared with the last search to set the state
    // to ensure that a slow xhr response does not scramble the
    // sequence of autocomplete display.
    if (!err && body && body.features && this.state.searchTime <= searchTime) {
      this.setState({
        searchTime: searchTime,
        loading: false,
        results: body.features,
        focus: null,
      });
      this.props.onSuggest(this.state.results);
    }
  }

  clickOption(place, listLocation) {
    if (!this.state.geocode) {
      place.place_name = place.properties.productName;
    } else place.place_name = place.properties.name;
    this.props.onSelect(place);
    this.setState({ focus: listLocation });
    // focus on the input after click to maintain key traversal
    this.input.focus();
    return false;
  }

  switchGeocoder(searchMode) {
    if (searchMode === "search") {
      this.setState({
        source: "api-adresse.data.gouv.fr",
        endpoint: "https://api-adresse.data.gouv.fr",
        geocode: true,
      });
    } else {
      var url = "";
      if (process.env.NODE_ENV === "production") {
        url = "https://faconnes.de/current/public/";//process.env.REACT_APP_API_ENTRYPOINT;
        // url = "process.env.PUBLIC_URL/";
      } else {
        url = "http://127.0.0.1:8000/";
      }

      this.setState({
        endpoint: url,
        source: "autocomplete",
        geocode: false,
      });
    }
  }

  getColorLayer(property_id) {
    // get layerindex and return corresponding layerColor
    if (typeof property_id === "undefined") {
      return "gray";
    }
    var layerIndex = parseInt(property_id.substring(2, 4));
    return displayColors[layersArray[layerIndex]];
  }

  // backup just after {input} ~195
  renderGeocoderResults() {
    // {this.state.results.length > 0 && this.props.searchString !== "" &&
    if(!this.state.results.length) {
      return null;
    } else {
      return (
        <ul className={this.props.resultsClass}>
          {this.state.results.map((result, i) => (
            <li
              key={result.properties.id}
              className={
                (i === this.state.focus
                  ? "bg-blue-faint"
                  : "bg-gray-faint-on-hover") +
              " h36 flex-parent flex-parent--center-cross pr12 cursor-pointer w-full"
              }
              onClick={this.clickOption.bind(this, result, i)}
            >
              {/* list display */}
              <div className="absolute flex-parent flex-parent--center-cross flex-parent--center-main w24 h42">
                {/* feature_id getColorLayer */}
                <svg
                  className="icon"
                  style={{
                    color: this.getColorLayer(result.properties.id),
                  }}
                >
                  <use xlinkHref="#icon-marker"></use>
                </svg>
              </div>
              <div
                className="pl24 pr12 txt-truncate"
                key={result.properties.id}
              >
                <MyPlaceName location={result} />
              </div>
            </li>
          ))}
        </ul>
      );
    }
  }

  render() {
    var input = (
      <input
        ref={(input) => {
          this.input = input;
        }}
        className={this.props.inputClass}
        onInput={this.onInput}
        onKeyDown={this.onKeyDown}
        value={this.props.searchString}
        onChange={this.onInput}
        placeholder={this.props.inputPlaceholder}
        type="text"
        aria-label="SearchInput"
      />
    );
    if (this.state.results.length > 0) {
      if (this.props.searchMode === "search") {
        this.resultsGeocoder = this.renderGeocoderResults();
      } else {
        // localAutocomplete
        this.props.setListVueItems(this.state.results);
        this.props.setListVueActive(true);
        this.props.triggerMapUpdate();
        this.resultsGeocoder = null;
      }
    } else {
      this.props.setListVueActive(false);
      this.resultsGeocoder = null;
    }

    return (
      <div className="w-full">
        {input}
        {this.resultsGeocoder}
        {this.props.inputPosition === "bottom" && input}
      </div>
    );
  }
}

function search(
  endpoint,
  source,
  // accessToken,
  proximity,
  bbox,
  types,
  query,
  callback,
) {
  // Usually asynchronous calls would happen in the API caller,
  // but the results here are independent from the apps' state
  var searchTime = new Date();
  var uri = "";
  if (source === "api-adresse.data.gouv.fr") {
    uri = endpoint + "/search/?q=";
  } else {
    uri = endpoint + "api/autocompleteaop/";
  }
  uri = uri + encodeURIComponent(query);
  xhr(
    {
      uri: uri,
      json: true,
    },
    function(err, res, body) {
      callback(err, res, body, searchTime);
    },
  );
}

Geocoder.propTypes = {
  // endpoint: PropTypes.string,
  // source: PropTypes.string,
  searchMode: PropTypes.string,
  inputPosition: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  inputClass: PropTypes.string,
  resultsClass: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onSuggest: PropTypes.func,
  // accessToken: PropTypes.string.isRequired,
  proximity: PropTypes.string,
  bbox: PropTypes.string,
  focusOnMount: PropTypes.bool,
  types: PropTypes.string,
  searchString: PropTypes.string,
  writeSearch: PropTypes.func,
  triggerMapUpdate: PropTypes.func,

};

Geocoder.defaultProps = {
  inputPosition: "top",
  inputPlaceholder: "Search",
  // endpoint: "https://api-adresse.data.gouv.fr",
  // source: "api-adresse.data.gouv.fr",
  bbox: "",
  types: "",
  onSuggest: function() {},
  focusOnMount: true,
  searchMode: "search",
};

const mapDispatchToProps = dispatch => {
  return {
    setListVueItems: items => dispatch(setStateValue("listVueItems", items)),
    setListVueActive: value => dispatch(setStateValue("listVueActive", value)),
    triggerMapUpdate: (v) => dispatch(triggerMapUpdate(v)),
  };
};

const mapStateToProps = state => {
  return {
    // accessToken: state.app.mapboxAccessToken,
    searchMode: state.app.mode,
    proximity:
      state.app.mapCoords[2] > 7
        ? state.app.mapCoords.slice(0, 2).join(",")
        : "",
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Geocoder);