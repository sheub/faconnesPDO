import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { translate } from "react-i18next";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import Tooltip from "@material-ui/core/Tooltip";
import isEqual from "lodash/isEqual";
import axios from "axios";
import { getToken } from "../helpers/auth";

class AddToMyPlaces extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userFavoritePlaces: this.props.userFavoritePlaces,
      infoPopup: this.props.info,
      mapScreenshot: this.props.mapScreenshot,
    };
  }

  async uploadMapScreeshot() {
    // var image = this.props.info.properties.thumbnail
    //   ? this.props.info.properties.thumbnail
    //   : this.props.mapScreenshot; // eslint-disable-line max-len
    var url = "http://localhost:8000/api/storeImage";
    if (process.env.NODE_ENV === "production") {
      url = process.env.REACT_APP_API_ENTRYPOINT + "api/storeImage";
    } else {
      url = process.env.REACT_APP_API_ENTRYPOINT + "api/storeImage";
    }

    this.props.info.properties.thumbnail = await this.props.mapScreenshot;
    var token = await getToken();

    // getToken().then(function (token) {
      try {
        // var token = localforage.getItem("authtoken");
        const axiosResult = await axios({
          method: "post",
          url: url,
          data: {
            feature: this.props.info,
          },
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        });
        // if(axiosResult.status === 200) {
        //   // handle success
        //   console.log(axiosResult);
        //   var featureResult = axiosResult.data;

        // }
        // console.log(axiosResult.data);
        return axiosResult.data;
      } catch (error) {
        // handle error
        console.log(error);
        return error;
      }
    // });
  }

  handleClickAddLocation = async () => {
    // var image = this.props.info.properties.thumbnail
    //   ? this.props.info.properties.thumbnail
    //   : this.props.mapScreenshot; // eslint-disable-line max-len

    // this.props.info.properties.thumbnail = image;

    var infoPlace = {
      properties: this.props.info.properties,
      geometry: this.props.info.geometry,
      paintColor: this.props.info.paintColor,
      layerId: this.props.info.layerId,
    };

    // Check if already in Favorites before adding new POI/Event
    if (!this.state.userFavoritePlaces.some((e) => isEqual(e, infoPlace))) {
      // this.uploadMapScreeshot().then(function (uploadResult) {
        var uploadResult = await this.uploadMapScreeshot();
        var url = "http://localhost:8000/stored-screenshots/";
        if (process.env.NODE_ENV === "production") {
          url = "/current/public/stored-screenshots/";
        } else {
          url = process.env.REACT_APP_API_ENTRYPOINT + "/stored-screenshots/";
        }

        // console.log(uploadResult);
        // set image upload url into thumbnail
        infoPlace.properties.thumbnail = url + uploadResult.image_path;

        this.state.userFavoritePlaces.push(infoPlace);
      }
      // );
    // }
  };

  render() {
    if (typeof this.props.info === "undefined" || this.props.info === null) {
      return null;
    }

    return (
      <div>
        <Tooltip
          title="Add this location to my favorites"
          aria-label="Add this location to my favorites"
        >
          <AddLocationIcon
            style={{ cursor: "pointer", width:"32px", height:"32px"}}
            color="secondary"
            onClick={this.handleClickAddLocation.bind(this)}
          />
        </Tooltip>
      </div>
    );
  }
}
AddToMyPlaces.propTypes = {
  infoPopup: PropTypes.object,
  userFavoritePlaces: PropTypes.array,
  mapScreenshot: PropTypes.string,
  // languageSet: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    infoPopup: state.app.infoPopup,
    mapScreenshot: state.app.mapScreenshot,
    userFavoritePlaces: state.app.userFavoritePlaces,
  };
};

export default connect(mapStateToProps)(
  translate("translations")(AddToMyPlaces),
);
