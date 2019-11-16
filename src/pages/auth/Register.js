import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { translate } from "react-i18next";
import CssBaseline from "@material-ui/core/CssBaseline";

import PropTypes from "prop-types";
import { registerUser } from "../../actions/auth";
import { destructServerErrors, hasError, getError } from "../../helpers/error";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

// const SignIn = React.lazy(() => import("./SignIn"));
// import GoogleSignIn from "../../GoogleSignIn";

const propTypes = {
  registerUser: PropTypes.func.isRequired,
  // googleSignIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const styles = theme => ({
  // root: {
  //   flexGrow: 1
  // },
  // firstContainer: {
  //   marginTop: 48,
  //   marginBottom: 54
  // },
  // paper: {
  //   padding: theme.spacing(2),
  //   margin: "auto",
  //   maxWidth: 500
  // },
  button: {
    marginTop: theme.spacing(3),
    float: "right"
  },
  signin: {
    margin: theme.spacing(1),
    float: "left"
  }
});

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      errors: "",
      SignInFormVisible: false,
      open: true
    };
  }

  registerSuccess() {
    this.setState({ open: false });
    this.handleClose();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props
      .registerUser(this.state)
      .then(response => this.registerSuccess())
      .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        ...{ [e.target.name]: "" }
      }
    });
  }

  openSignIn = () => {
    this.setState({ anchorEl: null, SignInFormVisible: true });
    this.handleMobileMenuClose();
  };

  handleClose = () => {
    this.props.handleClose();
  };

  render() {
    const { t, fullScreen, classes } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <CssBaseline />
        {/* <form onSubmit={e => this.handleSubmit(e)} method="POST"> */}
        <DialogTitle id="form-dialog-title">Please Register</DialogTitle>
        <DialogContent>
          <form onSubmit={e => this.handleSubmit(e)} method="POST">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstname"
                  value={this.state.firstname}
                  onChange={e => this.handleInputChange(e)}
                  //   id="username"
                  id="firstname"
                  //   name="name"
                  variant="outlined"
                  label={t("register.firstname")}
                  type="text"
                  required
                  autoFocus
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="lname"
                  name="lastname"
                  value={this.state.lastname}
                  onChange={e => this.handleInputChange(e)}
                  id="lastname"
                  variant="outlined"
                  label={t("register.lastname")}
                  type="text"
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  value={this.state.email}
                  onChange={e => this.handleInputChange(e)}
                  id="email"
                  name="email"
                  type="email"
                  variant="outlined"
                  // errorText = "Please Enter valid email"
                  label={t("register.email")}
                  autoComplete="email"
                  required
                  fullWidth                
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={this.state.password}
                  onChange={e => this.handleInputChange(e)}
                  type="password"
                  id="password"
                  name="password"
                  variant="outlined"
                  label={t("register.password")}
                  minLength={6}
                  autoComplete="current-password"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={this.state.password_confirmation}
                  onChange={e => this.handleInputChange(e)}
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  variant="outlined"
                  label={t("register.password")}
                  minLength={6}
                  fullWidth
                  required
                />
              </Grid>

              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Register
                </Button>
              </DialogActions>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

Register.propTypes = propTypes;

Register.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

// const mapDispatchToProps = { registerUser };
function mapDispatchToProps(dispatch) {
  return {
    registerUser: registerUser(dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(
  withRouter(
    withStyles(styles)(withMobileDialog({ breakpoint: "xs" })(translate("translations")(Register)))
  )
);
