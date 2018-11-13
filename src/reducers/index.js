import {appReducer, defaultAppState} from './appReducer';
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'


const rootReducer = (history) => combineReducers({
  app: appReducer,
  router: connectRouter(history)
})


const defaultState = {
  app: defaultAppState
};

export default rootReducer

export {defaultState};

