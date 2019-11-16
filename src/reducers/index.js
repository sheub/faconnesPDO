import { combineReducers } from "redux";
import { appReducer, defaultAppState } from "./appReducer";
import authReducer from "./auth";
import { connectRouter } from "connected-react-router";

const rootReducer = history =>
  combineReducers({
    app: appReducer,
    auth: authReducer,
    router: connectRouter(history)
  });

const defaultState = {
  app: defaultAppState
};

export default rootReducer;

export { defaultState };
