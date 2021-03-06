import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import SvgIcon from "@material-ui/core/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import DirectionsIcon from "@material-ui/icons/Directions";
import Tooltip from "@material-ui/core/Tooltip";

import { returnImage } from "../utils/displayUtils";
import { shareableUrl } from "../middlewares/urlTinkerer";
import AddToMyPlaces from "./AddToMyPlaces";
import copyToClipboardIcon from "../assets/copyToClipboard.svg";
import { layerSelector } from "../utils/displayUtils";
// import NavigationIcon from '@material-ui/icons/Navigation';

import {
  RenderUrl,
  RenderAddress,
  RenderDateTime,
  RenderLastUpdate,
  RenderThumbnail,
} from "../utils/displayUtils";

import {
  // EmailIcon,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";

import {
  // EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";

import "./fonts/Caslon/ACaslonPro-Bold.otf";
import "./PopupInfo.css";

import { setStateValue, resetStateKeys } from "../actions/index";

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="10" cy="10" r="9" />
    </SvgIcon>
  );
}

class MyPlaceInfo extends Component {
  hidePopup() {
    this.props.setStateValue("popupActive", false);
  }

  render() {
    const { t, popupActive } = this.props;

    const layerId = this.props.infoPopup.layerId;
    const paintColor = this.props.infoPopup.paintColor;

    // // move the popup on the left if the list is display
    let stylePop = { left: 0, zIndex: 0 };

    // use zIndex: -1 to hide the infowindow behind the map instead of norender
    // otherwize the infowindow invisible but is still there and catch all mouse actions
    if (!popupActive) {
      stylePop = { zIndex: -1 };
      return null;
    }

    let info = this.props.infoPopup.properties;

    if (Object.keys(layerSelector).includes(layerId)) {
      const lang = this.props.i18n.language;
      switch (lang) {
      case "fr":
        info.abstract = info.productDescription
          ? info.productDescription
          : info.productDescription;
        info.label = info.productName ? info.productName : info.productName;
        break;
      case "en":
        info.abstract = info.productDescription
          ? info.productDescription
          : info.productDescription;
        info.label = info.productName ? info.productName : info.productName;
        break;
      default:
        info.abstract = info.productDescription
          ? info.productDescription
          : info.productDescription;
        info.label = info.productName ? info.productName : info.productName;
      }
    }

    const styles = {
      width: "12",
      verticalAlign: "middle",
      marginRight: "3pt",
      color: paintColor,
    };

    if (Object.keys(layerSelector).includes(layerId)) {
      const lang = this.props.i18n.language;
      switch (lang) {
      case "fr":
        info.link = info.wiki_productName
          ? info.wiki_productName
          : info.wiki_productName;
        break;
      case "en":
        info.link = info.wiki_productName
          ? info.wiki_productName
          : info.wikipedia_en;
        break;
      default:
        info.link = info.wiki_productName
          ? info.wiki_productName
          : info.wikipedia_en;
      }

      return (
        <div>
          <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
            <div className="titleText">
              {returnImage(layerId)}
              <a
                target="_new"
                href={info.link}
                className="titleText"
                rel="noopener"
              >
                {info.label}
              </a>
              <br />
            </div>
            <div className="btn-close" aria-label="Close">
              <IconButton
                aria-label="Close"
                data-dismiss="alert"
                onClick={() => this.hidePopup()}
              >
                <svg className="btn-icon">
                  <use xlinkHref="#icon-close"></use>
                </svg>
              </IconButton>
            </div>
            {/* thumbnail */}

            <RenderThumbnail props={info} />

            {/* abstract + link wikipedia */}
            <div className="baseText">
              <div className="abstractPopup">
                <span dangerouslySetInnerHTML={{ __html: info.abstract }} />

                <br />
                {typeof info.wikipedia_fr !== "undefined" ? (
                  <a target="_new" href={info.wikipedia_fr} rel="noopener">
                  &rarr; Wikipedia
                </a>
                ) : null}


                {/* <RenderUrl
                  infoPopup={this.props.infoPopup}
                  props={this.props}
                /> */}

                {/* {typeof info.opening_hours !== "undefined" &&
                info.opening_hours !== "" ? (
                    <p>
                      {t("myplaceinfo.openingHours")}
                      {": "}
                      {info.opening_hours}
                    </p>
                  ) : null} */}
              </div>
            </div>
            <AddToMyPlaces info={this.props.infoPopup} />
          </div>
        </div>
      );
    }

    if (["searchResult"].concat(Object.keys(layerSelector)).includes(layerId)) {
      var geolink =
        "geo:" +
        [
          this.props.infoPopup.geometry.coordinates[1],
          this.props.infoPopup.geometry.coordinates[0],
        ];
      return (
        <div>
          <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
            <div className="baseText">
              <div className="titleText">
                <HomeIcon style={styles} alt={layerId} title={layerId} />
                <span dangerouslySetInnerHTML={{ __html: info.label }} />
              </div>
              <div className="btn-close" aria-label="Close">
                <IconButton
                  aria-label="Close"
                  data-dismiss="alert"
                  onClick={() => this.hidePopup()}
                >
                  <svg className="btn-icon">
                    <use xlinkHref="#icon-close"></use>
                  </svg>
                </IconButton>
              </div>
              <div className="introtext">
                <div className="abstractPopup">
                  <div dangerouslySetInnerHTML={{ __html: info.abstract }} />
                </div>
                <RenderDateTime
                  infoPopup={this.props.infoPopup}
                  props={this.props}
                />
                <RenderUrl
                  infoPopup={this.props.infoPopup}
                  props={this.props}
                />
                <RenderAddress infoPopup={this.props.infoPopup} />
                {info.price !== 0 ? (
                  <p>
                    {t("myplaceinfo.price")}
                    {": "}
                    {info.price} €
                  </p>
                ) : null}
              </div>
            </div>
            <div className="socialMedia">
              <AddToMyPlaces info={this.props.infoPopup} />

              <div className="socialMediaItem">
                <Tooltip
                  title="Copy info to Clipboard"
                  aria-label="Copy info to Clipboard"
                >
                  <div
                    onClick={() =>
                      navigator.clipboard.writeText(
                        shareableUrl(window.location.href),
                      )
                    } // This won't work everywhere
                    className={styles.buttonIcon}
                  >
                    <img
                      style={{
                        cursor: "pointer",
                        width: "24px",
                        height: "24px",
                        marginTop: "6px",
                      }}
                      src={copyToClipboardIcon}
                      alt="copy to clipboard"
                    />
                  </div>
                </Tooltip>
              </div>

              <Tooltip
                title="Send coordinates to navigation system"
                aria-label="Send coordinates to navigation system"
              >
                <div className="socialMediaItem">
                  <a target="_new" href={geolink} rel="noopener">
                    <DirectionsIcon
                      style={{
                        cursor: "pointer",
                        width: "24px",
                        height: "24px",
                        marginTop: "6px",
                      }}
                    />
                  </a>
                </div>
              </Tooltip>

              <Tooltip
                title="Share with facebook"
                aria-label="Share with facebook"
              >
                <div className="socialMediaItem">
                  <FacebookShareButton
                    url={process.env.REACT_APP_HOME + window.location.pathname}
                    quote={info.label}
                    className="socialMedia__share-button"
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                </div>
              </Tooltip>

              <Tooltip
                title="Share with Whatsapp"
                aria-label="Share with Whatsapp"
              >
                <div className="socialMediaItem">
                  <WhatsappShareButton
                    url={process.env.REACT_APP_HOME + window.location.pathname}
                    title={info.label}
                    separator=":: "
                    className="socialMedia__share-button"
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
              </Tooltip>
            </div>

            <RenderLastUpdate
              infoPopup={this.props.infoPopup}
              props={this.props}
            />
          </div>
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
      } else {
        endWikipedia = other_Tags.length - 1;
      }

      let wikipedia = other_Tags.substring(startWikipedia, endWikipedia);

      return (
        <div>
          {popupActive && (
            <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
              <div className="baseText">
                <div className="titleText">
                  {wikipedia}
                  <br />
                </div>
                <div className="btn-close" aria-label="Close">
                  <IconButton
                    aria-label="Close"
                    data-dismiss="alert"
                    onClick={() => this.hidePopup()}
                  >
                    <svg className="btn-icon">
                      <use xlinkHref="#icon-close"></use>
                    </svg>
                  </IconButton>
                </div>
                {/* <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close" onClick={() => this.hidePopup()}><span aria-hidden="true">&times;</span></button> */}
                <div className="introtext">
                  {wikidata}
                  <br />
                  {wikipedia}
                </div>
              </div>
              {/* <a target="_new" href={link} rel="noopener">{t("myplaceinfo.website")}</a> */}
            </div>
          )}
        </div>
      );
    }

    // Case: geocoder result
    if (info && this.props.info.geometry) {
      return (
        <div>
          <div className="mapboxgl-popupup popPupStyle" style={stylePop}>
            <div className="baseText">
              {/* <div className="baseInfo"> */}
              <div className="titleText">{info.label}</div>
              <div className="btn-close" aria-label="Close">
                <IconButton
                  aria-label="Close"
                  data-dismiss="alert"
                  onClick={() => this.hidePopup()}
                >
                  <svg className="btn-icon">
                    <use xlinkHref="#icon-close"></use>
                  </svg>
                </IconButton>
              </div>
              <div className="introtext">
                <div className="abstractPopup">{info.context}</div>
                {t("postcode")} : {info.postcode}
                <br />
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  get styles() {
    return {
      icon:
        "flex-parent flex-parent--center-cross flex-parent--center-main w42 h42",
    };
  }
}

MyPlaceInfo.propTypes = {
  infoPopup: PropTypes.object,
  languageSet: PropTypes.string,
  popupActive: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    infoPopup: state.app.infoPopup,
    popupActive: state.app.popupActive,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setStateValue: (key, value) => dispatch(setStateValue(key, value)),
    resetStateKeys: (keys) => dispatch(resetStateKeys(keys)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate("translations")(MyPlaceInfo));
