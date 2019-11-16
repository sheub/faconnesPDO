import React, { Component, Suspense } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import PropTypes from "prop-types";
import SignIn from "../pages/auth/SignIn";

import GuestRoute from "./GuestRoute";
import AuthRoute from "./AuthRoute";
import { connect } from "react-redux";
import { setLoading } from "../actions/loading";
import { initAuthFromExistingToken } from "../actions/auth";
import { Route } from "react-router-dom";


import MyAppBar from "./../MyAppBar";

// import "../../App.css";



const propTypes = {
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  initAuthFromExistingToken: PropTypes.func.isRequired
};
class App extends Component {

  
  componentDidMount() {
    this.props.initAuthFromExistingToken(() => this.props.setLoading(false));
    window.App = {
      name: "LocalVue",
    };
  }

  render() {
    return (
      <Router>
        <div className="App">
          <MyAppBar />
        
          <Switch>
            <GuestRoute path="/register" component={Register} />
            <GuestRoute path="/forgot-password" component={ForgotPassword} />
            <GuestRoute path="/password/reset/:token" component={ResetPassword} />
            <GuestRoute path="/signin" component={SignIn} />
          </Switch>

          <Route exact path="/" component={App} />
        </div>
      </Router>

    );
  }
}

App.propTypes = propTypes;

const mapDispatchToProps = {
  setLoading,
  initAuthFromExistingToken
};

const mapStateToProps = ({ loading }) => ({ loading });

export default connect(mapStateToProps, mapDispatchToProps)(App);
