import React from "react";
import "../assets/fonts/Caslon/ACaslonPro-Bold.otf";
import "../components/PopupInfo.css";

import Star15_961313 from "../assets/Star15_961313.svg"; // villages // plusBeauxVillagesDeFrance
import Star15_14222D from "../assets/Star15_14222D.svg"; // unesco // patrimoinemondialenfrance
import Star15_4AA52C from "../assets/Star15_4AA52C.svg"; // gardens // jardinremarquable
import Star15_19766E from "../assets/Star15_19766E.svg"; // grandsSites // grandSiteDeFrance
import Star15_1F08A6 from "../assets/Star15_1F08A6.svg"; // monuments // monumentsnationaux
import Star15_33BAAB from "../assets/Star15_33BAAB.svg"; // Museums // museesFrance

import Square15_4AA52C from "../assets/Square15_4AA52C.svg"; // parcsjardins
import Square15_E8EF1F from "../assets/Square15_E8EF1F.svg"; // localpropshop
import Square15_EE8568 from "../assets/Square15_EE8568.svg"; // craftmanShop
import Square15_318CE7 from "../assets/Square15_318CE7.svg"; // OTFrance
import Square15_6B0D0D from "../assets/Square15_6B0D0D.svg"; // WineCelar

const ExpositionColor = "#E12E0E";
const MusiqueColor = "#A52C56";
const ChildrenColor = "#15178A";
const MarchesColor = "#4AA52C";
const VideGreniers = "#007CBF";

const displayColors = {
  Exposition: "#E12E0E",
  Musique: "#A52C56",
  Children: "#15178A",
  Marches: "#4AA52C",
  VidesGreniers: "#007CBF",
};

const layersArray = ["PDO"];
const layersIdsArray = ["PDO"];

// Layer id patterns by category
const layerSelector = {
  PDO: /PDO/,
};

function returnLayerIDfromFeatureId(featureId) {
  // get layerindex and return corresponding layerColor
  if(typeof featureId === "undefined")
  {
    return 1;
  }
  return layersIdsArray[parseInt(featureId.substring(2, 4))];
}

function returnImage(layerId) {
  let img = null;
  switch (layerId) {
  case "plusBeauxVillagesDeFrance":
    img = <img src={Star15_961313} alt="" className="legend-key" />;
    break;
  case "patrimoinemondialenfrance":
    img = <img src={Star15_14222D} alt="" className="legend-key" />;
    break;
  case "jardinremarquable":
    img = <img src={Star15_4AA52C} alt="" className="legend-key" />;
    break;
  case "grandSiteDeFrance":
    img = <img src={Star15_19766E} alt="" className="legend-key" />;
    break;
  case "monumentsnationaux":
    img = <img src={Star15_1F08A6} alt="" className="legend-key" />;
    break;
  case "museesFrance":
    img = <img src={Star15_33BAAB} alt="" className="legend-key" />;
    break;
  case "villeEtPaysArtHistoire":
    img = <img src={Star15_961313} alt="" className="legend-key" />;
    break;
  case "parcsjardins":
    img = <img src={Square15_4AA52C} alt="" className="legend-key" />;
    break;
  case "localproductshop":
    img = <img src={Square15_E8EF1F} alt="" className="legend-key" />;
    break;
  case "craftmanshop":
    img = <img src={Square15_EE8568} alt="" className="legend-key" />;
    break;
  case "WineCelar":
    img = <img src={Square15_6B0D0D} alt="" className="legend-key" />;
    break;
  case "OTFrance":
    img = <img src={Square15_318CE7} alt="" className="legend-key" />;
    break;
  case "AiresJeux":
    img = <img src={Square15_318CE7} alt="" className="legend-key" />;
    break;
  case "marches":
    img = (
      <span className="dot" style={{ backgroundColor: MarchesColor }}></span>
    );
    break;
  case "exposition":
    img = (
      <span
        className="dot"
        style={{ backgroundColor: ExpositionColor }}
      ></span>
    );
    break;
  case "musique":
    img = (
      <span className="dot" style={{ backgroundColor: MusiqueColor }}></span>
    );
    break;
  case "children":
    img = (
      <span className="dot" style={{ backgroundColor: ChildrenColor }}></span>
    );
    break;
  case "videsgreniers":
    img = (
      <span className="dot" style={{ backgroundColor: VideGreniers }}></span>
    );
    break;

  default:
    img = null;
    break;
  }

  return img;
}

function RenderUrl(props) {
  const { t } = props.props;
  const info = props.infoPopup;

  var link = null;
  link = info.properties.url;

  if (link) {
    return (
      <div className="urlPopup">
        <a
          target="_blank"
          href={link}
          className="urlPopup"
          rel="noopener noreferrer"
        >
          {t("myplaceinfo.urlDisplay")}
        </a>
        <br />
      </div>
    );
  }
  return null;
}

