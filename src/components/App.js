import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Map from "./Map";
import { setStateFromURL } from "../actions/index";
import AppbarDrawer from "./AppbarDrawer";

import "./myAssembly.css";

// const MyDrawer = React.lazy(() => import("./MyDrawer"));
const ListVue = React.lazy(() => import("./ListVue"));
const Search = React.lazy(() => import("./Search"));// import Search from "./Search";
const Directions = React.lazy(() => import("./Directions"));
const MyPlaceInfo = React.lazy(() => import("./MyPlaceInfo"));


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
        {/* <React.Suspense fallback={<div> Loading Marvelous...</div>}> */}
          <AppbarDrawer />
        {/* </React.Suspense> */}
        <div id="mapCont">
          <Map moveOnLoad={moveOnLoad} />
          <div className="relative fr m12 w240 flex-parent flex-parent--column">
            {
              (this.props.mode === "directions")
                ? <React.Suspense fallback={<div> Loading Directions...</div>}>
                  <Directions />
                </React.Suspense>
                : <React.Suspense fallback={<div> Loading Search...</div>}>
                  <Search />
                </React.Suspense>
            }
            {(this.props.searchLocation && this.props.searchLocation.properties) ?
              <React.Suspense fallback={<div> </div>}>
                <MyPlaceInfo info={this.props.searchLocation} isActive={true} />
              </React.Suspense>
              : null
            }

            {(this.props.listVueActive && this.props.listVueItems) ?
              <React.Suspense fallback={<div> </div>}>
                <ListVue listVueActive={this.props.listVueActive} listVueItems={this.props.listVueItems} coorOnClick={this.props.coorOnClick} />
              </React.Suspense>
              : null
            }

          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  searchLocation: PropTypes.object,
  listVueActive: PropTypes.bool,
  listVueItems: PropTypes.array,
  coorOnClick: PropTypes.array,
  mode: PropTypes.string,
  route: PropTypes.object,
  routeStatus: PropTypes.string,
  setStateFromURL: PropTypes.func,
  url: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    listVueActive: state.app.listVueActive,
    listVueItems: state.app.listVueItems,
    coorOnClick: state.app.coorOnClick,
    mode: state.app.mode,
    route: state.app.route,
    routeStatus: state.app.routeStatus,
    searchLocation: state.app.searchLocation,
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
