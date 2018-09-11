import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Impressum from "./Impressum.js"

const styles = (theme) => ({
    footerStyle: {
        textAlign: "center",
        color: "white",
        position: "absolute",
        bottom: 0,
        display: "flex",
        width: "100%",
        height: "100px",
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingTop:"30px",
        boxSizing: "border-box"
    },

    fontStyle: {
        color: "#808080",
        marginBottom: "18px",
        border: 0,
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: 500,
        margin: 0,
        outline: 0,
        padding: 0,
        verticalAlign: "baseline",
        lineHeight: "30px",
        cursor: "default",

    }
})

// const mapEl = document.getElementById('map');

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImpressum: false,
    };
    this._onClick = this._onClick.bind(this);
  }
  
  _onClick() {
    this.setState({
      showImpressum: true,
    });
  }

  handleClick = () => {
    this.setState({
      showImpressum: false,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.footerStyle}>
          <Typography variant="title" className={classes.fontStyle} onClick={() => this._onClick()}>Zoestha UG</Typography>
        </div>
        {this.state.showImpressum ?
          <Impressum onClose={this.handleClose}/> :
          null
        }
      </div>

    );
  }
}

export default withStyles(styles)(Footer);