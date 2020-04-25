import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";

import { createBrowserHistory } from "history";
import { Route } from "react-router";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";

// import {merge, get, set } from "lodash";

import apiCaller from "./middlewares/apiCaller";
import urlTinkerer from "./middlewares/urlTinkerer";
import rootReducer from "./reducers/index";
import { defaultState } from "./reducers/index";
import { defaultAuthState } from "./reducers/authReducer";

import { getToken, setToken } from "./helpers/auth";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
// import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import "./i18n";

import "./index.css";
import axios from "axios";
import * as serviceWorker from "./serviceWorker";
// import { LocalDrinkSharp } from "@material-ui/icons";

function doTheRest(initialState, initialAuthState, localStorage)
{
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  // Create history and router middleware
  const history = createBrowserHistory();
  const routerMid = routerMiddleware(history);

  // combine App and Auth Reducers to create store
  // let reducers = combineReducers({
  //   app: defaultState,
  //   auth: defaultAuthState,
  // });
  // let combinedState = merge({}, initialState, initialAuthState);

  let combinedState = {
    app: initialState.app,
    auth: initialState.auth
  };


  // create store
  let store = createStore(
    rootReducer(history),
    combinedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        apiCaller, urlTinkerer, routerMid))
  );

  // console.log(store.getState());

  // Store subscription that will keep the persisted state in local storage in sync with the state.
  store.subscribe(() => {
    const state = store.getState();
    const keys = ["app.userLocation", "app.mapCoords", "app.visibility", "app.userFavoritePlaces"];
    const persistedState = {};
        import("lodash")
          .then((_) => {
            keys.forEach((key) => {

              var val = _.get(state, key);
              if (val) _.set(persistedState, key, val);
            });

            // store
            localStorage.setItem("persistedState", JSON.stringify(persistedState));

            // if user authenticate
            if (state.auth.authenticated) {
            // api call to store localStorage into dB
              var url = process.env.REACT_APP_API_ENTRYPOINT + "/api/auth/localStorageSubmit";
              const params = {
                localStorage: JSON.stringify(persistedState), // data,
              };

              if (process.env.NODE_ENV === "production") {
                url = "/current/public/api/auth/localStorageSubmit";
              } else {
                url = process.env.REACT_APP_API_ENTRYPOINT + "/api/auth/localStorageSubmit";
              }
              // var token = getToken(); // get token
              getToken()
                .then(function(token)
                {
                  try {
                    const data = axios({
                      method: "post",
                      url: url,
                      params: params,
                      headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                        Authorization: `Bearer ${token}`
                      },
                    });
                    return Promise.resolve(data);
                  } catch (error) {
                    console.log(error); //<--- Go down one more stream
                    return Promise.reject(error);
                  }
                });
            };
          });
  });

  const theme = createMuiTheme({

    palette:
        {
          primary: {
            main: "#14222D",
          },
          secondary: {
            main: "#9CB2C0",
          }
        },

    typography: {
      useNextVariants: true,
      //   fontFamily: ["Open Sans", "sans-serif",
      // ].join(","),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    // font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  });

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <Route path="/" component={App} />
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
  );
}


// Read persisted state from the local storage and put that in the initial state.
var persistedS = localStorage.getItem("persistedState") ? JSON.parse(localStorage.getItem("persistedState")) : {};
const languageSet = localStorage.getItem("i18nextLng") ? localStorage.getItem("i18nextLng") : "en";
if (typeof (persistedS) !== "undefined" && typeof (persistedS.app) !== "undefined")
  persistedS.app.languageSet = languageSet;

// check if url has token, and user information (redirect from Social Login)
const urlpath = window.location.search;
const urlParams = new URLSearchParams(urlpath);

const userName = urlParams.get("userName");
const userEmail = urlParams.get("userEmail");
const token = urlParams.get("token");
// console.log(urlParams.toString());



// initial state
let initialState = defaultState;
let initialAuthState = defaultAuthState;

// if user authenticated (redirect from Social Login)
if (token && userEmail) {
  const userData = {token: token, name: userName, email: userEmail};

  initialAuthState.authenticated = true;
  initialAuthState.user = userData.name;
  setToken(token);
}

if (typeof (persistedS) !== "undefined" && typeof (persistedS.app) !== "undefined") {
    import("lodash")
      .then((_) => {
        initialState = _.merge({}, initialState, persistedS);
        doTheRest(initialState, initialAuthState, localStorage);
      });
}
else{
  doTheRest(initialState, initialAuthState, localStorage);
}

// registerServiceWorker();
serviceWorker.register();
