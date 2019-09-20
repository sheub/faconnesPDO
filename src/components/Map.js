import PropTypes from "prop-types";
import React, {Component} from "react";
import { translate } from "react-i18next";

import {connect} from "react-redux";
import {push} from "connected-react-router";

import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import turfBbox from "@turf/bbox";

import {setLanguage} from "../utils/openmaptiles-language";
import { defaultAppState } from "../reducers/appReducer";

import {
  setStateValue,
  setUserLocation,
  triggerMapUpdate,
  getRoute,
  resetStateKeys
} from "../actions/index";

import style from "../styles/osm-bright.json";
// Set the sprite URL in the style. It has to be a full, absolute URL.
let spriteUrl;
if (process.env.NODE_ENV === "production") {
    spriteUrl = process.env.PUBLIC_URL + "/sprite";
    // spriteUrl = "https://faconnes.de" + "/sprite";
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
            draggedCoords: null
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

        mapboxgl.accessToken = this.props.accessToken;
        const map = new mapboxgl.Map({
            container: "map",
            style: style,
            center: [2, 45.5],
            zoom: 4,
            minZoom: 2,
            maxZoom: 20,
            maxBounds: [-15.06, 34.07, 24.32, 55.11],

        });

        this.map = map;

        map.on("load", () => {
            this.onLoad();
        });
    }

    componentDidUpdate() {

        if (!this.props.needMapUpdate) return;

        // Search mode
        if (this.props.mode === "search") {
            if (this.props.searchLocation) {
                if (this.props.searchLocation.geometry) {
                    let markerSource = this.map.getSource("marker");
                    if (typeof (markerSource) === "undefined") { return; }
                    this.map.getSource("marker").setData(this.props.searchLocation.geometry);
                }
            } else {
                this.map.getSource("marker").setData(this.emptyData);
            }

            // remove items specific to directions mode
            this.map.getSource("fromMarker").setData(this.emptyData);
            this.map.getSource("route").setData(this.emptyData);
        }

        // Directions mode
        else if (this.props.mode === "directions") {
            if (this.props.directionsFrom) {
                this.map.getSource("fromMarker").setData(this.props.directionsFrom.geometry);
            } else {
                this.map.getSource("fromMarker").setData(this.emptyData);
            }

            if (this.props.directionsTo) {
                this.map.getSource("marker").setData(this.props.directionsTo.geometry);
            } else {
                this.map.getSource("marker").setData(this.emptyData);
            }

            if (this.props.route) {
                this.map.getSource("route").setData(this.props.route.geometry);
            } else {
                this.map.getSource("route").setData(this.emptyData);
            }

            // We have origin and destination but no route yet
            if (this.props.directionsFrom && this.props.directionsTo && this.props.route === null) {
                // Do not retry when the previous request errored
                if (this.props.routeStatus !== "error" && this.props.routeStatus !== "paused") {
                    // Trigger the API call to directions
                    this.props.getRoute(
                        this.props.directionsFrom,
                        this.props.directionsTo,
                        this.props.modality,
                        this.props.accessToken
                    );
                }
            }
        }

        if (this.props.needMapRepan) {
            // Search mode
            if (this.props.mode === "search") {
                import("../utils/moveTo")
                .then((moveTo) => {
                    moveTo.moveTo(this.map, this.props.searchLocation, 11);
                });
                this.queryAndRenderFeatures(this.props.searchLocation);
            }

            // Directions mode
            if (this.props.mode === "directions") {
                if (this.props.route) {
                    const bbox = turfBbox(this.props.route.geometry);
                    import("../utils/moveTo")
                    .then((moveTo) => {
                        moveTo.moveTo(this.map, { bbox: bbox });
                    });

                } else if (this.props.directionsTo && this.props.directionsFrom) {
                    const bbox = turfBbox({
                        type: "FeatureCollection",
                        features: [this.props.directionsFrom, this.props.directionsTo]
                    });
                    import("../utils/moveTo")
                    .then((moveTo) => {
                        moveTo.moveTo(this.map, { bbox: bbox });
                    });

                } else {
                    // Whichever exists
                    import("../utils/moveTo")
                    .then((moveTo) => {
                        moveTo.moveTo(this.map, this.props.directionsTo);
                        moveTo.moveTo(this.map, this.props.directionsFrom);
                    });
                }
            }
        }

        this.props.setStateValue("needMapUpdate", false);
        if (this.props.needMapToggleLayer) {
            this.toggleLayerVisibility(this.props.toggleLayerVisibility);
        }

        if (this.props.needMapFilterByDate) {
            this.filterByDate(this.props.dateFrom, this.props.dateTo);
        }

        if (this.props.needMapActualizeLanguage) {
            var lng = this.props.languageSet;
            setLanguage (this.map, style, lng, null);
            // in setLanguage, we use the original style of the map
            // -> It is necessary to switch and filter all visible layers again (quick hack, there is certainly a more efficient way)
            this.initLayerVisibility();
            this.filterByDate(this.props.dateFrom, this.props.dateTo);
        }

        this.props.setStateValue("needMapToggleLayer", false);
        this.props.setStateValue("needMapFilterByDate", false);
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
            coordinates: coords
        };

        this.map.getSource(layerId).setData(geometry);
    }

    onceMove(e, status = "paused") {
        var coords = [e.lngLat.lng, e.lngLat.lat];
        const geometry = {
            type: "Point",
            coordinates: coords
        };

        const layerId = this.state.draggedLayer;
        this.props.resetStateKeys(["placeInfo", "searchLocation", "route", "routeStatus"]);
        this.props.setStateValue("routeStatus", status); // pause route updates
        this.props.setStateValue(this.layerToKey(layerId), {
            place_name: "__loading",
            geometry: geometry
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

    onClick(e) {

        var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
        var features = this.map.queryRenderedFeatures(bbox, { layers: this.selectableLayers });

        if (features.length) {
            // We have a selected feature
            var feature = features[0];

            let key;
            // if (this.props.mode === 'search') {
            this.props.resetStateKeys(["placeInfo"]);
            key = "searchLocation";
            // }
            //  else if (!this.props.directionsFrom) {
            //   key = 'directionsFrom';
            // } else {
            //   this.props.resetStateKeys(['route', 'searchLocation']);
            //   key = 'directionsTo';
            // }

            /*Prepare data for detailInfo*/
            var paintColor = null;
            if ("paint" in feature.layer) {
                if (typeof (feature.layer.paint["circle-color"]) !== "undefined") {
                    paintColor = feature.layer.paint["circle-color"];
                }
                else if (typeof (feature.layer.paint["text-color"]) !== "undefined") {
                    paintColor = feature.layer.paint["text-color"];
                }
            }

            let place_name = null;
            // if (feature.properties.name) { place_name = feature.properties.name; }
            // else if (feature.properties.label) { place_name = feature.properties.label; }
            // else if (feature.properties.nom_du_musee) { place_name = feature.properties.nom_du_musee; }

            // if (["parcsjardins",
            //     "localproductshop",
            //     "craftmanshop",
            //     "WineCelar",
            //     "OTFrance",
            //     "AiresJeux",
            //     "marches",
            //     "exposition",
            //     "musique",
            //     "children",
            //     "videsgreniers"].includes(feature.layer.id))
            // {
                let lng = this.props.languageSet;
                if(lng === "fr")
                {
                    place_name = feature.properties.label_fr;
                }
                else
                {
                    place_name = feature.properties.label_en ? feature.properties.label_en : feature.properties.label_fr;
                }
            // }
            if(["baignades"].includes(feature.layer.id))
            {
                place_name = feature.properties.Adresse;
            }
            if(["toilets"].includes(feature.layer.id))
            {
                place_name = "Toilets";
            }

            let listVueActive = false;

            if (features.length > 1) {

                listVueActive = true;
                this.props.setStateValue("coorOnClick", [e.lngLat["lng"], e.lngLat["lat"]]);
                this.props.setStateValue("listVueActive", true);
                this.props.setStateValue("listVueItems", features);
            }
            else {
                listVueActive = false;
                this.props.setStateValue("listVueActive", false);
            }

            let infoItem = {};
            infoItem.place_name = place_name;
            infoItem.properties = feature.properties;
            infoItem.geometry = feature.geometry;
            infoItem.layerId = feature.layer.id;
            infoItem.paintColor = paintColor;
            infoItem.listVueActive = listVueActive;
            infoItem.popupActive = true;
            this.props.setStateValue("infoPopup", infoItem);

            /**Call setStateValue */
            if (key && place_name) {
                this.props.setStateValue(key, {
                    type: "Feature",
                    place_name: place_name,
                    properties: feature.properties,
                    geometry: feature.geometry,
                    layerId: feature.layer.id,
                    paintColor: paintColor,
                    popupActive: true,
                    listVueActive: listVueActive
                });
                this.props.triggerMapUpdate();
            }
        }
    }

    queryAndRenderFeatures(location){
    
        var pointLocation = this.map.project(location.geometry.coordinates);
        var bbox = [[pointLocation.x - 5, pointLocation.y - 5], [pointLocation.x + 5, pointLocation.y + 5]];
        var features = this.map.queryRenderedFeatures(bbox, { layers: this.selectableLayers });

        if (features.length) {
            // We have a selected feature
            var feature = features[0];

            /*Prepare data for detailInfo*/
            var paintColor = null;
            if ("paint" in feature.layer) {
                if (typeof (feature.layer.paint["circle-color"]) !== "undefined") {
                    paintColor = feature.layer.paint["circle-color"];
                }
                else if (typeof (feature.layer.paint["text-color"]) !== "undefined") {
                    paintColor = feature.layer.paint["text-color"];
                }
            }

            let place_name = null;
            if (feature.properties.name) { place_name = feature.properties.name; }
            else if (feature.properties.label) { place_name = feature.properties.label; }
            else if (feature.properties.nom_du_musee) { place_name = feature.properties.nom_du_musee; }

            if (["parcsjardins", "localproductshop", "craftmanshop", "WineCelar", "OTFrance", "AiresJeux", "marches", "exposition", "musique", "children", "videsgreniers"].includes(feature.layer.id))
            {
                let lng = this.props.languageSet;
                if(lng === "fr")
                {
                    place_name = feature.properties.label_fr;
                }
                else
                {
                    place_name = feature.properties.label_en;
                }
            }
            if(["baignades"].includes(feature.layer.id))
            {
                place_name = feature.properties.Adresse;
            }
            if(["toilets"].includes(feature.layer.id))
            {
                place_name = "Toilets";
            }

            let listVueActive = false;

            if (features.length > 1) {

                listVueActive = true;
                this.props.setStateValue("coorOnClick", [location.geometry.coordinates[0], location.geometry.coordinates[1]]);
                this.props.setStateValue("listVueActive", true);
                this.props.setStateValue("listVueItems", features);
            }
            else {
                listVueActive = false;
                this.props.setStateValue("listVueActive", false);
            }

            let infoItem = {};
            infoItem.place_name = place_name;
            infoItem.properties = feature.properties;
            infoItem.geometry = feature.geometry;
            infoItem.layerId = feature.layer.id;
            infoItem.paintColor = paintColor;
            infoItem.listVueActive = listVueActive;
            infoItem.popupActive = true;
            this.props.setStateValue("infoPopup", infoItem);
        }
    }

    onLoad() {
    // helper to set geolocation
        const setGeolocation = (data) => {
            const geometry = { type: "Point", coordinates: [data.coords.longitude, data.coords.latitude] };
            this.map.getSource("geolocation").setData(geometry);
            this.props.setUserLocation(geometry.coordinates);
      
            if (this.props.moveOnLoad) {
                import("../utils/moveTo") // moveTo function dynamic import
      .then((moveTo) => {
          moveTo.moveTo(this.map, geometry, 6);         
      });
            }
        };
    
    // Create geolocation control
        const geolocateControl = new mapboxgl.GeolocateControl();
        geolocateControl.on("geolocate", setGeolocation);
        this.map.addControl(geolocateControl, "bottom-left");

    // Create scale control
        if (window.innerWidth > 320 && !(("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0))) {
            const scaleControl = new mapboxgl.ScaleControl({
                maxWidth: 80,
                unit: "metric"
            });

            this.map.addControl(scaleControl, "bottom-left");
            this.map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
        }

    // Set event listeners
        this.map.on("click", (e) => this.onClick(e));
        this.map.on("mousemove", (e) =>
    {
            var features = this.map.queryRenderedFeatures(e.point, { layers: this.selectableLayers });
            if (features.length) {
                this.map.getCanvas().style.cursor = "pointer";
            } 
            else {
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

        if(JSON.stringify(this.props.visibility) !== JSON.stringify(DefaultState.visibility)){
            this.initLayerVisibility();
      // Final update if the original state has some data
            this.props.triggerMapUpdate();
        }
    }

    initLayerVisibility(){

        import("../utils/displayUtils")
    .then(({ layerSelector } ) => {
        Object.keys(this.props.visibility).forEach(key => {
            if (this.props.visibility[key]) {
                this.map.setLayoutProperty(layerSelector[key].source, "visibility", "visible");
        // if (["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance",
        //   "patrimoinemondialenfrance"].includes(layerSelector[key].source)) {
        //   this.loadJsonData(layerSelector[key].source);
        // }
            } else {
                if (typeof (layerSelector[key]) === "undefined") return;
                let isVisible = this.map.getLayoutProperty(layerSelector[key].source, "visibility");
                if (isVisible === "visible") {
          // set 'visibility' to 'none'
                    this.map.setLayoutProperty(layerSelector[key].source, "visibility", "none");
          // set Empty Data to sources
          // if (["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance",
          //   "patrimoinemondialenfrance"].includes(layerSelector[key].source)) {
          //   this.setEmptyData(layerSelector[key].source);
          // }
                }
            }
        });});

    }

    toggleLayerVisibility(toggleLayerVisibility) {

        var visibility = this.map.getLayoutProperty(toggleLayerVisibility, "visibility");
        if (visibility === "visible") {
            this.map.setLayoutProperty(toggleLayerVisibility, "visibility", "none");
        } else {
            this.map.setLayoutProperty(toggleLayerVisibility, "visibility", "visible");
      // if( ["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance", "patrimoinemondialenfrance"].includes(toggleLayerVisibility)){
      //   this.loadJsonData(toggleLayerVisibility);        
      // }
        }
    }

    setEmptyData(dataStr){
        this.map.getSource(dataStr).setData({
            type: "FeatureCollection",
            features: []
        });

    }

    // loadJsonData(dataStr) {

    //     let baseDataUrl;
    //     if (process.env.NODE_ENV === "production") {
    //         baseDataUrl = process.env.PUBLIC_URL + "/data/";
    //     } else { // Dev server runs on port 3000
    //         baseDataUrl = "http://localhost:3000/data/";
    //     }


    //     let AllData = {
    //     };
    //     var lng = this.props.languageSet;

    //     if (["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance", "patrimoinemondialenfrance"].includes(dataStr) && lng === "fr") {
    //         AllData = {
    //             patrimoinemondialenfrance: "Patrimoine_Mondial_en_France.geojson",
    //             monumentsnationaux: "Monuments_Nationaux.geojson",
    //             grandSiteDeFrance: "Grand_Site_de_France.geojson",
    //             jardinremarquable: "Jardin_Remarquable.geojson",
    //             plusBeauxVillagesDeFrance: "Plus_Beaux_Villages_de_France.geojson",
    //         };
    //     } else
    //   if (["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance", "patrimoinemondialenfrance"].includes(dataStr) && lng === "en") {
    //       AllData = {
    //           patrimoinemondialenfrance: "Patrimoine_Mondial_en_France_en.geojson",
    //           monumentsnationaux: "Monuments_Nationaux_en.geojson",
    //           grandSiteDeFrance: "Grand_Site_de_France_en.geojson",
    //           jardinremarquable: "Jardin_Remarquable_en.geojson",
    //           plusBeauxVillagesDeFrance: "Plus_Beaux_Villages_de_France_en.geojson",
    //       };
    //   }

    //     const marchesData = baseDataUrl + AllData[dataStr];
    //     this.map.getSource(dataStr).setData(marchesData);
    // }

    filterByDate(dateFrom, dateTo) {
        if(dateTo !== dateFrom) {

            let filterTo = ["<=", dateFrom, ["number", ["get", "valid_through"]]];
            let filterFrom = [">", dateTo, ["number", ["get", "valid_from"]]];
            this.map.setFilter("musique", ["all", filterFrom, filterTo]);
            this.map.setFilter("exposition", ["all", filterFrom, filterTo]);
            this.map.setFilter("children", ["all", filterFrom, filterTo]);
            this.map.setFilter("videsgreniers", ["all", filterFrom, filterTo]);
            this.map.setFilter("marches", ["all", filterFrom, filterTo]);
        } else {
            this.map.setFilter("musique", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
            this.map.setFilter("exposition", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
            this.map.setFilter("children", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
            this.map.setFilter("videsgreniers", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
            this.map.setFilter("marches", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
        }
    }

    layerToKey(layer) {
        if (this.props.mode === "search" && layer === "marker") return "searchLocation";
        else if (this.props.mode === "directions" && layer === "marker") return "directionsTo";
        else if (this.props.mode === "directions" && layer === "fromMarker") return "directionsFrom";
        else return "";
    }

    get emptyData() {
        return {
            type: "FeatureCollection",
            features: []
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
            "videsgreniers"
        ];
    }

}

MapComponent.propTypes = {
    accessToken: PropTypes.string,
    center: PropTypes.array,
    coorOnClick: PropTypes.array,
    dateFrom: PropTypes.number,
    dateTo: PropTypes.number,
    directionsFrom: PropTypes.object,
    directionsTo: PropTypes.object,
    getRoute: PropTypes.func,
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
        accessToken: state.app.mapboxAccessToken,
        center: state.app.mapCoords.slice(0, 2),
        directionsFrom: state.app.directionsFrom,
        directionsTo: state.app.directionsTo,
        toggleLayerVisibility: state.app.toggleLayerVisibility,
        dateFrom: state.app.dateFrom,
        dateTo: state.app.dateTo,
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
        needMapUpdate: state.app.needMapUpdate,
        route: state.app.route,
        routeStatus: state.app.routeStatus,
        searchLocation: state.app.searchLocation,
        userLocation: state.app.userLocation,
        visibility: state.app.visibility,
        zoom: state.app.mapCoords[2],
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRoute: (directionsFrom, directionsTo, modality, accessToken) => dispatch(getRoute(directionsFrom, directionsTo, modality, accessToken)),
        pushHistory: (url) => dispatch(push(url)),
        setStateValue: (key, value) => dispatch(setStateValue(key, value)),
        setUserLocation: (coordinates) => dispatch(setUserLocation(coordinates)),
        triggerMapUpdate: (repan) => dispatch(triggerMapUpdate(repan)),
        resetStateKeys: (keys) => dispatch(resetStateKeys(keys))
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate("translations")(MapComponent));
