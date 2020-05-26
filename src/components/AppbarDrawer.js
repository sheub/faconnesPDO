import React from "react";
import { connect } from "react-redux";
import { setStateValue } from "../actions/index";
import PropTypes from "prop-types";

const MyDrawer = React.lazy(() => import("./MyDrawer"));

class AppbarDrawer extends React.Component {
  handleDrawerClose = () => {
    this.props.setDrawerState(false);
  };

  render() {
    return (
      <div style={{ float: "left" }}>
        {this.props.drawerOpen ? (
          <React.Suspense fallback={<div> Loading Marvelous Drawer...</div>}>
            <MyDrawer
              open={this.props.drawerOpen}
              handleDrawerClose={this.handleDrawerClose}
            />
          </React.Suspense>
        ) : null}
      </div>
    );
  }
}

AppbarDrawer.propTypes = {
  drawerOpen: PropTypes.bool,
  setDrawerState: PropTypes.func,
};

const mapStateToProps = (state) => {
  return { drawerOpen: state.app.drawerOpen };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDrawerState: (drawerOpen) =>
      dispatch(setStateValue("drawerOpen", drawerOpen)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppbarDrawer);
