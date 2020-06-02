import PropTypes from "prop-types";
import React, {Component} from "react";

class MyPlaceName extends Component {
    render() {
        var parts = null;
        if (this.props.location.properties) {
            if (typeof (this.props.location.properties.productName) !== "undefined") {
                parts = this.props.location.properties.productName.split(", ");
            }
        }
        else
      if (this.props.location.place_name) { parts = this.props.location.place_name.split(", "); }



        if (parts === null || parts.length < 1) return null;

        var main = parts[0];
        var rest = null;
        if(this.props.location.properties)
        {rest = this.props.location.properties.context; }

        var mainColor, restColor;
        if (this.props.colors === "light") {
            mainColor = "color-white";
            restColor = "color-lighten50";
        } else {
            mainColor = "color-black";
            restColor = "color-darken50";
        }

        var className;
        if (this.props.className) {
            className = this.props.className;
        } else {
            className = "txt-truncate w-full";
        }

        return (
      <div className={className} onClick={() => this.props.onClick()}>
        {
          main === "__loading"
          ? <div className={"loading loading--s " + (this.props.colors === "light" ? "loading--dark" : "")}></div>
          : <div className={"inline pr6 " + mainColor}>{main}</div>
        }
        <div className={"inline txt-s " + restColor}>{rest}</div>
      </div>
        );
    }
}

MyPlaceName.propTypes = {
    colors: PropTypes.string,
    className: PropTypes.string,
    location: PropTypes.object,
    onClick: PropTypes.func
};

MyPlaceName.defaultProps = {
    onClick: function () {}
};

export default MyPlaceName;
