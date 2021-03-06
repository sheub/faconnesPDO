const defaultAppState = {
  // drawer
  drawerOpen: false,

  // Map
  mapCoords: [2.4, 46.8, 5],
  // Map updates
  needMapUpdate: false,
  needMapRepan: false,
  needMapToggleLayer: false,
  needMapFilterCategories: false,
  needMapActualizeLanguage: false,
  mapScreenshot: "",

  // Mode
  mode: "localAutocomplete",
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
    // PDO: true,
    filtered_siqo_IGP: false,
    filtered_siqo_AOP: true,
    filtered_siqo_IG: false,
  },

  categoriesVisibility: {
    Classe_UE_1: true,
    Classe_UE_2: true,
    Classe_UE_3: true,
    Classe_UE_4: true,
    // Classe_UE_5: true,
    // Classe_UE_6: true,
    // Classe_UE_7: true,
    // Classe_UE_8: true,
    // Classe_UE_9: true,
    // Classe_UE_10: true,
    // Classe_UE_11: true,
    // Classe_UE_12: true,
    Classe_UE_13: true,
    Classe_UE_14: true,
    Classe_UE_15: true,
    Classe_UE_16: true,
  },

  checkedCategoriesArray: [],

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
