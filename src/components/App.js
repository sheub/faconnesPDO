import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Map from "./Map";
import MyDrawer from "./MyDrawer";
import Search from "./Search";
import Directions from "./Directions";
import { setStateFromURL } from "../actions/index";

class App extends Component {

  componentWillMount() {
    this.props.setStateFromURL();
  }

  render() {
    var moveOnLoad = !this.props.url
      .split("/")
      .filter(e => e.startsWith("+") || e.startsWith("@"))
      .length;

    return (

      <div className="root">
        <MyDrawer />
        <div id="mapCont">
          <Map moveOnLoad={moveOnLoad} />
          <div className="relative fr m12 w240 flex-parent flex-parent--column">
            {
              (this.props.mode === "directions")
                ? <Directions />
                : <Search />
            }
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  mode: PropTypes.string,
  route: PropTypes.object,
  routeStatus: PropTypes.string,
  setStateFromURL: PropTypes.func,
  url: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    mode: state.app.mode,
    route: state.app.route,
    routeStatus: state.app.routeStatus,
    url: state.router.location.pathname
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStateFromURL: () => dispatch(setStateFromURL())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
