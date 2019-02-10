import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { translate } from "react-i18next";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import Tooltip from '@material-ui/core/Tooltip';
import isEqual from 'lodash/isEqual';



class AddToMyPlaces extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userFavoritePlaces: this.props.userFavoritePlaces,
            infoPopup: this.props.info,            
        };
    }

    handleClickAddLocation = () => {
        var infoPlace = {properties: this.props.info.properties, geometry: this.props.info.geometry, paintColor: this.props.info.paintColor, layerId: this.props.info.layerId};
        if (!(this.state.userFavoritePlaces.some(e => isEqual(e, infoPlace)))) {
            this.state.userFavoritePlaces.push(infoPlace);
          }
    }

    render() {
        if (typeof (this.props.info) === "undefined" || this.props.info === null) { return null; }

        return (
            <div>
                <Tooltip title="Add this location to my favorites" aria-label="Add this location to my favorites">
                    <AddLocationIcon style={{cursor:"pointer"}} color="secondary" onClick={this.handleClickAddLocation.bind(this)}/>
                </Tooltip>
            </div>
        );
    }
}
AddToMyPlaces.propTypes = {
    infoPopup: PropTypes.object,
    userFavoritePlaces: PropTypes.array,
    languageSet: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        infoPopup: state.app.infoPopup,
        userFavoritePlaces: state.app.userFavoritePlaces,
    }
}


export default connect(mapStateToProps)(translate("translations")(AddToMyPlaces));