
const defaultAppState = {
  // Mapbox Access Token
  // mapboxAccessToken: process.env.REACT_APP_MAPBOX_TOKEN,
  // drawer
  drawerOpen: false,

  // Map
  mapCoords: [2.4, 46.8, 5],
  // Map updates
  needMapUpdate: false,
  needMapRepan: false,
  needMapToggleLayer: false,
  needMapActualizeLanguage: false,
  mapScreenshot: "",

  // Mode
  mode: "search",
  // Search
  searchString: "",
  searchLocation: null,
  placeInfo: null,
  // User
  userLocation: null,
  userFavoritePlaces: [],

  // Information
  toggleLayerVisibility: "",
  visibility: {
    Museum: false,
    Villages: false,
    Unesco: false,
    Jardins: false,
    GSF: false,
    MN: false,
    villeEtPaysArtHistoire:false,
    ParcsJardins: false,
    AiresJeux: false,
    LocalProdShop: false,
    CraftmanShop: false,
    WineCelar: false,
    OTFrance: false,
    Exposition: false,
    Musique: false,
    Children: false,
    Marches: false,
    Toilets: false,
    Baignades: false,
    VidesGreniers: true,
  },
  dateFrom: 0,
  dateTo: 0,
  languageSet: "en",
  legendItems: [],
  listVueItems: [],
  popupActive: false,
  infoPopup: null,
  listVueActive: false,
  coorOnClick: [],
};

const appReducer = (state = defaultAppState, action) => {
  switch (action.type) {
  case "SET_STATE_VALUE": {
    const modifiedState = {};
    modifiedState[action.key] = action.value;
    return Object.assign({}, state, modifiedState);
  }

  case "SET_STATE_VALUES": {
    return Object.assign({}, state, action.modifiedState);
  }

  case "RESET_STATE_KEYS": {
    const modifiedState = {};
    action.keys.forEach((k) => {
      modifiedState[k] = defaultAppState[k];
    });
    return Object.assign({}, state, modifiedState);
  }

  case "TRIGGER_MAP_UPDATE": {
    return Object.assign({}, state, {
      needMapUpdate: true,
      needMapRepan: action.needMapRepan,
    });
  }

  case "SET_USER_LOCATION": {
    return Object.assign({}, state, {
      userLocation: {
        place_name: "My Location",
        center: action.coordinates,
        geometry: {
          type: "Point",
          coordinates: action.coordinates,
        },
      },
    });
  }

  case "SET_STATE_FROM_URL": {
    return state;
  }
  default:
    return state;
  }
};

export default appReducer;
export { appReducer, defaultAppState };
