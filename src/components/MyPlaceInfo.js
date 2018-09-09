import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Truncate from "react-truncate";
import SvgIcon from "@material-ui/core/SvgIcon";
import "./css/PopupInfo.css";


function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="10" cy="10" r="9" />
    </SvgIcon>
  );
}

// function ShowOpeningHours(props) {
//   if (!props.info.startTime) {
//     return null;
//   }
//   return (
//     <div>
//       Horaires: <br />
//       StartTime {props.info.startTime}<br />
//       EndTime: {props.info.endTime}<br />
//     </div>
//   );
// }

function RenderUrl(props) {
  if (props.url) {
    return (
      <div className="urlPopup">
        <a target="_new" href={props.url} className="urlPopup" rel="noopener">{props.url}</a><br />
      </div>);
  }
  return null;
}

function RenderAddress(props) {
  if (props.info.street_address || props.info.postal_code) {
    return (
      <div className="addressPopup">
        {props.info.street_address}<br />
        {props.info.postal_code}{" "}{props.info.address_locality}
      </div>
    );
  }
  return null;
}

function RenderDateTime(props) {
  if (props.info.valid_from) {
    let eventStart = new Date(props.info.valid_from);
    let eventEnd = new Date(props.info.valid_through);
    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };

    if (eventStart.getDate() === eventEnd.getDate())
      return (
        <div className="datePopup">
          Le: {eventStart.toLocaleDateString("fr-FR", options)}
        </div>
      );
    else {
      return (
        <div className="datePopup">
          Du: {eventStart.toLocaleDateString("fr-FR", options)}
          <br />
          au: {eventEnd.toLocaleDateString("fr-FR", options)}
        </div>
      );
    }
  }
  return null;
}

class MyPlaceInfo extends Component {

  
  hidePopup() {
    this.props.info.popupActive = false;
    // this.props.isActive = false;

    this.forceUpdate();
  }


 
  render() {

    let popupActive = this.props.info.popupActive;
    let info = this.props.info.properties;

    const layerId = this.props.info.layerId;
    const paintColor = this.props.info.paintColor;
    
    const styles = {
      width: "12",
      verticalAlign: "middle",
      marginRight: "3pt",
      color: paintColor
      };
    if (window.innerHeight < 500) return null;

    if (["villages-frenchcorrected-3gqhy6",
      "whs-frenchcorrected-dq63pv",
      "n-inao-aop-fr-16md1w",
      "jardinfr-8nabpa",
      "gsf-frenchcorrected",
      "edifice-geres-par-les-monumen-3inr6v"].includes(layerId)) {

      return (
        <div>
          {popupActive &&
            <div className="mapboxgl-popupup popPupStyle">
              <div className="titleText">

                <a target="_new" href={info.link} className="titleText" rel="noopener">{info.label}</a><br />

              </div>
              <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close" onClick={() => this.hidePopup()}><span aria-hidden="true">&times;</span></button>
              <div className="hvrbox">
                <img src={info.thumbnail} className="picturePoppup hvrbox-layer_bottom" alt={info.label} title={info.label} />
                <div className="hvrbox-layer_top hvrbox-layer_slideup">
                  <div className="hvrbox-text">&copy;  &nbsp;
                <a target="_new" href={info.thumbnail} rel="noopener">Wikipedia contributors</a>&thinsp; &#8209; &thinsp;
                <a target="_new" href="https://creativecommons.org/licenses/by-sa/3.0/" rel="noopener">CC BY</a>
                  </div>
                </div>
              </div>
              <div className="baseInfo">
                <div className="baseText">
                  <Truncate lines={9} ellipsis={<span>... <a href={info.link} rel="noopener">Suite</a></span>}>
                    {info.abstract}
                  </Truncate>
                </div>
              </div>
            </div>}
        </div>
      );
    }
    if ([
      "parcsjardins",
      "restaurants",
      "localproductshop",
      "craftmanshop"].includes(layerId)) {
      return (
               <div>
          {popupActive &&
        <div className="mapboxgl-popupup  popPupStyle">
        <div className="baseText">
          <div className="baseInfo">
            <div className="titleText">
              <HomeIcon style={styles} alt={layerId} title={layerId} />
              {info.label}
            </div>
            <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close" onClick={() => this.hidePopup()}><span aria-hidden="true">&times;</span></button>
            <div className="introtext">
              <div className="abstractPopup">
                {info.abstract}
              </div>
              <RenderUrl url={info.url} />
              <RenderAddress info={info} />
            </div>
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
      return (               <div>
          {popupActive &&
        <div className="mapboxgl-popupup popPupStyle">
        <div className="baseInfo">
          <div className="baseText">
            <div className="titleText">
              <HomeIcon style={styles} alt={layerId} title={layerId} />
              {info.label}
            </div>
           <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close" onClick={() => this.hidePopup()}><span aria-hidden="true">&times;</span></button>
            <div className="introtext">
              <div className="abstractPopup">
                {info.abstract}
              </div>
              <RenderDateTime info={info} />
              <RenderUrl url={info.url} />
              <RenderAddress info={info} />
            </div>
          </div>
          </div>
        </div>}
        </div>
      );

    }
    if("liste-et-localisation-des-mus-5iczl9".includes(layerId)){
      var link = null;
      if (info.sitweb) {
        link = info.sitweb.includes("http://") ? info.sitweb : "http://" + info.sitweb;
      }
      return (
                       <div>
       {popupActive &&
        <div className="mapboxgl-popupup popPupStyle">
          <div className="baseInfo">
            <div className="baseText">
              <div className="titleText">
                {info.label}<br />
              </div>
              <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.hidePopup()}><span aria-hidden="true">&times;</span></button>
              <div className="introtext">
                {info.adr}<br />
                {info.cp}{" "}{info.ville}<br />
                {"Ouverture:"}<br />
                {info.periode_ouverture}
              </div>
            </div>
            <a target="_new" href={link} rel="noopener">Site internet</a>
          </div>
        </div>}
        </div>
      );
    }

    // Case: geocoder result
    if(info && this.props.info.geometry)
    {
      popupActive = this.props.isActive;
      return (
        <div>
          {popupActive &&
            <div className="mapboxgl-popupup  popPupStyle">
              <div className="baseText">
                <div className="baseInfo">
                  <div className="titleText">
                    {info.label}
                  </div>
                  <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close" onClick={() => this.hidePopup()}><span aria-hidden="true">&times;</span></button>
                  <div className="introtext">
                    <div className="abstractPopup">
                      {info.context}
                    </div>
                    postcode : {info.postcode}<br/>
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
      directionsIcon: 'bg-white hmin42 wmin42 hmin48-mm wmin48-mm hmax42 wmax42 hmax48-mm wmax48-mm m6 m12-mm round-full shadow-darken10 cursor-pointer flex-parent flex-parent--center-main flex-parent--center-cross',
      icon: 'flex-parent flex-parent--center-cross flex-parent--center-main w42 h42',
      infoRow: 'h24 h36-mm py6 pr12 flex-parent flex-parent--row flex-parent--center-cross',
      mainInfo: 'p6 flex-child flex-child--grow flex-parent flex-parent--column flex-parent--center-main',
      placeInfo: 'place-info absolute top bg-white w-full w420-mm shadow-darken25 flex-parent flex-parent--column',
    };
  }

}

MyPlaceInfo.propTypes = {
  clickDirections: PropTypes.func,
  info: PropTypes.object,
};


export default MyPlaceInfo;
