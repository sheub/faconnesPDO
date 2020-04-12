import { combineReducers } from "redux";
import appReducer, { defaultAppState } from "./appReducer";
import authReducer, { defaultAuthState } from "./authReducer";
import { connectRouter } from "connected-react-router";

const rootReducer = (history) =>
  combineReducers({
    app: appReducer,
    auth: authReducer,
    router: connectRouter(history),
  });

const defaultState = {
  app: defaultAppState,
  auth: defaultAuthState,
};

export default rootReducer;

export { defaultState };
