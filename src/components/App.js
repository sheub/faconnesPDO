import PropTypes from "prop-types";
import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import Map from "./Map";
import { setStateFromURL, setStateValue } from "../actions/index";

import "./myAssembly.css";

const ListVue = React.lazy(() => import("./ListVue"));
const Search = React.lazy(() => import("./Search"));
const MyPlaceInfo = React.lazy(() => import("./MyPlaceInfo"));
const MyDrawer = React.lazy(() => import("./MyDrawer"));


class App extends Component {
  componentWillMount() {
    this.props.setStateFromURL();
  }
  handleDrawerClose = () => {
    this.props.setDrawerState(false);
  };

  render() {
    var moveOnLoad = !this.props.url
      .split("/")
      .filter(e => e.startsWith("+") || e.startsWith("@")).length;

    let styleSearch =
      window.innerWidth > 340
        ? { margin: "12px",  maxWidth: "408px" }
        : { margin: 0, marginTop: "8px" }; //width: "100vw",
    return (
      <Router>
        <div className="root">
          <React.Suspense fallback={<div> Loading Marvelous Drawer...</div>}>
            <MyDrawer
              // open={this.props.drawerOpen}
              handleDrawerClose={this.handleDrawerClose}
            />
          </React.Suspense>


          <div id="mapCont">
            <Map moveOnLoad={moveOnLoad} />
            <div
              className="relative fl m12 flex-parent flex-parent--column w-full-xs"
              style={styleSearch}
            >

              <React.Suspense fallback={<div> Loading Search...</div>}>
                <Search />
              </React.Suspense>

              {this.props.searchLocation &&
              this.props.searchLocation.properties ? (
                  <React.Suspense fallback={<div> </div>}>
                    <MyPlaceInfo/>
                  </React.Suspense>
                ) : null}

              {this.props.listVueActive && this.props.listVueItems ? (
                <React.Suspense fallback={<div> </div>}>
                  <ListVue
                    listVueActive={this.props.listVueActive}
                    listVueItems={this.props.listVueItems}
                    coorOnClick={this.props.coorOnClick}
                  />
                </React.Suspense>
              ) : null}
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  searchLocation: PropTypes.object,
  listVueActive: PropTypes.bool,
  listVueItems: PropTypes.array,
  coorOnClick: PropTypes.array,
  mode: PropTypes.string,
  setStateFromURL: PropTypes.func,
  url: PropTypes.string,
  setDrawerState: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    listVueActive: state.app.listVueActive,
    listVueItems: state.app.listVueItems,
    coorOnClick: state.app.coorOnClick,
    mode: state.app.mode,
    searchLocation: state.app.searchLocation,
    url: state.router.location.pathname,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setStateFromURL: () => dispatch(setStateFromURL()),
    setDrawerState: (drawerOpen) =>
      dispatch(setStateValue("drawerOpen", drawerOpen)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
