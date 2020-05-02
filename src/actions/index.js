export const setStateValue = (key, value) => ({
  type: "SET_STATE_VALUE",
  key,
  value,
});

export const setStateValues = modifiedState => ({
  type: "SET_STATE_VALUES",
  modifiedState,
});

export const resetStateKeys = keys => ({
  type: "RESET_STATE_KEYS",
  keys,
});

export const triggerMapUpdate = needMapRepan => ({
  type: "TRIGGER_MAP_UPDATE",
  needMapRepan: !!needMapRepan || false,
});

export const setUserLocation = coordinates => ({
  type: "SET_USER_LOCATION",
  coordinates,
});

export const setDirectionsLocation = (kind, location) => ({
  type: "SET_DIRECTIONS_LOCATION",
  kind,
  location,
});

export const getPlaceInfo = wikidataId => ({
  type: "GET_PLACE_INFO",
  id: wikidataId,
});

export const setStateFromURL = () => ({
  type: "SET_STATE_FROM_URL",
});
