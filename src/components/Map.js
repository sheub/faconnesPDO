import PropTypes from "prop-types";
import React, {Component} from "react";
import { translate } from "react-i18next";

import {connect} from "react-redux";
import {push} from "connected-react-router";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
// import turfBbox from "@turf/bbox";

import {setLanguage} from "../utils/openmaptiles-language";
import { defaultAppState } from "../reducers/appReducer";

import {
  setStateValue,
  setUserLocation,
  triggerMapUpdate,
  // getRoute,
  resetStateKeys
} from "../actions/index";


import style from "../styles/osm-liberty-latest.json";
// Set the sprite URL in the style. It has to be a full, absolute URL.
let spriteUrl;
if (process.env.NODE_ENV === "production") {
  // spriteUrl = process.env.PUBLIC_URL + "/sprite";
  spriteUrl = process.env.REACT_APP_HOME + "sprite";
} else { // Dev server runs on port 3000
  spriteUrl = "http://localhost:3000/sprite";
  // spriteUrl = "https://faconnes.de" + "/sprite";
}
style.sprite = spriteUrl;

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      isCursorOverPoint: false,
      draggedLayer: "",
      draggedCoords: null,
    };
  }

  render() {
    return (
      // <div id='map' className='viewport-full'>
      <div>
        <div id="map"></div>
      </div>
    );
  }

  componentDidMount() {
    // mapboxgl.accessToken = this.props.accessToken;

    const map = new mapboxgl.Map({
      container: "map",
      style: style,
      center: this.props.center,
      zoom: this.props.zoom,
      // center: [2, 45.5],
      // zoom: 4,
      minZoom: 2,
      maxZoom: 21,
      pitchWithRotate: false,
      dragRotate: false,
      localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
      maxBounds: [-15.06, 34.07, 24.32, 55.11],
    });

    map.touchZoomRotate.disableRotation();

    this.map = map;

    map.on("load", () => {
      this.onLoad();
    });
  }

  async componentDidUpdate() {
    if (!this.props.needMapUpdate) return;

    await loadedPromise(this.map);
    // Search mode
    if (
      this.props.mode === "search" ||
      this.props.mode === "localAutocomplete"
    ) {
      if (this.props.searchLocation) {
        if (this.props.searchLocation.geometry) {
          let markerSource = this.map.getSource("marker");
          if (typeof markerSource === "undefined") {
            return;
          }
          this.map
            .getSource("marker")
            .setData(this.props.searchLocation.geometry);
        }
      } else {
        this.map.getSource("marker").setData(this.emptyData);
      }
    }
    if (this.props.mode === "localAutocomplete") {
      if (this.props.listVueItems.length > 1) {
        // if (this.props.searchLocation.geometry) {
          // let searchResultSource = this.map.getSource("searchResult");
          // if (typeof searchResultSource === "undefined") {
          //   return;
          // }
          // console.log(this.props.listVueItems);
          var jsonFeatureCollection = {};
          jsonFeatureCollection.FeatureCollection = this.props.listVueItems;
          // jsonFeatureCollection.value = this.props.listVueItems;
          jsonFeatureCollection = {
            "type": "FeatureCollection",
            "features": this.props.listVueItems
          };
          // console.log(jsonFeatureCollection);
          // console.log(jsonArray);
          // this.map
          //   .getSource("searchResult")
          //   .setData(jsonFeatureCollection);
            this.map.getSource('searchResult').setData({
              "type": "FeatureCollection",
              "features": this.props.listVueItems
            });
      //   }
    }
      //      else {
      //   this.map.getSource("searchResult").setData(this.emptyData);
      // }
  }

    if (this.props.needMapRepan) {
      // Search mode
      if (
        this.props.mode === "search" ||
        this.props.mode === "localAutocomplete"
      ) {
        import("../utils/moveTo").then(moveTo => {
          moveTo.moveTo(this.map, this.props.searchLocation, 11);
        });
        // this.queryAndRenderFeatures(this.props.searchLocation);
      }
    }

    if (this.props.needMapToggleLayer) {
      this.toggleLayerVisibility(this.props.toggleLayerVisibility);
    }

    if (this.props.needMapFilterByDate) {
      this.filterByDate(this.props.dateFrom, this.props.dateTo);
    }

    if (this.props.needMapFilterString) {
      this.filterStringContain(this.props.filterString);
    }

    if (this.props.needMapActualizeLanguage) {
      var lng = this.props.languageSet;
      setLanguage(this.map, style, lng, null);
      // in setLanguage, we use the original style of the map
      // -> It is necessary to switch and filter all visible layers again (quick hack, there is certainly a more efficient way)
      this.initLayerVisibility();
      this.filterByDate(this.props.dateFrom, this.props.dateTo);
    }

    this.props.setStateValue("needMapUpdate", false);
    this.props.setStateValue("needMapToggleLayer", false);
    this.props.setStateValue("needMapFilterByDate", false);
    this.props.setStateValue("needMapFilterString", false);
    this.props.setStateValue("needMapActualizeLanguage", false);
  }

  onMove(e) {
    if (!this.state.isDragging) return;

    const layerId = this.state.draggedLayer;
    if (this.movableLayers.indexOf(layerId) < 0) return;

    var coords = [e.lngLat.lng, e.lngLat.lat];
    this.setState({ draggedCoords: coords });

    // Set a UI indicator for dragging.
    this.map.getCanvas().style.cursor = "grabbing";

    const geometry = {
      type: "Point",
      coordinates: coords,
    };

    this.map.getSource(layerId).setData(geometry);
  }

  onceMove(e, status = "paused") {
    var coords = [e.lngLat.lng, e.lngLat.lat];
    const geometry = {
      type: "Point",
      coordinates: coords,
    };

    const layerId = this.state.draggedLayer;
    this.props.resetStateKeys([
      "placeInfo",
      "searchLocation",
      "route",
      "routeStatus",
    ]);
    this.props.setStateValue("routeStatus", status); // pause route updates
    this.props.setStateValue(this.layerToKey(layerId), {
      place_name: "__loading",
      geometry: geometry,
    });
    this.props.triggerMapUpdate();
  }

  onUp(e) {
    if (!this.state.isDragging) return;

    this.map.getCanvas().style.cursor = "";

    // Unbind mouse events
    this.map.off("mousemove", this.state.mouseMoveFn);

    this.onceMove(e, "idle");
    this.setState({ isDragging: false, draggedLayer: "", draggedCoords: null });
  }

  async onClick(e) {

    var filter = { layers: this.selectableLayers };
    var coords = {lng:  e.lngLat["lng"], lat: e.lngLat["lat"]};

    var point = this.map.project(coords);

    var bbox = [
      [point.x - 5, point.y - 5],
      [point.x + 5, point.y + 5],
    ];

    var features = this.map.queryRenderedFeatures(bbox, filter);
    this.setInfoItemAndRenderPopup (features);

    // this.queryFeaturesAndRenderPopup(coords, filter);
  };

  setInfoItemAndRenderPopup (features) {

    if(!features.length){
      return;
    } else {
      // We have a selected feature
      var feature = features[0];
      this.props.resetStateKeys(["placeInfo"]);

      /*Prepare data for detailInfo*/
      var paintColor = null;
      if (typeof feature.layer !== "undefined") {
        if ("paint" in feature.layer) {
          if (typeof feature.layer.paint["circle-color"] !== "undefined") {
            paintColor = feature.layer.paint["circle-color"];
          } else if (typeof feature.layer.paint["text-color"] !== "undefined") {
            paintColor = feature.layer.paint["text-color"];
          }
        }
      }
      else {
        paintColor = feature.paintColor;
        feature.layer = feature.layerId;
      }

      let place_name = null;
      let lng = this.props.languageSet;
      if (lng === "fr") {
        place_name = feature.properties.label_fr;
      } else {
        place_name = feature.properties.label_en
          ? feature.properties.label_en
          : feature.properties.label_fr;
      }

      if (typeof feature.layer !== "undefined") {
        if (["baignades"].includes(feature.layer.id)) {
          place_name = feature.properties.Adresse;
        }
        if (["toilets"].includes(feature.layer.id)) {
          place_name = "Toilets";
        }
      }

      // let listVueActive = false;

      // if more than one feature
      if (features.length > 1) {
        // listVueActive = true;
        // this.props.setStateValue("coorOnClick",
        //   [
        //     coords["lng"],
        //     coords["lat"],
        //   ]);
        this.props.setStateValue("coorOnClick", feature.geometry.coordinates);
        this.props.setStateValue("listVueActive", true);
        this.props.setStateValue("listVueItems", features);
        this.props.setStateValue("popupActive", false);
      } else {
        // listVueActive = false;
        this.props.setStateValue("listVueActive", false);
        this.props.setStateValue("popupActive", true);
      }


      let infoItem = this.setInfoItem(place_name, feature, paintColor);
      this.props.setStateValue("infoPopup", infoItem);

      /**Call setStateValue
       * @todo: check if the popupActive: true, listVueActive: listVueActive
       * are really necessary here because they are not part of searchLocaltion
       * */
      if (place_name) {
        this.props.setStateValue("searchLocation", {
          type: "Feature",
          place_name: place_name,
          properties: feature.properties,
          geometry: feature.geometry,
          layerId: feature.layer.id,
          featureId: feature.id,
          paintColor: paintColor,
          // popupActive: true,
          // listVueActive: listVueActive,
        });

        this.props.triggerMapUpdate();
        /* take map screenshot */
        this.takeScreenshot(this.map).then((data) => {
          this.props.setStateValue("mapScreenshot", data);
        });
      }
    }
  }

  queryAndRenderFeatures(location) {
    var pointLocation = this.map.project(location.geometry.coordinates);
    var bbox = [
      [pointLocation.x - 5, pointLocation.y - 5],
      [pointLocation.x + 5, pointLocation.y + 5],
    ];
    var features = this.map.queryRenderedFeatures(bbox, {
      layers: this.selectableLayers,
    });

    if (features.length) {
      // We have a selected feature
      var feature = features[0];

      /*Prepare data for detailInfo*/
      var paintColor = null;
      if ("paint" in feature.layer) {
        if (typeof feature.layer.paint["circle-color"] !== "undefined") {
          paintColor = feature.layer.paint["circle-color"];
        } else if (typeof feature.layer.paint["text-color"] !== "undefined") {
          paintColor = feature.layer.paint["text-color"];
        }
      }

      let place_name = null;
      if (feature.properties.name) {
        place_name = feature.properties.name;
      } else if (feature.properties.label) {
        place_name = feature.properties.label;
      } else if (feature.properties.nom_du_musee) {
        place_name = feature.properties.nom_du_musee;
      }

      if (
        [
          "parcsjardins",
          "localproductshop",
          "craftmanshop",
          "WineCelar",
          "OTFrance",
          "AiresJeux",
          "marches",
          "exposition",
          "musique",
          "children",
          "videsgreniers",
        ].includes(feature.layer.id)
      ) {
        let lng = this.props.languageSet;
        if (lng === "fr") {
          place_name = feature.properties.label_fr;
        } else {
          place_name = feature.properties.label_en;
        }
      }
      if (["baignades"].includes(feature.layer.id)) {
        place_name = feature.properties.Adresse;
      }
      if (["toilets"].includes(feature.layer.id)) {
        place_name = "Toilets";
      }

      let listVueActive = false;

      // if more than one feature onClick
      if (features.length > 1) {
        listVueActive = true;
        this.props.setStateValue("coorOnClick", [
          location.geometry.coordinates[0],
          location.geometry.coordinates[1],
        ]);
        this.props.setStateValue("listVueActive", true);
        this.props.setStateValue("listVueItems", features);
      } else {
        listVueActive = false;
        this.props.setStateValue("listVueActive", false);
      }

      let infoItem = this.setInfoItem(place_name, feature, paintColor, listVueActive);
      this.props.setStateValue("infoPopup", infoItem);
      this.props.setStateValue("searchLocation", infoItem);
      // since Collapsible List Display no popupInfo required
      this.props.setStateValue("popupActive", false);
    }
  }

  setInfoItem(place_name, feature, paintColor) {
    let infoItem = {};
    infoItem.place_name = place_name;
    infoItem.properties = feature.properties;
    infoItem.geometry = feature.geometry;
    infoItem.layerId = feature.layer.id;
    infoItem.featureId = feature.id;
    infoItem.paintColor = paintColor;
    // infoItem.listVueActive = listVueActive;
    return infoItem;
  }

  onLoad() {
    // helper to set geolocation
    const setGeolocation = data => {
      const geometry = {
        type: "Point",
        coordinates: [data.coords.longitude, data.coords.latitude],
      };
      this.map.getSource("geolocation").setData(geometry);
      this.props.setUserLocation(geometry.coordinates);

      if (this.props.moveOnLoad) {
        import("../utils/moveTo") // moveTo function dynamic import
          .then(moveTo => {
            moveTo.moveTo(this.map, geometry, 6);
          });
      }
    };

    // Create geolocation control
    const geolocateControl = new mapboxgl.GeolocateControl();
    geolocateControl.on("geolocate", setGeolocation);
    this.map.addControl(geolocateControl, "bottom-left");

    // Create scale and Navigation controls
    if (
      window.innerWidth > 320 &&
      !("ontouchstart" in window || navigator.msMaxTouchPoints > 0)
    ) {
      // const scaleControl = new mapboxgl.ScaleControl({
      //   maxWidth: 80,
      //   unit: "metric"
      // });

      // this.map.addControl(scaleControl, "bottom-left");
      this.map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
    }

    // Set event listeners
    this.map.on("click", e => this.onClick(e));
    this.map.on("mousemove", e => {
      var features = this.map.queryRenderedFeatures(e.point, {
        layers: this.selectableLayers,
      });
      if (features.length) {
        this.map.getCanvas().style.cursor = "pointer";
      } else {
        this.map.getCanvas().style.cursor = "";
        this.setState({ isCursorOverPoint: false });
        this.map.dragPan.enable();
      }
    });

    this.map.on("moveend", () => {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      this.props.setStateValue("mapCoords", [center.lng, center.lat, zoom]);
    });

    const DefaultState = defaultAppState;

    if (
      JSON.stringify(this.props.visibility) !==
      JSON.stringify(DefaultState.visibility)
    ) {
      this.initLayerVisibility();
      // Final update if the original state has some data
      this.props.triggerMapUpdate();
    }
  }

  initLayerVisibility() {
    import("../utils/displayUtils").then(({ layerSelector }) => {
      Object.keys(this.props.visibility).forEach(key => {
        if (this.props.visibility[key]) {
          this.map.setLayoutProperty(
            layerSelector[key].source,
            "visibility",
            "visible",
          );
        } else {
          if (typeof layerSelector[key] === "undefined") return;
          let isVisible = this.map.getLayoutProperty(
            layerSelector[key].source,
            "visibility",
          );
          if (isVisible === "visible") {
            // set 'visibility' to 'none'
            this.map.setLayoutProperty(
              layerSelector[key].source,
              "visibility",
              "none",
            );
          }
        }
      });
    });
  }

  toggleLayerVisibility(toggleLayerVisibility) {
    var visibility = this.map.getLayoutProperty(
      toggleLayerVisibility,
      "visibility",
    );
    if (visibility === "visible") {
      this.map.setLayoutProperty(toggleLayerVisibility, "visibility", "none");
    } else {
      this.map.setLayoutProperty(
        toggleLayerVisibility,
        "visibility",
        "visible",
      );
    }
  }

  filterByDate(dateFrom, dateTo) {
    if (dateTo !== dateFrom) {
      let filterTo = ["<=", dateFrom, ["number", ["get", "valid_through"]]];
      let filterFrom = [">", dateTo, ["number", ["get", "valid_from"]]];

      this.map.setFilter("musique", ["all", filterFrom, filterTo]);
      this.map.setFilter("exposition", ["all", filterFrom, filterTo]);
      this.map.setFilter("children", ["all", filterFrom, filterTo]);
      this.map.setFilter("videsgreniers", ["all", filterFrom, filterTo]);
      this.map.setFilter("marches", ["all", filterFrom, filterTo]);
    } else {
      this.map.setFilter("musique", [
        "<=",
        dateFrom,
        ["number", ["get", "valid_from"]],
      ]);
      this.map.setFilter("exposition", [
        "<=",
        dateFrom,
        ["number", ["get", "valid_from"]],
      ]);
      this.map.setFilter("children", [
        "<=",
        dateFrom,
        ["number", ["get", "valid_from"]],
      ]);
      this.map.setFilter("videsgreniers", [
        "<=",
        dateFrom,
        ["number", ["get", "valid_from"]],
      ]);
      this.map.setFilter("marches", [
        "<=",
        dateFrom,
        ["number", ["get", "valid_from"]],
      ]);
    }
  }

  filterStringContain(stringInput) {
    let filterString = ["in", stringInput, ["string", ["get", "label_fr"]]];

    this.map.setFilter("musique", filterString, false);
    this.map.setFilter("exposition", filterString, false);
    this.map.setFilter("children", filterString, false);
    this.map.setFilter("videsgreniers", filterString, false);
    this.map.setFilter("marches", filterString, false);
  }

  unsetFilterStringContain() {
    var undifined;
    let filterString = ["in", undifined, ["string", ["get", "label_fr"]]];

    this.map.setFilter("musique", filterString, false);
    this.map.setFilter("exposition", filterString, false);
    this.map.setFilter("children", filterString, false);
    this.map.setFilter("videsgreniers", filterString, false);
    this.map.setFilter("marches", filterString, false);
  }

  layerToKey(layer) {
    if (this.props.mode === "search" && layer === "marker")
      return "searchLocation";
    else return "";
  }

  takeScreenshot(map) {
    return new Promise(function(resolve, reject) {
      map.once("idle", function() {
        resolve(map.getCanvas().toDataURL());
      });
      /* trigger render */
      map.setBearing(map.getBearing());
    });
  };

  get emptyData() {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  get selectableLayers() {
    return [
      // 'rail-label',
      // 'poi-scalerank1',
      // 'poi-parks-scalerank1',
      // 'poi-scalerank2',
      // 'poi-parks-scalerank2',
      // 'poi-scalerank3',
      // 'poi-parks-scalerank3',
      // 'poi-scalerank4',
      // 'poi-parks-scalerank4',
      // "FranceWiki",
      "museesFrance",
      "plusBeauxVillagesDeFrance",
      "patrimoinemondialenfrance",
      "jardinremarquable",
      "grandSiteDeFrance",
      "monumentsnationaux",
      "villeEtPaysArtHistoire",
      "parcsjardins",
      "localproductshop",
      "craftmanshop",
      "WineCelar",
      "OTFrance",
      "AiresJeux",
      "exposition",
      "musique",
      "children",
      "marches",
      "baignades",
      "toilets",
      "videsgreniers",
      "searchResult",
    ];
  }
}

