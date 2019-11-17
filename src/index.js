import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { createBrowserHistory } from "history";
import { Route } from "react-router";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";


import apiCaller from "./middlewares/apiCaller";
import urlTinkerer from "./middlewares/urlTinkerer";
import rootReducer from "./reducers/index";
import { defaultState } from "./reducers/index";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import "./i18n";

import "./index.css";

function doTheRest(initialState, localStorage)
 {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  // Create history and router middleware
    const history = createBrowserHistory();
    const routerMid = routerMiddleware(history);

    let store = createStore(
    rootReducer(history),
    initialState,
    composeEnhancers(
      applyMiddleware(
       routerMiddleware(history), // for dispatching history actions
        apiCaller, urlTinkerer, routerMid))
  );

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

          localStorage.setItem("persistedState", JSON.stringify(persistedState));
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

        drawerWidth: 270,

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


// const persistedState = localStorage.getItem("persistedState") ? JSON.parse(localStorage.getItem("persistedState")) : {};
let initialState = defaultState;
if (typeof (persistedS) !== "undefined" && typeof (persistedS.app) !== "undefined") {
    import("lodash")
    .then((_) => {
        initialState = _.merge({}, defaultState, persistedS);
        doTheRest(initialState, localStorage);
    });
}
else{
    doTheRest(initialState, localStorage);
}

registerServiceWorker();
