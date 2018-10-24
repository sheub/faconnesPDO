import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { triggerMapUpdate, setStateValue } from "../actions/index";



import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import IconButton from '@material-ui/core/IconButton';
// import IconLaunch from '@material-ui/core/IconLaunch';

import Star15_961313 from '../assets/Star15_961313.svg'; // villages // plusBeauxVillagesDeFrance
import Star15_14222D from '../assets/Star15_14222D.svg'; // unesco // patrimoinemondialenfrance
import Star15_4AA52C from '../assets/Star15_4AA52C.svg'; // gardens // jardinremarquable
import Star15_19766E from '../assets/Star15_19766E.svg'; // grandsSites // grandSiteDeFrance
import Star15_1F08A6 from '../assets/Star15_1F08A6.svg'; // monuments // monumentsnationaux
import Star15_33BAAB from '../assets/Star15_33BAAB.svg'; // Museums // museesFrance

import Square15_4AA52C from '../assets/Square15_4AA52C.svg'; // parcsjardins 
import Square15_E8EF1F from '../assets/Square15_E8EF1F.svg'; // localpropshop
import Square15_EE8568 from '../assets/Square15_EE8568.svg'; // craftmanShop
import Square15_318CE7 from '../assets/Square15_318CE7.svg'; // OTFrance
import Square15_6B0D0D from '../assets/Square15_6B0D0D.svg'; // WineCelar


import "./css/PopupInfo.css";

const styles = theme => ({

    listContainer: {
        display: "flex",
        flexDirection: "column",
        height: "33vh",
    },
    
    listRoot: {
        width: '100%',
        backgroundColor: "white",
        marginTop: "7px",
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
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
        right: "-4px",
        cursor: "pointer",
    },

    blockWithText: {
        overflow: "hidden",
        padding: 0,
        // userSelect: "all",
        letterSpacing: "-0.3px",
    },

    listItemIconClass: { 
        marginRight: "3px",
        marginLeft: "-16px",
        verticalAlign: "top" 
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
        infoItem.place_name = this.props.listVueItems[index].properties.label_en;
        infoItem.popupActive = true;

        // this.setState({ infoPopup: infoItem });
        // this.props.setInfoPopup(infoItem);
        // this.props.setStateValue("popupActive", false);
        this.props.setStateValue("infoPopup", infoItem);



        // return <MyPlaceInfo info={infoItem} isActive={true} />
    }

    returnImage(item) {
        let img = null;
        switch (item.layer.id) {
            case "plusBeauxVillagesDeFrance":
                img = <img src={Star15_961313} alt="" className='legend-key' />
                break;
            case "patrimoinemondialenfrance":
                img = <img src={Star15_14222D} alt="" className='legend-key' />
                break;
            case "jardinremarquable":
                img = <img src={Star15_4AA52C} alt="" className='legend-key' />
                break;
            case "grandSiteDeFrance":
                img = <img src={Star15_19766E} alt="" className='legend-key' />
                break;
            case "monumentsnationaux":
                img = <img src={Star15_1F08A6} alt="" className='legend-key' />
                break;
            case "museesFrance":
                img = <img src={Star15_33BAAB} alt="" className='legend-key' />
                break;
            case "parcsjardins":
                img = <img src={Square15_4AA52C} alt="" className='legend-key' />
                break;
            case "localproductshop":
                img = <img src={Square15_E8EF1F} alt="" className='legend-key' />
                break;
            case "craftmanshop":
                img = <img src={Square15_EE8568} alt="" className='legend-key' />
                break;
            case "WineCelar":
                img = <img src={Square15_6B0D0D} alt="" className='legend-key' />
                break;
            case "OTFrance":
                img = <img src={Square15_318CE7} alt="" className='legend-key' />
                break;
            case "marches":
            case "exposition":
            case "musique":
            case "children":
            case "videsgreniers":
                img = <span className="dot" style={{ backgroundColor: item.layer.paint["circle-color"] }}></span>
                break;

            default:
                img = null;
                break;
        }

        return img;

    };

    hideListVue() {
        this.props.setStateValue("listVueActive", false);
        // this.props.triggerMapUpdate();
    }

    ListVueMainItem(item, index) {

        // const { t } = this.props;
        const lang = this.props.i18n.language;
        const { classes } = this.props;

        let info = {};
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
            "WineCelar"].includes(item.layer.id)) {

            switch (lang) {
                case "fr":
                    info.label = item.properties.label_fr;
                    info.address = item.properties.street_address;

                    break;
                case "en":
                    info.label = item.properties.label_en;
                    info.address = item.properties.street_address;
                    break;
                default:
                    info.label = item.properties.label_en;
                    info.address = item.properties.street_address;
            }
        }
        else{
            info.label = item.properties.label;
            info.address = <a target="_new" href={item.properties.link} rel="noopener">&rarr; Wikipedia</a>
        }

        return (

            <ListItem button onClick={this.handleClick.bind(this, index)} style={{ paddingRight: "16px", cursor:"default" }} aria-label={info.label} >
                <ListItemIcon className={classes.listItemIconClass}>
                    {this.returnImage(item)}
                </ListItemIcon>
                <ListItemText className={classes.blockWithText} primary={info.label} secondary={info.address} />
            </ListItem>
        )
    };


    render() {
        const items = this.props.listVueItems;
        const { classes } = this.props;
        let listVueActive = this.props.listVueActive;

        if ((typeof (items) !== "undefined") && items.length) {
            return (
                <div className={classes.listContainer}>
                    {listVueActive &&
                        <List dense={true} className={classes.listRoot} component="div" disablePadding
                            subheader={<ListSubheader component="div">{items.length} Attractions</ListSubheader>}
                        >
                            <div className="btn-close" aria-label="Close">
                                <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hideListVue()}>
                                    <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                                </IconButton>
                            </div>
                            <div className={classes.listItemClass} id='listItem'>
                                {
                                    items.map((member, index) => {
                                        return this.ListVueMainItem(member, index);
                                    })
                                }
                            </div>
                        </List>
                    }
                </div>
            )
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
    listVueActive: PropTypes.bool,
    setStateValue: PropTypes.func,
    listVueItems: PropTypes.array,
    infoPopup: PropTypes.object,
    triggerMapUpdate: PropTypes.func,
    setInfoPopup: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        listVueActive: state.app.listVueActive,
        infoPopup: state.app.infoPopup,
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