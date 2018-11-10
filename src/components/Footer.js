import React, { Component } from "react";
import { I18n } from 'react-i18next';
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import About from "./About.js"
const Impressum = React.lazy(() => import("./ImpressumFr.js"));


const styles = () => ({
  footerStyle: {
    textAlign: "center",
    color: "white",
    position: "absolute",
    bottom: 0,
    display: "block",
    width: "100%",
    height: "100px",
    paddingLeft: "30px",
    paddingRight: "30px",
    paddingTop: "30px",
    boxSizing: "border-box"
  },

  fontStyle: {
    color: "#808080",
    fontSize: "12px",
    paddingLeft: "4px",
    marginBottom: "9px",
    cursor: "pointer",
    display: "inline-block",
  }
})

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImpressum: false,
      showAbout: false,
    };

    this._onClick = this._onClick.bind(this);
    this._onClickAbout = this._onClickAbout.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  _onClick() {
    if (!this.state.showImpressum) {
      this.setState({ showImpressum: true });
      this.setState({ showAbout: false });
    }
    else {
      this.setState({ showImpressum: false });
    }
  }

  _onClickAbout() {
    if (!this.state.showAbout) {
      this.setState({ showAbout: true });
      this.setState({ showImpressum: false });
    }
    else {
      this.setState({ showAbout: false });
    }
  }

  handleClose = () => {
    this.setState({
      showImpressum: false,
      showAbout: false,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <I18n ns="translations">
        {
          (t, { i18n }) => (

            <div className={classes.root}>
              <div>
                <div className={classes.footerStyle}>
                  <Typography variant="h6" className={classes.fontStyle} onClick={() => this._onClickAbout()}> {t("about")} |</Typography>
                  <Typography variant="h6" className={classes.fontStyle} onClick={() => this._onClick()}> {t("legalNotice")}</Typography>
                  <Typography variant="h6" className={classes.fontStyle} style={{cursor: "default", display: "block" }} >&copy;Zoestha UG </Typography>
                </div>
                {this.state.showImpressum ?
                  <React.Suspense fallback={<div> </div>}>
                    <Impressum handleClose={this.handleClose} />
                  </React.Suspense>
                  : null
                }

                {this.state.showAbout ?
                  <About handleClose={this.handleClose} /> : null
                }
              </div>
            </div>
          )
        }
      </I18n>
    );
  }
}

export default withStyles(styles)(Footer);