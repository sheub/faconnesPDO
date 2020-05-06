
import axios from "axios";
import {layerSelector, layersArray, displayColors} from "../utils/displayUtils";

const CALL_HISTORY_METHOD = "@@router/CALL_HISTORY_METHOD";

const urlTinkerer = store => next => action => {
  // eslint-disable-line

  switch (action.type) {
  case "SET_STATE_VALUE": {
    next(action);

    if(action.key === "infoPopup"){
      let actionPayload = getActionPayload(action.key, action.value);
      const url = updateUrlWithPayload(
        store.getState().router.location.pathname,
        actionPayload
      );
      if (store.getState().router.location.pathname !== url) {
        next({
          type: CALL_HISTORY_METHOD,
          payload: {
            method: "replace",
            args: [url]
          }
        });
      }}
    break;
  }

  case "SET_STATE_VALUES": {
    next(action);
    let url = store.getState().router.location.pathname;
    Object.keys(action.modifiedState).forEach(k => {
      let actionPayload = getActionPayload(k, action.modifiedState[k]);
      url = updateUrlWithPayload(url, actionPayload);
    });
    if (store.getState().router.location.pathname !== url) {
      next({
        type: CALL_HISTORY_METHOD,
        payload: {
          method: "replace",
          args: [url]
        }
      });
    }

    break;
  }

  case "RESET_STATE_KEYS": {
    next(action);

    if (action.keys.indexOf("searchLocation") > -1) {
      let url = updateUrlWithPayload(
        store.getState().router.location.pathname,
        {
          searchCoords: null,
          searchPlace: null,
          featureId: null
        }
      );

      if (store.getState().router.location.pathname !== url) {
        next({
          type: CALL_HISTORY_METHOD,
          payload: {
            method: "replace",
            args: [url]
          }
        });
      }
    }
    break;
  }

  case "SET_STATE_FROM_URL": {
    let url = store.getState().router.location.pathname;
    const params = parseUrl(url);
    if (params.searchCoords) {
      if(typeof params.featureId !== "undefined") {
        requestFeatureFromId(params.featureId).then(
          resultFeature => nextActionsSetStateFromURL(resultFeature, next)

        );
      }
      else {
        const feature = {
          type: "Feature",
          place_name: params.searchPlace,
          geometry: {
            type: "Point",
            coordinates: params.searchCoords
          },
        };
        nextActionsSetStateFromURL(feature, next);
      }
    }
    break;
  }

  default:
    next(action); // let through as default
    break;
  }
};

async function requestFeatureFromId(featureId) {
  var url = "http://localhost:8000/api/getFeatureByPropertyID/010300674";// + params.featureId
  if (process.env.NODE_ENV === "production") {
    url = "/current/public/api/getFeatureByPropertyID/" + featureId.toString().padStart(9, "0");
  } else {
    url = process.env.REACT_APP_API_ENTRYPOINT + "/api/getFeatureByPropertyID/"+ featureId.toString().padStart(9, "0");
  }

  try {
    let axiosResult = await axios({
      url: url,
      method: "get",
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
      }
    });
    if(axiosResult.status === 200) {
      // handle success
      // console.log(axiosResult);

      var featureResult = axiosResult.data;
      var layerIndex = parseInt(featureResult.feature_id.substring(2, 4));
      var layerKey = layersArray[layerIndex];
      var sourceLayer = layerSelector[layerKey].source;
      featureResult.paintColor = displayColors[layersArray[layerIndex]];
      featureResult.layerId = sourceLayer;
    }
    return featureResult;
  }
  catch(error) {
    // handle error
    console.log(error);
  };
}

function nextActionsSetStateFromURL(feature, next) {

  if(typeof feature === "undefined"){
    return;
  }
  next({
    type: "SET_STATE_VALUES",
    modifiedState: {
      searchLocation: feature,
      infoPopup: feature,
      needMapRepan: true,
      mapCoords: feature.geometry.coordinates.concat([13]),
      popupActive: true,
      // featureId: params.featureId
    },
  });
  next({
    type: "GET_PLACE_INFO",
    feature
  });
  next({
    type: "TRIGGER_MAP_UPDATE",
    needMapRepan: true,
  });
}


function getActionPayload(key, value) {
  let actionPayload = {};
  if (key === "mapCoords") {
    actionPayload = {
      coords: value
    };
  // } else if (key === "searchLocation") {
  } else if (key === "infoPopup") {
    actionPayload = {
      searchCoords: value.geometry.coordinates,
      // FIX me: the value.place_name is set only if the user has clicked on the list,
      // not if he used the arrow + enter....
      searchPlace: value.place_name.split(",")[0],
      // searchPlace: value.properties.label.split(",")[0],
      // wikidata: value.properties.wikidata,
      featureId: value.featureId
    };
  }
  return actionPayload;
}

function updateUrlWithPayload(url, actionPayload) {
  var props = parseUrl(url);
  return toUrl(Object.assign({}, props, actionPayload));
}

export default urlTinkerer;

function parseUrl(url) {
  var props = {};
  var splits = url.split("/");
  splits.forEach(s => {
    if (s.startsWith("@")) {
      // Parse coords, noted with an @.
      props.searchCoords = s
        .slice(1)
        .split(",")
        .map(Number);
    }
    // the sign + breaks the htaccess
    //  else if (s.startsWith("+")) {
    //   // Parse search coords, noted with a +.
    //   props.searchCoords = s
    //     .slice(1)
    //     .split(",")
    //     .map(Number);
    // }
    else if (s.startsWith("~")) {
      // Parse search place name, noted with a ~.
      props.searchPlace = decodeURI(s.slice(1));
    // } else if (s.startsWith("$")) {
    //   // Parse wikidata entity, noted with a $.
    //   props.wikidata = decodeURI(s.slice(1));
    } else if (s.startsWith("$")) {
      // Parse featureId, noted with a $.
      props.featureId = decodeURI(s.slice(1));
    }
  });

  return props;
}

function toUrl(props) {
  var res = [""];
  if (props.coords) {
    res.push(
      "@" +
        [
          props.coords[0].toFixed(6),
          props.coords[1].toFixed(6),
          // props.coords[2].toFixed(2)
        ].join(",")
    );
  }
  if (props.searchCoords) {
    res.push("@" + props.searchCoords.map(e => e.toFixed(6)).join(","));
  }

  if (props.searchPlace) {
    res.push("~" + encodeURI(props.searchPlace));
  }
  // if (props.wikidata) {
  //   res.push("$" + encodeURI(props.wikidata));
  // }
  if (props.featureId) {
    res.push("$" + encodeURI(props.featureId));
  }
  return res.join("/");
}

export function shareableUrl(url) {
  const { coords, ...props } = parseUrl(url);
  return window.location.protocol + "//" + window.location.host + toUrl(props);
}
