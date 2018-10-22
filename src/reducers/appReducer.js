import polyline from '@mapbox/polyline';

const defaultAppState = {
  // Mapbox Access Token
  mapboxAccessToken: process.env.REACT_APP_MAPBOX_TOKEN,
  // Map
  mapCoords: [-122.4, 37.8, 10],
  mapStyle: 'streets',
  // Map updates
  needMapUpdate: false,
  needMapRepan: false,
  needMapRestyle: false,
  needMapToggleLayer: false,
  needMapActualizeLanguage: false,

  // Mode
  mode: 'search',
  modality: 'car',
  // Search
  searchString: '',
  searchLocation: null,
  placeInfo: null,
  // User
  userLocation: null,
  // Directions
  directionsFromString: '',
  directionsFrom: null,
  directionsToString: '',
  directionsTo: null,
  route: null,
  routeStatus: 'idle',
  lastQueried: 0,
  toggleLayerVisibility: '',
  visibility: {
    Museum: false,
    Villages: false,
    Unesco: true,
    Jardins: false,
    GSF: false,
    MN: false,
    ParcsJardins: false,
    LocalProdShop: false,
    CraftmanShop: false,
    WineCelar: false,
    OTFrance: false,
    Exposition: false,
    Musique: false,
    Children: false,
    Marches: false,
    VidesGreniers: false
  },
  dateFrom:0,
  dateTo:0,
  languageSet:'en',
  legendItems:[],
  popupActive: false
};

const appReducer = (state = defaultAppState, action) => {
  switch (action.type) {

  case 'SET_STATE_VALUE': {
    const modifiedState = {};
    modifiedState[action.key] = action.value;
    return Object.assign({}, state, modifiedState);
  }

  case 'SET_STATE_VALUES': {
    return Object.assign({}, state, action.modifiedState);
  }

  case 'RESET_STATE_KEYS': {
    const modifiedState = {};
    action.keys.forEach(k => {
      modifiedState[k] = defaultAppState[k];
    });
    return Object.assign({}, state, modifiedState);
  }

  case 'TRIGGER_MAP_UPDATE':
    return Object.assign({}, state, {
      needMapUpdate: true,
      needMapRepan: action.needMapRepan
    });

  case 'SET_USER_LOCATION':
    return Object.assign({}, state, {
      userLocation: {
        'place_name': 'My Location',
        center: action.coordinates,
        geometry: {
          type: 'Point',
          coordinates: action.coordinates
        }
      },
    });

  case 'SET_DIRECTIONS_LOCATION': {
    if (action.kind === 'from') {
      return Object.assign({}, state, {
        directionsFrom: action.location
      });
    } else if (action.kind === 'to') {
      return Object.assign({}, state, {
        directionsTo: action.location
      });
    } else return state;
  }

  case 'SET_ROUTE': {
    if (action.data.routes.length > 0 && state.directionsFrom && state.directionsTo) {
      const route = action.data.routes[0];

      let congestion;
      if (route.legs[0] && route.legs[0].annotation && route.legs[0].annotation.congestion) {
        congestion = route.legs[0].annotation.congestion;
      }

      const line = polyline.toGeoJSON(route.geometry);

      if (!congestion) {
        route.geometry = line;
      } else {
        route.geometry = congestionSegments(line, congestion);
      }

      return Object.assign({}, state, {
        route: route
      });
    } else {
      return Object.assign({}, state, {
        routeStatus: 'error'
      });
    }
  }

  case 'SET_STATE_FROM_URL': {
    return state;
  }

  default:
    return state;
  }
};

function congestionSegments(line, congestionArray) {
  let featureCollection = {
    type: 'FeatureCollection',
    features: []
  };
  const coordinates = line.coordinates;
  let prevCongestion = congestionArray[0];
  let currentCoordinates = [];
  for (var i = 0; i < coordinates.length - 1; i++) {
    currentCoordinates.push(coordinates[i]);

    if (i === coordinates.length - 1 || congestionArray[i + 1] !== prevCongestion) {
      currentCoordinates.push(coordinates[i + 1]);
      let segment = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: currentCoordinates.slice()
        },
        properties: {
          congestion: prevCongestion
        }
      };
      featureCollection.features.push(segment);
      currentCoordinates = [];
    }

    prevCongestion = congestionArray[i];

  }
  return featureCollection;
}

export default appReducer;
export {appReducer, defaultAppState};
