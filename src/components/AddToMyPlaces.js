import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { translate } from "react-i18next";
import AddLocationIcon from "@material-ui/icons/AddLocation";


class AddToMyPlaces extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userFavoritePlaces: this.props.userFavoritePlaces,
            infoPopup: this.props.info,            
        };
    }

    handleClickAddLocation = () => {
        this.state.userFavoritePlaces.push(this.props.info);
    }

    render() {
        if (typeof (this.props.info) === "undefined" || this.props.info === null) { return null; }

        return (
            <div style={{Ccursor:"pointer"}}>
                <AddLocationIcon onClick={this.handleClickAddLocation.bind(this)}/>
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