import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import SvgIcon from "@material-ui/core/SvgIcon";
import IconButton from '@material-ui/core/IconButton';

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


function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="10" cy="10" r="9" />
    </SvgIcon>
  );
}

function RenderUrl(props) {
  const { t, info } = props.props;

  var link = null;
  // layer museesFrance
  if (info.properties.sitweb) {
    // <a target="_blank" href={props.url} className="urlPopup" rel="noopener">{props.url}</a><br />
    if(!info.properties.sitweb.includes(" "))
      {link = info.properties.sitweb.includes("http://") ? info.properties.sitweb : "http://" + info.properties.sitweb;}
  }
  // other layers
  else{
    link = info.properties.url;
  }

  if (link) {
    return (
      <div className="urlPopup">
        <a target="_blank" href={link} className="urlPopup" rel="noopener">{t("myplaceinfo.urlDisplay")}</a><br />
      </div>);
  }
  return null;
}

function RenderAddress(props) {

  let street_address, postal_code, address_locality = null;
  if (props.info.street_address || props.info.postal_code) {
    street_address = props.info.street_address;
    postal_code = props.info.postal_code;
    address_locality = props.info.address_locality;
  }
  else if (props.info.adr || props.info.cp) {
    street_address = props.info.adr;
    postal_code = props.info.cp;
    address_locality = props.info.ville;
  }

  return (
    <div className="addressPopup">
      {street_address}<br />
      {postal_code}{" "}{address_locality}
    </div>
  );
}

function RenderDateTime(props) {
  const { t, info } = props.props;
  const lng = props.props.i18n.language;

  if (info.properties.valid_from) {
    let eventStart = new Date(info.properties.valid_from);
    let eventEnd = new Date(info.properties.valid_through);
    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };

    if (eventStart.getDate() === eventEnd.getDate())
      return (
        <div className="datePopup">
          {t("myplaceinfo.le")}: {eventStart.toLocaleDateString(lng, options)}
        </div>
      );
    else {
      return (
        <div className="datePopup">
          {t("myplaceinfo.from")}: {eventStart.toLocaleDateString(lng, options)}
          <br />
          {t("myplaceinfo.to")}: {eventEnd.toLocaleDateString(lng, options)}
        </div>
      );
    }
  }
  return null;
}

class MyPlaceInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      popupActive: this.props.info.popupActive,
      infoPopup: this.props.info,
    };
  }

  returnImage(layerId) {
    let img = null;
    switch (layerId) {
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
        // case "marches":
        // case "exposition":
        // case "musique":
        // case "children":
        // case "videsgreniers":
        //     img = <span className="dot" style={{ backgroundColor: item.layer.paint["circle-color"] }}></span>
        //     break;
  
        default:
            img = null;
            break;
    }
  
    return img;
  
  };

  hidePopup() {
    this.setState({ popupActive: false });

  }

  displayPopup() {
    this.setState({ popupActive: true });
  }

  componentWillReceiveProps(props) {
    this.setState({ infoPopup: props.infoPopup})
    this.setState({ popupActive: props.infoPopup.popupActive })
  }

  render() {

    const { t } = this.props;

    let popupActive = this.state.popupActive;
    
    const layerId = this.state.infoPopup.layerId;
    const paintColor = this.state.infoPopup.paintColor;
    let listVueActive = this.state.infoPopup.listVueActive;

    // move the popup on the left if the list is display
    
    let stylePop = listVueActive ? {right: "248px"} : {left: 0};
    
    if(listVueActive && (window.innerWidth < 576)){
      let topPos = document.documentElement.clientHeight * 0.36 + 21;
      stylePop  = {left: 0, top: topPos }
    }

    let info = this.state.infoPopup.properties;

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
      "WineCelar"].includes(layerId)) {
      const lang = this.props.i18n.language;
      switch (lang) {
        case "fr":
          info.abstract = info.abstract_fr;
          info.label = info.label_fr;
          break;
        case "en":
          info.abstract = info.abstract_en;
          info.label = info.label_en;
          break;
        default:
          info.abstract = info.abstract_en;
          info.label = info.label_en;
      }
    }

    const styles = {
      width: "12",
      verticalAlign: "middle",
      marginRight: "3pt",
      color: paintColor
    };

    if (["plusBeauxVillagesDeFrance",
      "patrimoinemondialenfrance",
      "jardinremarquable",
      "grandSiteDeFrance",
      "monumentsnationaux"].includes(layerId)) {

      return (
        <div>
          {popupActive &&
            <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
              <div className="titleText">
                {this.returnImage(layerId)}
                <a target="_new" href={info.link} className="titleText" rel="noopener">{info.label}</a><br />
              </div>
              <div className="btn-close" aria-label="Close">
                <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hidePopup()}>
                  <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                </IconButton>
              </div>
              <div className="hvrbox">
                <img src={info.thumbnail} className="picturePoppup hvrbox-layer_bottom" alt={info.label} title={info.label} />
                <div className="hvrbox-layer_top hvrbox-layer_slideup">
                  <div className="hvrbox-text">&copy;  &nbsp;
                <a target="_new" href={info.thumbnail} rel="noopener">Wikipedia contributors</a>&thinsp; &#8209; &thinsp;
                <a target="_new" href="https://creativecommons.org/licenses/by-sa/3.0/" rel="noopener">CC BY-SA</a>
                  </div>
                </div>
              </div>
              <div className="baseText">
                <div className="abstractPopup">
                  {info.abstract}<br />
                  <a target="_new" href={info.link} rel="noopener">&rarr; Wikipedia</a>
                </div>
              </div>
            </div>}
        </div>
      );
    }

    if ([
      "parcsjardins",
      "localproductshop",
      "craftmanshop",
      "WineCelar",
      "OTFrance"].includes(layerId)) {
      return (
        <div>
          {popupActive &&
            <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
              <div className="baseText">
                <div className="titleText">
                  {this.returnImage(layerId)}
                  {info.label}
                </div>
                <div className="btn-close" aria-label="Close">
                  <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hidePopup()}>
                    <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                  </IconButton>
                </div>
                <div className="introtext">
                  <div className="abstractPopup">
                    {info.abstract}
                  </div>
                  <RenderUrl props={this.props} />
                  <RenderAddress info={info} />
                </div>
              </div>
            </div>}
        </div>
      );
    }

    if (["exposition",
      "musique",
      "children",
      "marches",
      "videsgreniers"].includes(layerId)) {
      return (
        <div>
          {popupActive &&
            <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
              <div className="baseText">
                <div className="titleText">
                  <HomeIcon style={styles} alt={layerId} title={layerId} />
                  {info.label}
                </div>
                <div className="btn-close" aria-label="Close">
                  <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hidePopup()}>
                    <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                  </IconButton>
                </div>
                <div className="introtext">
                  <div className="abstractPopup">
                    {info.abstract}
                  </div>
                  <RenderDateTime props={this.props} />
                  <RenderUrl props={this.props} />
                  <RenderAddress info={info} />
                </div>
              </div>
              {/* </div> */}
            </div>}
        </div>
      );
    }

    if ("museesFrance".includes(layerId)) {

      return (
        <div>
          {popupActive &&
            <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
            <div className="baseText">
              <div className="titleText">
                <HomeIcon style={styles} alt={layerId} title={layerId} />
                {info.nom_du_musee}
              </div>
              <div className="btn-close" aria-label="Close">
                <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hidePopup()}>
                  <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                </IconButton>
              </div>
              <div className="introtext">
              <div className="abstractPopup">
                  {info.periode_ouverture}
                  <RenderUrl props={this.props} />
                  <RenderAddress info={info} />
                </div>
                </div>
              </div>
            </div>}
        </div>
      );
    }

    if ("FranceWiki".includes(layerId)) {
      var other_Tags = info.other_tags;
      var startWikidata = other_Tags.indexOf("wikidata");
      startWikidata = other_Tags.indexOf("=>", startWikidata + 1) + 3;
      let endWikidata = other_Tags.indexOf(",", startWikidata + 1) - 1;

      let wikidata = other_Tags.substring(startWikidata, endWikidata);

      var startWikipedia = other_Tags.indexOf("wikipedia");
      startWikipedia = other_Tags.indexOf("=>", startWikipedia + 1) + 3;

      let endWikipedia = 0;
      if (other_Tags.indexOf(",", startWikipedia + 1) > 0) {
        endWikipedia = other_Tags.indexOf(",", startWikipedia + 1) - 1;
      }
      else { endWikipedia = other_Tags.length - 1; }

      let wikipedia = other_Tags.substring(startWikipedia, endWikipedia);


      return (
        <div>
          {popupActive &&
            <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
              <div className="baseText">
                <div className="titleText">
                  {wikipedia}<br />
                </div>
                <div className="btn-close" aria-label="Close">
                  <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hidePopup()}>
                    <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                  </IconButton>
                </div>
                {/* <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close" onClick={() => this.hidePopup()}><span aria-hidden="true">&times;</span></button> */}
                <div className="introtext">
                  {wikidata}<br />
                  {wikipedia}
                </div>
              </div>
              {/* <a target="_new" href={link} rel="noopener">{t("myplaceinfo.website")}</a> */}
            </div>}
        </div>
      );
    }

    // Case: geocoder result
    if (info && this.props.info.geometry) {
      popupActive = this.props.isActive;
      return (
        <div>
          {popupActive &&
            <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
              <div className="baseText">
                <div className="baseInfo">
                  <div className="titleText">
                    {info.label}
                  </div>
                  <div className="btn-close" aria-label="Close">
                    <IconButton aria-label="Close" data-dismiss="alert" onClick={() => this.hidePopup()}>
                      <svg className="btn-icon"><use xlinkHref='#icon-close'></use></svg>
                    </IconButton>
                  </div>
                  <div className="introtext">
                    <div className="abstractPopup">
                      {info.context}
                    </div>
                    {t("postcode")} : {info.postcode}<br />
                  </div>
                </div>
              </div>
            </div>}
        </div>
      );
    }
    return null;
  }

  get styles() {
    return {
      directionsIcon: "bg-white hmin42 wmin42 hmin48-mm wmin48-mm hmax42 wmax42 hmax48-mm wmax48-mm m6 m12-mm round-full shadow-darken10 cursor-pointer flex-parent flex-parent--center-main flex-parent--center-cross",
      icon: "flex-parent flex-parent--center-cross flex-parent--center-main w42 h42",
      infoRow: "h24 h36-mm py6 pr12 flex-parent flex-parent--row flex-parent--center-cross",
      mainInfo: "p6 flex-child flex-child--grow flex-parent flex-parent--column flex-parent--center-main",
      placeInfo: "place-info absolute top bg-white w-full w420-mm shadow-darken25 flex-parent flex-parent--column",
    };
  }
}

MyPlaceInfo.propTypes = {
  infoPopup: PropTypes.object,
  languageSet: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    infoPopup: state.app.infoPopup,
  }
}


export default connect(mapStateToProps)(translate("translations")(MyPlaceInfo));