MapComponent.propTypes = {
  // accessToken: PropTypes.string,
  center: PropTypes.array,
  coorOnClick: PropTypes.array,
  dateFrom: PropTypes.number,
  dateTo: PropTypes.number,
  filterString: PropTypes.string,
  languageSet: PropTypes.string,
  legendItems: PropTypes.array,
  listVueItems: PropTypes.array,
  listVueActive: PropTypes.bool,
  map: PropTypes.object,
  modality: PropTypes.string,
  mode: PropTypes.string,
  moveOnLoad: PropTypes.bool,
  needMapRepan: PropTypes.bool,
  needMapToggleLayer: PropTypes.bool,
  needMapFilterByDate: PropTypes.bool,
  needMapFilterString: PropTypes.bool,
  needMapActualizeLanguage: PropTypes.bool,
  needMapUpdate: PropTypes.bool,
  pushHistory: PropTypes.func,
  resetStateKeys: PropTypes.func,
  route: PropTypes.object,
  routeStatus: PropTypes.string,
  searchLocation: PropTypes.object,
  setStateValue: PropTypes.func,
  setUserLocation: PropTypes.func,
  triggerMapUpdate: PropTypes.func,
  toggleLayerVisibility: PropTypes.string,
  userLocation: PropTypes.object,
  visibility: PropTypes.object,
  zoom: PropTypes.number,
};

