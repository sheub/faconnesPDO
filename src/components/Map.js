import PropTypes from "prop-types";
import React, {Component} from "react";
import { translate } from "react-i18next";

import {connect} from "react-redux";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import turfBbox from "@turf/bbox";
import turfBboxPolygon from "@turf/bbox-polygon";
import turfBuffer from "@turf/buffer";
import turfDistance from "@turf/distance";
import {setLanguage} from "../utils/openmaptiles-language";
// import Legend from "./Legend";


import {push} from "react-router-redux";
import {
  setStateValue,
  setUserLocation,
  triggerMapUpdate,
  getRoute,
  getReverseGeocode,
  resetStateKeys
} from "../actions/index";

import style from "../styles/osm-basic.json";
// Set the sprite URL in the style. It has to be a full, absolute URL.
let spriteUrl;
if (process.env.NODE_ENV === "production") {
  spriteUrl = process.env.PUBLIC_URL + "/sprite";
} else { // Dev server runs on port 3000
  spriteUrl = "http://localhost:3000/sprite";
}
style.sprite = spriteUrl;

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      isCursorOverPoint: false,
      draggedLayer: '',
      draggedCoords: null
    };
  }

  render() {
    return (
      // <div id='map' className='viewport-full'>
      <div>
        <div id="map"></div>
        {/* <div className='map-overlay' id='legend'></div> */}
        {/* <Legend legendItems={this.props.legendItems}/> */}
      </div>
    );
  }

  componentDidMount() {

    mapboxgl.accessToken = this.props.accessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: style,
      center: [2, 46.5],
      zoom: 4,
      minZoom: 2,
      maxZoom: 20,
      maxBounds: [-15.06, 34.07, 24.32, 55.11],

    });

    this.map = map;

    map.on('load', () => {
      this.onLoad();
    });

  }

  componentDidUpdate() {

    if (!this.props.needMapUpdate) return;

    // Search mode
    if (this.props.mode === 'search') {
      if (this.props.searchLocation) {
        if (this.props.searchLocation.geometry) {
          let markerSource = this.map.getSource('marker')
          if (typeof (markerSource) === "undefined") { return }
          this.map.getSource('marker').setData(this.props.searchLocation.geometry);
        }
      } else {
        this.map.getSource('marker').setData(this.emptyData);
      }

      // remove items specific to directions mode
      this.map.getSource('fromMarker').setData(this.emptyData);
      this.map.getSource('route').setData(this.emptyData);
    }

    // Directions mode
    if (this.props.mode === 'directions') {
      if (this.props.directionsFrom) {
        this.map.getSource('fromMarker').setData(this.props.directionsFrom.geometry);
      } else {
        this.map.getSource('fromMarker').setData(this.emptyData);
      }

      if (this.props.directionsTo) {
        this.map.getSource('marker').setData(this.props.directionsTo.geometry);
      } else {
        this.map.getSource('marker').setData(this.emptyData);
      }

      if (this.props.route) {
        this.map.getSource('route').setData(this.props.route.geometry);
      } else {
        this.map.getSource('route').setData(this.emptyData);
      }

      // We have origin and destination but no route yet
      if (this.props.directionsFrom && this.props.directionsTo && this.props.route === null) {
        // Do not retry when the previous request errored
        if (this.props.routeStatus !== 'error' && this.props.routeStatus !== 'paused') {
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
      if (this.props.mode === 'search') {
        this.moveTo(this.props.searchLocation);
      }

      // Directions mode
      if (this.props.mode === 'directions') {
        if (this.props.route) {
          const bbox = turfBbox(this.props.route.geometry);
          this.moveTo({ bbox: bbox });

        } else if (this.props.directionsTo && this.props.directionsFrom) {
          const bbox = turfBbox({
            type: 'FeatureCollection',
            features: [this.props.directionsFrom, this.props.directionsTo]
          });
          this.moveTo({ bbox: bbox });

        } else {
          // Whichever exists
          this.moveTo(this.props.directionsTo);
          this.moveTo(this.props.directionsFrom);
        }
      }
    }

    this.props.setStateValue('needMapUpdate', false);
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

    this.props.setStateValue('needMapRestyle', false);
    this.props.setStateValue('needMapToggleLayer', false);
    this.props.setStateValue('needMapFilterByDate', false);
    this.props.setStateValue('needMapActualizeLanguage', false);

  }

  moveTo(location, zoom) {
    if (!location) return;
    if (location.bbox) { // We have a bbox to fit to
      const distance = turfDistance([location.bbox[0], location.bbox[1]], [location.bbox[2], location.bbox[3]]);
      const buffered = turfBuffer(turfBboxPolygon(location.bbox), distance / 2, 'kilometers');
      const bbox = turfBbox(buffered);
      try {
        this.map.fitBounds(bbox, { linear: true });
      } catch (e) {
        this.map.fitBounds(location.bbox, { linear: true });
      }
    } else { // We just have a point
      this.map.easeTo({
        center: location.geometry.coordinates,
        zoom: zoom || 16
      });
    }
  }

  onMove(e) {
    if (!this.state.isDragging) return;

    const layerId = this.state.draggedLayer;
    if (this.movableLayers.indexOf(layerId) < 0) return;

    var coords = [e.lngLat.lng, e.lngLat.lat];
    this.setState({ draggedCoords: coords });

    // Set a UI indicator for dragging.
    this.map.getCanvas().style.cursor = 'grabbing';

    const geometry = {
      type: 'Point',
      coordinates: coords
    };

    this.map.getSource(layerId).setData(geometry);
  }

  onceMove(e, status = 'paused') {
    var coords = [e.lngLat.lng, e.lngLat.lat];
    const geometry = {
      type: 'Point',
      coordinates: coords
    };

    const layerId = this.state.draggedLayer;
    this.props.resetStateKeys(['placeInfo', 'searchLocation', 'route', 'routeStatus']);
    this.props.setStateValue('routeStatus', status); // pause route updates
    this.props.setStateValue(this.layerToKey(layerId), {
      'place_name': '__loading',
      'geometry': geometry
    });
    this.props.triggerMapUpdate();
  }

  onUp(e) {
    
    if (!this.state.isDragging) return;

    this.map.getCanvas().style.cursor = '';

    // Unbind mouse events
    this.map.off('mousemove', this.state.mouseMoveFn);

    this.onceMove(e, 'idle');
    this.setState({isDragging: false, draggedLayer: '', draggedCoords: null});
  }

  onClick(e) {

    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = this.map.queryRenderedFeatures(bbox, { layers: this.selectableLayers });

    if (features.length) {
      // We have a selected feature
      var feature = features[0];

      let key;
      if (this.props.mode === 'search') {
        this.props.resetStateKeys(['placeInfo']);
        key = 'searchLocation';
      } else if (!this.props.directionsFrom) {
        key = 'directionsFrom';
      } else {
        this.props.resetStateKeys(['route', 'searchLocation']);
        key = 'directionsTo';
      }


      /*Prepare data for detailInfo*/
      var paintColor = null;
      if ("paint" in feature.layer) {
        if(typeof(feature.layer.paint["circle-color"])!== "undefined")
          {paintColor = feature.layer.paint["circle-color"];}
          else if(typeof(feature.layer.paint["text-color"])!== "undefined"){
            paintColor = feature.layer.paint["text-color"];
          }
      }

      let place_name = null;
      if (feature.properties.name) { place_name = feature.properties.name }
      else if (feature.properties.label) { place_name = feature.properties.label; }
      else if (feature.properties.nom_du_musee) { place_name = feature.properties.nom_du_musee; }

      if (["parcsjardins", "localproductshop", "craftmanshop", "WineCelar", "OTFrance", "marches", "exposition", "musique", "children", "videsgreniers"].includes(feature.layer.id))
      {
        let lng = this.props.languageSet;
        if(lng === 'fr')
        {
          place_name = feature.properties.label_fr;

        }
        else{
          place_name = feature.properties.label_en;
        }
      }       

      let listVueActive = false;

      if (features.length > 1) {

        listVueActive = true;
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
          'type': 'Feature',
          'place_name': place_name,
          'properties': feature.properties,
          'geometry': feature.geometry,
          'layerId': feature.layer.id,
          "paintColor": paintColor,
          "popupActive": true,
          "listVueActive": listVueActive
        });
        this.props.triggerMapUpdate();
      }
    }
  }

  onLoad() {
    // helper to set geolocation
    const setGeolocation = (data) => {
      const geometry = { type: 'Point', coordinates: [data.coords.longitude, data.coords.latitude] };
      this.map.getSource('geolocation').setData(geometry);
      this.props.setUserLocation(geometry.coordinates);
      if (this.props.moveOnLoad) this.moveTo(geometry, 6);
    };

    // Create scale control
    if (window.innerWidth > 320) {
      const scaleControl = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      });
      this.map.addControl(scaleControl, 'bottom-left');

      this.map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
    }

    // Create geolocation control
    const geolocateControl = new mapboxgl.GeolocateControl();
    geolocateControl.on('geolocate', setGeolocation);
    this.map.addControl(geolocateControl, 'bottom-left');

    // Set event listeners
    this.map.on('click', (e) => this.onClick(e));

    this.map.on('mousemove', (e) => {
      var features = this.map.queryRenderedFeatures(e.point, { layers: this.selectableLayers });

      if (features.length) {
        this.map.getCanvas().style.cursor = 'pointer';
      } 
      else {
        this.map.getCanvas().style.cursor = '';
        this.setState({ isCursorOverPoint: false });
        this.map.dragPan.enable();
      }
    });

    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      this.props.setStateValue('mapCoords', [center.lng, center.lat, zoom]);
    });

    this.initLayerVisibility();

    // Final update if the original state has some data
    this.props.triggerMapUpdate();
  }

  initLayerVisibility(){
    const layerSelector = {
      Museum: /museesFrance/,
      Villages: /plusBeauxVillagesDeFrance/,
      Unesco: /patrimoinemondialenfrance/, // This is the Layer id
      Jardins: /jardinremarquable/,
      GSF: /grandSiteDeFrance/,
      MN: /monumentsnationaux/,
      ParcsJardins: /parcsjardins/,
      LocalProdShop: /localproductshop/,
      CraftmanShop: /craftmanshop/,
      WineCelar: /WineCelar/,
      OTFrance: /OTFrance/,
      Exposition: /exposition/,
      Musique: /musique/,
      Children: /children/,
      Marches: /marches/,
      VidesGreniers: /videsgreniers/
    };


    Object.keys(this.props.visibility).forEach(key => {
      if (this.props.visibility[key]) {
        this.map.setLayoutProperty(layerSelector[key].source, 'visibility', 'visible');
        // this.addLegendItem(layerSelector[key].source);
        if (["grandSiteDeFrance", "monumentsnationaux", "patrimoinemondialenfrance"].includes(layerSelector[key].source)) {
          this.loadJsonData(layerSelector[key].source);
        }
      } else {
        if( typeof (layerSelector[key]) === "undefined") return;
        let isVisible = this.map.getLayoutProperty(layerSelector[key].source, 'visibility');
        if (isVisible === 'visible') { 
          // set 'visibility' to 'none'
          this.map.setLayoutProperty(layerSelector[key].source, 'visibility', 'none');
          // this.removeLegendItem(layerSelector[key].source);
          // set Empty Data to sources
          if (["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance",
            "monumentsnationaux", "patrimoinemondialenfrance"].includes(layerSelector[key].source)) {
            this.setEmptyData(layerSelector[key].source);
          }
        }
      }
    });
  }

  toggleLayerVisibility(toggleLayerVisibility) {

    var visibility = this.map.getLayoutProperty(toggleLayerVisibility, 'visibility');
    if (visibility === 'visible') {
      this.map.setLayoutProperty(toggleLayerVisibility, 'visibility', 'none');
      this.removeLegendItem(toggleLayerVisibility);

    } else {
      this.map.setLayoutProperty(toggleLayerVisibility, 'visibility', 'visible');
      // this.addLegendItem(toggleLayerVisibility);
      if( ["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance", "monumentsnationaux", "patrimoinemondialenfrance"].includes(toggleLayerVisibility)){
        this.loadJsonData(toggleLayerVisibility);        
      }
    }
  }

  addLegendItem(idLayer) {

    let mapLayer = this.map.getLayer(idLayer);
    var legendItem = {};
    legendItem.idLayer = idLayer;

    let obj = this.props.listVueItems.find(x => x.idLayer === idLayer);
    if (typeof (obj) !== "undefined") {return;}

    if (mapLayer.type === "symbol") {
      legendItem.symbolColor = mapLayer.paint._values["text-color"].value.value;
    }
    if (mapLayer.type === "circle") {
      legendItem.symbolColor = mapLayer.paint._values["circle-color"].value.value;
    }

    let items = legendItem;
    if (typeof (this.props.listVueItems) !== "undefined") { items = this.props.listVueItems.concat([legendItem]); }

          /**Call setStateValue */
          
    this.props.setStateValue("listVueActive", true);
    this.props.setStateValue("listVueItems", items);

    this.props.setStateValue("popupActive", false);
    // this.props.triggerMapUpdate();

  }

  removeLegendItem(idLayer) {

    let obj = this.props.listVueItems.find(x => x.idLayer === idLayer);
    if (typeof (obj) === "undefined") {return;}
    var index = this.props.listVueItems.indexOf(obj);
    if (index !== -1) 
    {
      let items = this.props.listVueItems;
      items.splice(index, 1);
      this.props.setStateValue("listVueItems", items);
      this.props.triggerMapUpdate();
    }

    // var legend = document.getElementById('legend');
    // let itemId = "lgn" + idLayer;
    // var item = document.getElementById(itemId);
    // if (item !== null) {
    //   legend.removeChild(item);
    // }
  }

  setEmptyData(dataStr){
    this.map.getSource(dataStr).setData({
      "type": "FeatureCollection",
      "features": []
  });

  }
  
  loadJsonData(dataStr) {

    let baseDataUrl;
    if (process.env.NODE_ENV === 'production') {
      baseDataUrl = process.env.PUBLIC_URL + '/data/';
    } else { // Dev server runs on port 3000
      baseDataUrl = 'http://localhost:3000/data/';
    }


    let AllData = {
    };
    var lng = this.props.languageSet;

    if (["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance", "monumentsnationaux", "patrimoinemondialenfrance"].includes(dataStr) && lng === 'fr') {
      AllData = {
        patrimoinemondialenfrance: "Patrimoine_Mondial_en_France.geojson",
        monumentsnationaux: "Monuments_Nationaux.geojson",
        grandSiteDeFrance: "Grand_Site_de_France.geojson",
        jardinremarquable: "Jardin_Remarquable.geojson",
        plusBeauxVillagesDeFrance: "Plus_Beaux_Villages_de_France.geojson",
      }
    } else
      if (["plusBeauxVillagesDeFrance", "jardinremarquable", "grandSiteDeFrance", "monumentsnationaux", "patrimoinemondialenfrance"].includes(dataStr) && lng === 'en') {
        AllData = {
          patrimoinemondialenfrance: "Patrimoine_Mondial_en_France_en.geojson",
          monumentsnationaux: "Monuments_Nationaux_en.geojson",
          grandSiteDeFrance: "Grand_Site_de_France_en.geojson",
          jardinremarquable: "Jardin_Remarquable_en.geojson",
          plusBeauxVillagesDeFrance: "Plus_Beaux_Villages_de_France_en.geojson",
        }
      }

    const marchesData = baseDataUrl + AllData[dataStr];
    this.map.getSource(dataStr).setData(marchesData);
  }

  filterByDate(dateFrom, dateTo){

    if(dateTo)
    {  
      let filterTo = ['>=', dateTo, ['number', ['get', 'valid_from']]];
      let filterFrom = ["<=", dateFrom, ["number", ["get", "valid_from"]]];
      this.map.setFilter('musique', ['all', filterFrom, filterTo]);
      this.map.setFilter('exposition', ['all', filterFrom, filterTo]);
      this.map.setFilter('children', ['all', filterFrom, filterTo]);
      this.map.setFilter('videsgreniers', ['all', filterFrom, filterTo]);
      this.map.setFilter('marches', ['all', filterFrom, filterTo]);
    }
    else
    {
      this.map.setFilter("musique", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
      this.map.setFilter("exposition", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
      this.map.setFilter("children", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
      this.map.setFilter("videsgreniers", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
      this.map.setFilter("marches", ["<=", dateFrom, ["number", ["get", "valid_from"]]]);
    }
  }

  layerToKey(layer) {
    if (this.props.mode === 'search' && layer === 'marker') return 'searchLocation';
    else if (this.props.mode === 'directions' && layer === 'marker') return 'directionsTo';
    else if (this.props.mode === 'directions' && layer === 'fromMarker') return 'directionsFrom';
    else return '';
  }

  get emptyData() {
    return {
      type: 'FeatureCollection',
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
      "FranceWiki",
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
      "exposition",
      "musique",
      "children",
      "marches",
      "videsgreniers"
    ];
  }

}

MapComponent.propTypes = {
  accessToken: PropTypes.string,
  center: PropTypes.array,
  dateFrom: PropTypes.number,
  dateTo: PropTypes.number,
  directionsFrom: PropTypes.object,
  directionsTo: PropTypes.object,
  getReverseGeocode: PropTypes.func,
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
  needMapRestyle: PropTypes.bool,
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
    // legendItems: state.app.legendItems,
    listVueItems: state.app.listVueItems,
    listVueActive: state.app.listVueActive,
    modality: state.app.modality,
    mode: state.app.mode,
    needMapRepan: state.app.needMapRepan,
    needMapRestyle: state.app.needMapRestyle,
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
    getReverseGeocode: (key, coordinates, accessToken) => dispatch(getReverseGeocode(key, coordinates, accessToken)),
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
