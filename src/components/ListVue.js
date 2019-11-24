import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { triggerMapUpdate, setStateValue } from "../actions/index";
import turfDistance from "@turf/distance";

import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import {returnImage} from "../utils/displayUtils";


import "./PopupInfo.css";

const styles = theme => ({

    listContainer: {
        display: "flex",
        flexDirection: "column",
        height: "33vh",
        marginTop: "7px",
        boxShadow: "0 0 10px 2px rgba(0, 0, 0, .25)",
    },

    listRoot: {
        width: "100%",
        backgroundColor: "white",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
        flex: 1,
    },

    listItemClass: {
        backgroundColor: "#FFF",
        position: "absolute",
        right: 0,
        left: 0,
    },

    btnClose: {
        position: "absolute",
        top: "-4px",
        right: "0px",
        cursor: "pointer",
        zIndex: 2,
    },

    blockWithText: {
        overflow: "hidden",
        padding: 0,
        letterSpacing: "-0.3px",
    },

    listItemIconClass: {
        marginRight: "3px",
        marginLeft: "-16px",
        verticalAlign: "top"
    },

    ListItemStyle: {
        paddingRight: "16px",
        cursor: "default"
    },

});

class ListVue extends React.Component {

    state = {
        open: true,
        infoPopup: null,
    };

    handleClick(index) {

        let infoItem = this.props.listVueItems[index];
        infoItem.geometry = this.props.listVueItems[index]._geometry;
        infoItem.layerId = this.props.listVueItems[index].layer.id;
        infoItem.listVueActive = true;
        infoItem.paintColor = this.props.listVueItems[index].layer.paint["circle-color"];
        infoItem.place_name = this.props.listVueItems[index].properties.label_fr;
        infoItem.popupActive = true;

        this.props.setStateValue("infoPopup", infoItem);


        // Update the searchLocation so that the marker is jumping from position to position
        this.props.setStateValue("searchLocation", {
            type: "Feature",
            place_name: infoItem.place_name,
            properties: infoItem.properties,
            geometry: infoItem.geometry,
            layerId: infoItem.layerId,
            paintColor: infoItem.paintColor,
            popupActive: true,
            listVueActive: true
        });
        this.props.triggerMapUpdate();

    }

    hideListVue() {
        this.props.setStateValue("listVueActive", false);
    }

    ListVueMainItem(item, index, coorOnClick) {

        const lang = this.props.i18n.language;
        const { classes } = this.props;
        var distance = turfDistance(coorOnClick, item.geometry.coordinates);
        distance = (distance.toFixed(2)).toString();

        let info = {};
        info.address = "";
        if ([
            "parcsjardins",
            "localproductshop",
            "craftmanshop",
            "exposition",
            "musique",
            "children",
            "marches",
            "videsgreniers",
            "OTFrance",
            "AiresJeux",
            "WineCelar"].includes(item.layer.id)) {
            info.address = item.properties.address_locality;
        }

        switch (lang) {
        case "fr":
            if (typeof (item.properties.label_fr) !== "undefined")
                info.label = item.properties.label_fr;
            else
                    info.label = item.properties.label_en;
            break;

        case "en":
            if (typeof (item.properties.label_en) !== "undefined" && item.properties.label_en)
                info.label = item.properties.label_en;
            else
                    info.label = item.properties.label_fr;
            break;

        default:
            if (typeof (item.properties.label_en) !== "undefined")
                info.label = item.properties.label_en;
            else
                    info.label = item.properties.label_fr;
            break;
        }

        // else {
        //     info.label = item.properties.label;
        //     info.address = "";//<a target="_new" href={item.properties.link} rel="noopener">&rarr; Wikipedia</a>
        // }
        if (info.address !== "") {
            info.address = info.address + ", " + distance.concat(" kms");
        }
        else {
            info.address = distance.concat(" kms");
        }

        return (

            <ListItem button key={"listItem" + index} className={classes.ListItemStyle} onClick={this.handleClick.bind(this, index)} aria-label={info.label} >
                <ListItemIcon className={classes.listItemIconClass}>
                    {returnImage(item.layer.id)}
                </ListItemIcon>
                <ListItemText className={classes.blockWithText} primary={info.label} secondary={info.address} />
            </ListItem>
        );
    };


    render() {
        const { classes } = this.props;
        let listVueActive = this.props.listVueActive;
        const items = this.props.listVueItems;
        let coorOnClick = this.props.coorOnClick;

        let styleListVue = { zIndex: 0 };
        if (!listVueActive) {
            styleListVue = { zIndex: -1, height: 0 };
        }

        if ((typeof (items) !== "undefined") && items.length) {
            return (
                <div className={classes.listContainer} style={styleListVue}>

                    <List dense={true} className={classes.listRoot} component="div" disablePadding
                        subheader={
                            <ListSubheader component="div"> {items.length} Attractions
                                <div className={classes.btnClose} aria-label="Close">
                                    <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hideListVue()}>
                                        <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                                    </IconButton>
                                </div>
                                </ListSubheader>
                        }

                    >
                        <div className={classes.listItemClass}>
                            {
                                items.map((member, index) => {
                                    return this.ListVueMainItem(member, index, coorOnClick);
                                })
                            }
                        </div>
                    </List>
                </div>
            );
        }
        return null;
    }

    get styles() {
        return {
            input: "input px42 h42 border--transparent"
        };
    }
}

