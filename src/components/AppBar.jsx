import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { translate } from "react-i18next";
import { triggerMapUpdate, setStateValues } from "../actions/index";

import classNames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
// import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LanguageIcon from "@material-ui/icons/Language";
import PropTypes from "prop-types";

import "./App.css";
import { logoutUser } from "../actions/auth";

const SignIn = React.lazy(() => import("../pages/auth/SignIn"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const ProfilePage = React.lazy(() => import("./ProfilePage.js"));

const ForwardNavLink = React.forwardRef((props, ref) => (
  <NavLink {...props} innerRef={ref} />
));

const MyLinkToLogout = props => <ForwardNavLink to="/" {...props} />;

export const DefaultTransition = React.forwardRef((props, ref) => (
  <MenuItem {...props} ref={ref} />
));

const styles = theme => ({
  root: {
    flexGrow: 1,
  },

  appBar: {
    zIndex: theme.zIndex.drawer - 1,
    opacity: 0.85,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    minWidth: 320,
    overflow: "hidden",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 20,
    marginRight: 12,
  },
  menuButtonHidden: {
    display: "none",
  },
  titleClass: {
    flexGrow: 1,
  },

  languageButtonClass: {
    marginLeft: "auto",
  },

  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      marginLeft: 0,
    },
  },
});

const drawerWidth = 270;

class MyAppBar extends Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    anchorelanguage: null,
    languageSet: "en",
    SignInFormVisible: false,
    RegisterFormVisible: false,
    showProfilePage: false,
  };

  handleMenuLanguage = event => {
    this.setState({
      anchorelanguage: event.currentTarget,
    });
  };

  handleCloseLanguage = () => {
    this.setState({
      anchorelanguage: null,
    });
  };

  // OpenClose Menu
  handleProfileMenuOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  // open SignIn
  openSignIn = () => {
    this.setState({
      anchorEl: null,
      SignInFormVisible: true,
    });
    this.handleMobileMenuClose();
  };
  // open SignIn
  openRegister = () => {
    this.setState({
      anchorEl: null,
      RegisterFormVisible: true,
    });
    this.handleMobileMenuClose();
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      SignInFormVisible: false,
      RegisterFormVisible: false,
      showProfilePage: false,
    });
  };

  onClickProfilePage() {
    if (!this.state.showProfilePage) {
      this.setState({ showProfilePage: true });
    } else {
      this.setState({ showProfilePage: false });
    }
    this.setState({
      anchorEl: null,
    });
    this.handleMobileMenuClose();
  }

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      showProfilePage: false,
    });
    this.handleMobileMenuClose();
  };

  // OpenClose mobile menu
  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleLogout = () => {
    this.props.logoutUser(() => this.props.history.push("/"));
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  render() {
    const { open, classes, auth, t, i18n } = this.props;
    const { anchorEl, mobileMoreAnchorEl, anchorelanguage } = this.state;
    const openMenuLanguage = Boolean(anchorelanguage);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        {auth.authenticated ? (
          <div>
            <MenuItem
              className="menuButton"
              onClick={() => this.onClickProfilePage()}
            >
              My Profile
            </MenuItem>
            <MenuItem
              className="menuButton"
              component={MyLinkToLogout}
              onClick={this.handleLogout}
            >
              Logout
            </MenuItem>
          </div>
        ) : (
          <div>
            <MenuItem className="menuButton" onClick={this.openSignIn}>
              {t("appbar.signIn")}
            </MenuItem>
            <MenuItem className="menuButton" onClick={this.openRegister}>
              {t("appbar.register")}
            </MenuItem>
          </div>
        )}
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <div>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
            <MenuItem
              className="menuButton"
              onClick={() => this.onClickProfilePage()}
            >
              {t("appbar.myProfile")}
            </MenuItem>
            <MenuItem
              className="menuButton"
              onClick={() => this.handleLogout()}
            >
              {t("appbar.logout")}
            </MenuItem>
          </div>
          {/* <p>Profile</p> */}
        </MenuItem>
      </Menu>
    );

    const changeLanguage = lng => {
      this.setState({
        anchorelanguage: null,
        languageSet: lng,
      });

      this.props.setStateValues({
        languageSet: lng,
        needMapActualizeLanguage: true,
      });

      i18n.changeLanguage(lng);
      this.props.triggerMapUpdate();
    };

    return (
      <div className={classes.root}>
        <CssBaseline />

        <AppBar
          position="absolute"
          className={classNames(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!open}>
            <div className={classes.languageButtonClass}>
              <IconButton
                aria-owns={isMenuOpen ? "material-appbar" : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              <IconButton
                aria-owns={open ? "menu-appbar" : null}
                aria-haspopup="true"
                onClick={this.handleMenuLanguage}
                color="inherit"
                aria-label="Select Language"
              >
                <LanguageIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorelanguage}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={openMenuLanguage}
                onClose={this.handleCloseLanguage}
              >
                <MenuItem onClick={() => changeLanguage("en")}>en</MenuItem>
                <MenuItem onClick={() => changeLanguage("fr")}>fr</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
        {this.state.SignInFormVisible ? (
          <React.Suspense fallback={<div> </div>}>
            <SignIn handleClose={this.handleClose} />
          </React.Suspense>
        ) : null}
        {this.state.RegisterFormVisible ? (
          <React.Suspense fallback={<div> </div>}>
            <Register handleClose={this.handleClose} />
          </React.Suspense>
        ) : null}
        {this.state.showProfilePage ? (
          <React.Suspense fallback={<div> </div>}>
            <ProfilePage handleClose={this.handleClose} />
          </React.Suspense>
        ) : null}
      </div>
    );
  }
}
AppBar.propTypes = {
  // Auth
  // auth: PropTypes.object.isRequired,
  // logoutUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,

  // Others
  languageSet: PropTypes.string,
  needMapActualizeLanguage: PropTypes.bool,
  setStateValues: PropTypes.func,
  triggerMapUpdate: PropTypes.func,
};

const mapDispatchToProps = dispatch => {
  return {
    setStateValues: obj => dispatch(setStateValues(obj)),
    triggerMapUpdate: v => dispatch(triggerMapUpdate(v)),
    // logoutUser: (obj) => dispatch(logoutUser(obj))
    logoutUser: logoutUser(dispatch),
  };
};

// function mapDispatchToProps(dispatch) {
//   return {
//       signIn: signInUser(dispatch)
//   };
// }

const mapStateToProps = state => {
  return {
    languageSet: state.app.languageSet,
    needMapActualizeLanguage: state.app.needMapActualizeLanguage,
    auth: state.auth,
  };
};
export default connect(mapStateToProps, mapDispatchToProps, null, {
  pure: false,
})(withRouter(withStyles(styles)(translate("translations")(MyAppBar))));