function RenderAddress(props) {
  // const RenderAddress = ({props, classes}) => {
  var cssClasses = "addressPopup";
  if (typeof props.classes !== "undefined") {
    cssClasses = props.classes;
  }
  let street_address,
    postal_code,
    address_locality = null;
  // console.log(props);
  if (typeof props.infoPopup.properties !== "undefined") {
    var infoProperties = props.infoPopup.properties;
    if (infoProperties.street_address || infoProperties.postal_code) {
      street_address = infoProperties.street_address;
      postal_code = infoProperties.postal_code;
      address_locality = infoProperties.address_locality;
    }
  } else if (props.infoPopup.adr || props.infoPopup.cp) {
    street_address = props.infoPopup.adr;
    postal_code = props.infoPopup.cp;
    address_locality = props.infoPopup.ville;
  }

  return (
    <div className={cssClasses}>
      {street_address}
      <br />
      {postal_code} {address_locality}
    </div>
  );
}


function getColorLayer(property_id) {
  // get layerindex and return corresponding layerColor
  if(typeof property_id === "undefined")
  {
    return "gray";
  }
  var layerIndex = parseInt(property_id.substring(2, 4));
  return displayColors[layersArray[layerIndex]];
}

function RenderDateTime(props) {
  const infoPopup = props.infoPopup;
  const {t, i18n} = props.props;
  const lng = i18n.language;
  const info = infoPopup;

  if (info.properties.valid_from) {
    let eventStart = new Date(info.properties.valid_from);
    let eventEnd = new Date(info.properties.valid_through);

    let options = {
      weekday: "long",
      year: "numeric",  RenderDateTime(t, lng, properties) {
        if (properties.valid_from) {
          let eventStart = new Date(properties.valid_from);
          let eventEnd = new Date(properties.valid_through);
          let options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          };

          if (eventStart.getDate() === eventEnd.getDate())
            return (
              <div className="datePopup">
                {t("myplaceinfo.le")} {eventStart.toLocaleDateString(lng, options)}
              </div>
            );
          else {
            return (
              <div className="datePopup">
                {t("myplaceinfo.from")}{" "}
                {eventStart.toLocaleDateString(lng, options)}
                <br />
                {t("myplaceinfo.to")} {eventEnd.toLocaleDateString(lng, options)}
              </div>
            );
          }
        }
        return null;
      },
      month: "long",
      day: "numeric",
    };

    if (eventStart.getDate() === eventEnd.getDate())
      return (
        <div className="datePopup">
          {t("myplaceinfo.le")} {eventStart.toLocaleDateString(lng, options)}
          {info.properties.start_time !== 0 ? (
            <p>
              {t("myplaceinfo.startTime")} {info.properties.start_time},<br />{" "}
              {t("myplaceinfo.endTime")} {info.properties.end_time}
            </p>
          ) : null}
        </div>
      );
    else {
      return (
        <div className="datePopup">
          {t("myplaceinfo.from")} {eventStart.toLocaleDateString(lng, options)}
          <br />
          {t("myplaceinfo.to")} {eventEnd.toLocaleDateString(lng, options)}
          {info.properties.start_time !== 0 ? (
            <p>
              {t("myplaceinfo.startTime")} {info.properties.start_time} <br />{" "}
              {t("myplaceinfo.endTime")} {info.properties.end_time}
            </p>
          ) : null}
        </div>
      );
    }
  }
  return null;
}

function RenderLastUpdate(props) {
  const infoPopup = props.infoPopup;
  const {t, i18n} = props.props;
  const lng = i18n.language;
  const info = infoPopup;

  if (info.properties.last_update) {
    let lastUpdate = new Date(info.properties.last_update);

    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return (
      <div className="lastUpdatePopup">
        {t("myplaceinfo.lastUpdate")}{" "}
        {lastUpdate.toLocaleDateString(lng, options)}
      </div>
    );
  }
  return null;
}

function RenderThumbnail(props) {
  var info = props.props;
  return (
    <div className="hvrbox">
      <img
        src={info.wiki_thumbnail}
        className="picturePoppup hvrbox-layer_bottom"
        alt={info.wiki_label_fr}
        title={info.wiki_label_fr}
      />
      <div className="hvrbox-layer_top hvrbox-layer_slideup">
        <div className="hvrbox-text">
      &copy; &nbsp;
          <a target="_new" href={info.wikipedia_fr} rel="noopener">
        Wikipedia contributors
          </a>
      &thinsp; &#8209; &thinsp;
          <a
            target="_new"
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            rel="noopener"
          >
        CC BY-SA
          </a>
        </div>
      </div>
    </div>);
}


export { getColorLayer, returnImage, returnLayerIDfromFeatureId, RenderUrl, RenderAddress, RenderDateTime, RenderLastUpdate, RenderThumbnail, layerSelector, displayColors, layersArray };