const mapStateToProps = (state) => {
  return {
    // accessToken: state.app.mapboxAccessToken,
    center: state.app.mapCoords.slice(0, 2),
    toggleLayerVisibility: state.app.toggleLayerVisibility,
    dateFrom: state.app.dateFrom,
    dateTo: state.app.dateTo,
    filterString: state.app.filterString,
    languageSet: state.app.languageSet,
    listVueItems: state.app.listVueItems,
    listVueActive: state.app.listVueActive,
    coorOnClick:  state.app.coorOnClick,
    modality: state.app.modality,
    mode: state.app.mode,
    needMapRepan: state.app.needMapRepan,
    needMapToggleLayer: state.app.needMapToggleLayer,
    needMapActualizeLanguage: state.app.needMapActualizeLanguage,
    needMapFilterByDate: state.app.needMapFilterByDate,
    needMapFilterString: state.app.needMapFilterString,
    needMapString: state.app.needMapString,
    needMapUpdate: state.app.needMapUpdate,
    popupActive: state.app.popupActive,
    searchLocation: state.app.searchLocation,
    userLocation: state.app.userLocation,
    visibility: state.app.visibility,
    zoom: state.app.mapCoords[2],
  };
};

const loadedPromise = map => {
  if (map.isStyleLoaded()) return Promise.resolve(true);
  return new Promise(resolve => {
    map.on("idle", () => resolve(true));
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    pushHistory: (url) => dispatch(push(url)),
    setStateValue: (key, value) => dispatch(setStateValue(key, value)),
    setUserLocation: (coordinates) => dispatch(setUserLocation(coordinates)),
    triggerMapUpdate: (repan) => dispatch(triggerMapUpdate(repan)),
    resetStateKeys: (keys) => dispatch(resetStateKeys(keys)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate("translations")(MapComponent));
