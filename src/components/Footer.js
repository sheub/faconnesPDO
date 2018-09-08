import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
    footerStyle: {
        textAlign: "center",
        color: "white",
        position: "absolute",
        bottom: 0,
        display: "flex",
        width: "100%",
        height: "100px",
        borderTop: "1px",
        borderColor: "black",
        borderTopStyle: "solid",
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingTop:"30px",
        boxSizing: "border-box"
    },

    fontStyle: {
        color: "#808080",
        marginBottom: "18px",
        border: 0,
        fontFamily: "Source Sans Pro",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 500,
        margin: 0,
        outline: 0,
        padding: 0,
        verticalAlign: "baseline",
        lineHeight: "30px",

    }
})

class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.footerStyle}>
        <Typography variant="title" className={classes.fontStyle}>Zoestha UG</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Footer);