import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { signInUser, facebookSignIn } from "../../actions/auth";
import { destructServerErrors, hasError, getError } from "../../helpers/error";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
  CssBaseline,
  Grid,
  Typography
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

import FacebookIcon from "@material-ui/icons/Facebook";

const Register = React.lazy(() => import("./Register"));

const propTypes = {
  signInUser: PropTypes.func.isRequired,
  facebookSignIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const styles = theme => ({
  submit: {
    marginTop: theme.spacing(3),
    float: "right",
    minWidth: "48px"
  },
  register: {
    marginTop: theme.spacing(3),
    float: "left",
    minWidth: "48px"
  },
  socialButtons: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  }
});

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: "",
      open: true,
      RegisterFormVisible: false
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  signInSuccess() {
    this.setState({ open: false });
    this.handleClose();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props
      .signIn(this.state)
      .then(response => this.signInSuccess())
      .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }

  // open Register
  openRegister = () => {
    this.setState({
      anchorEl: null,
      open: false,
      RegisterFormVisible: true
    });
    // this.handleMobileMenuClose();
  };

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        ...{ [e.target.name]: "" }
      }
    });
  }

  handleSignIn = event => {
    event.preventDefault();
    // history.push('/');
  };

  handleFacebookSubmit(e) {
    e.preventDefault();
    this.props
      .facebookSignIn(this.state)
      .then(response => this.signInSuccess())
      .catch(error => this.setState({ errors: destructServerErrors(error) }));
  }

  handleFacebookSignInSuccess(credentials) {
    this.props
      .facebookSignIn(credentials)
      .then(response => this.signInSuccess())
      .catch(error => this.setState({ errors: destructServerErrors(error) }));
    this.setState({ open: false });
  }

  render() {
    const { fullScreen, classes } = this.props;

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <CssBaseline />

          {/* <form onSubmit={e => this.handleFacebookSubmit(e)} method="POST"> */}
          <Grid className={classes.socialButtons} container spacing={2}>
            <Grid item>
              <Button
                color="primary"
                onClick={e => this.handleFacebookSubmit(e)} 
                method="POST"
                size="large"
                variant="contained"
              >
                <FacebookIcon className={classes.socialIcon} />
                Login with Facebook
              </Button>
            </Grid>
          </Grid>
          <Typography
            align="center"
            className={classes.sugestion}
            color="textSecondary"
            variant="body1"
          >
            or login with email address
          </Typography>
          {/* </form> */}

          <form onSubmit={e => this.handleSubmit(e)} method="POST">
            <DialogTitle id="form-dialog-title">Please Sign In</DialogTitle>
            <DialogContent>
              {/* E-mail textfield */}
              {/* <Grid item xs={12}> */}
              <TextField
                value={this.state.email}
                onChange={e => this.handleInputChange(e)}
                id="email"
                type="email"
                name="email"
                errortext="Please Enter valid email"
                required={true}
                variant="outlined"
                autoFocus
                margin="dense"
                label="Email Address"
                fullWidth
              />
              {hasError(this.state.errors, "email") && (
                <p className="text-red text-xs pt-2">
                  {getError(this.state.errors, "email")}
                </p>
              )}
              {/* </Grid> */}

              {/* Password textfield */}
              <TextField
                value={this.state.password}
                onChange={e => this.handleInputChange(e)}
                type="password"
                id="password"
                name="password"
                required={true}
                margin="dense"
                label="Password"
                variant="outlined"
                fullWidth
              />
            </DialogContent>

            <DialogActions>
              {/* Register */}
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                className={classes.register}
                onClick={this.openRegister}
              >
                Register
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {this.state.RegisterFormVisible ? (
          <React.Suspense fallback={<div> </div>}>
            <Register handleClose={this.handleClose} />
          </React.Suspense>
        ) : null}
      </div>
    );
  }
}

SignIn.propTypes = propTypes;

SignIn.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};
// const mapDispatchToProps = {
//     signInUser
//     // googleSignIn
// };

function mapDispatchToProps(dispatch) {
  return {
    signIn: signInUser(dispatch),
    facebookSignIn: facebookSignIn(dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(
  withRouter(withStyles(styles)(withMobileDialog({ breakpoint: "xs" })(SignIn)))
);