ListVue.propTypes = {
    classes: PropTypes.object.isRequired,
    infoPopup: PropTypes.object,
    coorOnClick: PropTypes.array,
    listVueActive: PropTypes.bool,
    listVueItems: PropTypes.array,
    searchLocation: PropTypes.object,
    setInfoPopup: PropTypes.func,
    setStateValue: PropTypes.func,
    triggerMapUpdate: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        // coorOnClick: state.app.coorOnClick,
        listVueActive: state.app.listVueActive,
        infoPopup: state.app.infoPopup,
        searchLocation: state.app.searchLocation,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setStateValue: (key, value) => dispatch(setStateValue(key, value)),
        setInfoPopup: (infoPopup) => dispatch(setStateValue("infoPopup", infoPopup)),
        triggerMapUpdate: (v) => dispatch(triggerMapUpdate(v))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(translate("translations")(ListVue)));



// abstract: "Orchestra room new-Aquitaine - inspired bright program of traditional Gypsy music and popular melodies with Hungarian dances No. 5 and 6, the Double Brahms concerto and Symphony No. 8 Czechoslovakia of Dvorak. From 10 years old"
// abstract_en: "Orchestra room new-Aquitaine - inspired bright program of traditional Gypsy music and popular melodies with Hungarian dances No. 5 and 6, the Double Brahms concerto and Symphony No. 8 Czechoslovakia of Dvorak. From 10 years old"
// abstract_fr: "Orchestre de chambre Nouvelle-Aquitaine - Un programme éclatant inspiré des musiques traditionnelles tziganes et des mélodies populaires avec les Danses hongroises n° 5 et 6, le Double concerto de Brahms et la Symphonie n° 8 Tchécoslovaque de Dvorak.↵↵↵↵À partir de 10 ans"
// address_locality: "Rochefort"
// end_time: 0
// label: "Music : brahms, dvorak"
// label_en: "Music : brahms, dvorak"
// label_fr: "Musique : brahms, dvorak"
// postal_code: 17300
// start_time: 0
// street_address: "["101, rue de la République","Théâtre de la Coupe d'Or"]"
// url: "http://www.theatre-coupedor.com/"
// valid_from: 1553814000000
// valid_through: 1553814000000
// __proto__: Object

// _geometry.coordinates


// abstract_en: "Fans of the space Xavier Rousseau storytellers invite you to the country of the tales of here and elsewhere. Every first Wednesday of the month, they offer to leave to the discovery of a new theme. Young and old will leave with stories full ears and the key of the House of tales..."
// abstract_fr: "Les conteurs amateurs de l’Espace Xavier Rousseau vous invitent au pays des contes d’ici et d’ailleurs. Chaque premier mercredi du mois, ils vous proposent de partir à la découverte d’un nouveau thème. Petits et grands repartiront avec des histoires plein les oreilles et la clé de la maison des contes..."
// address_locality: "Argentan"
// end_time: 0
// label_en: "Story time"
// label_fr: "Heure du conte"
// postal_code: 61200
// start_time: 0
// street_address: "1-3 rue des Rédemptoristes, Médiathèque François Mitterrand"
// url: ""
// valid_from: 1536098400000
// valid_through: 1536098400000

// geometry: {type: "Point", coordinates: Array(2)}
// layerId: "marches"
// listVueActive: true
// paintColor: "#4AA52C"
// place_name: "Marché de noël associatif - 21ème édition"
// popupActive: true
// properties: {abstract_en: "Christmas is 21 years old! How old is Santa? Nobod…rom 11:00 to 18:00 for the occasion, we you [...]", abstract_fr: "Noël a 21 ans ! Quel âge a le Père Noël ? Personne…r place. Pour tout renseignement : 03.26.56.95.24", address_locality: "Val de Livre", end_time: 0, label_en: "Associative Christmas market - 21st edition", …}
// type: "Feature"
// __proto__: Object

// layer: {id: "marches", type: "circle", source: "localEvents", source-layer: "marches", paint: {…}}
// properties: {abstract_en: "Christmas is 21 years old! How old is Santa? Nobod…rom 11:00 to 18:00 for the occasion, we you [...]", abstract_fr: "Noël a 21 ans ! Quel âge a le Père Noël ? Personne…r place. Pour tout renseignement : 03.26.56.95.24", address_locality: "Val de Livre", end_time: 0, label_en: "Associative Christmas market - 21st edition", …}
// source: "localEvents"
// sourceLayer: "marches"
// state: {}
// type: "Feature"
// _geometry: {type: "Point", coordinates: Array(2)}
// _vectorTileFeature: co {properties: {…}, extent: 4096, type: 1, _pbf: vs, _geometry: 177993, …}
// geometry: (...)
// __proto__: Object