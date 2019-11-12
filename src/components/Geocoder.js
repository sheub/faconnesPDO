// forked from https://github.com/mapbox/react-geocoder
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import MyPlaceName from "./MyPlaceName";
import xhr from "xhr";

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
      endpoint: this.props.endpoint
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
    if (value === "") {
      this.setState({
        results: [],
        focus: null,
        loading: false
      });
    } else {
      this.switchGeocoder(this.props.searchMode);
      search(
        this.state.endpoint,
        this.state.source,
        this.props.accessToken,
        this.props.proximity,
        this.props.bbox,
        this.props.types,
        value,
        this.onResult
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
              Math.min(this.state.results.length - 1, this.state.focus + dir)
            )
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
        focus: null
      });
      this.props.onSuggest(this.state.results);
    }
  }

  clickOption(place, listLocation) {
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
        geocode: true
      });
    } else {
      this.setState({
      endpoint: "http://localhost:8080/",
      source: "autocomplete",
      geocode: false
      });
    }
    
  }

  render() {
    var input = (
      <input
        ref={input => {
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

    return (
      <div className="w-full">
        {input}
        {this.state.results.length > 0 && this.props.searchString !== "" && (
          <ul className={this.props.resultsClass}>
            {this.state.results.map((result, i) => (
              <li
                key={result.properties.id}
                className={
                  (i === this.state.focus
                    ? "bg-blue-faint"
                    : "bg-gray-faint-on-hover") +
                  " h36 flex-parent flex-parent--center-cross pr12 cursor-pointer w-full w420-mm"
                }
                onClick={this.clickOption.bind(this, result, i)}
              >
                <div className="absolute flex-parent flex-parent--center-cross flex-parent--center-main w42 h42">
                  <svg className="icon color-darken25">
                    <use xlinkHref="#icon-marker"></use>
                  </svg>
                </div>
                <div
                  className="pl42 pr12 txt-truncate"
                  key={result.properties.id}
                >
                  <MyPlaceName location={result} />
                </div>
              </li>
            ))}
          </ul>
        )}
        {this.props.inputPosition === "bottom" && input}
      </div>      
    );
  }
}

function search(
  endpoint,
  source,
  accessToken,
  proximity,
  bbox,
  types,
  query,
  callback
) {
  // Usually asynchronous calls would happen in the API caller,
  // but the results here are independent from the apps' state
  var searchTime = new Date();
  var uri = "";
  if (source === "api-adresse.data.gouv.fr") {
    uri = endpoint + "/search/?q=";
  } else {
    uri = "http://localhost:8080/" + "autocomplete?q=";
  }
  uri = uri + encodeURIComponent(query);
  xhr(
    {
      uri: uri,
      json: true
    },
    function(err, res, body) {
      callback(err, res, body, searchTime);
    }
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
  accessToken: PropTypes.string.isRequired,
  proximity: PropTypes.string,
  bbox: PropTypes.string,
  focusOnMount: PropTypes.bool,
  types: PropTypes.string,
  searchString: PropTypes.string,
  writeSearch: PropTypes.func
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
  searchMode: "search"
};

const mapStateToProps = state => {
  return {
    accessToken: state.app.mapboxAccessToken,
    searchMode: state.app.mode,
    proximity:
      state.app.mapCoords[2] > 7
        ? state.app.mapCoords.slice(0, 2).join(",")
        : ""
  };
};

export default connect(mapStateToProps)(Geocoder);
