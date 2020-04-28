import i18n from "i18next";
import Backend from "i18next-xhr-backend";
// import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

let baseDataUrl;
if (process.env.NODE_ENV === "production") {
    baseDataUrl = process.env.REACT_APP_HOME;//"https://faconnes.de/";//process.env.PUBLIC_URL;
} else { // Dev server runs on port 3000
    baseDataUrl = "http://localhost:3000/";
}
// Read persisted state from the local storage and put that in the initial state.
var persistedS = localStorage.getItem("persistedState") ? JSON.parse(localStorage.getItem("persistedState")) : {};
var languageSet = localStorage.getItem("i18nextLng") ? localStorage.getItem("i18nextLng") : "en";
if (!(typeof (persistedS) !== "undefined" && typeof (persistedS.app) !== "undefined"))
{
  languageSet = "en"
}
i18n
  .use(Backend)
//   .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
      fallbackLng: "en",
      lng: languageSet,

    // have a common namespace used around the full app
      ns: ["translations"],
      defaultNS: "translations",

      debug: false,

      interpolation: {
          escapeValue: false // react already safes from xss
      },

      backend: {
          loadPath: baseDataUrl + "locales/{{lng}}/{{ns}}.json"
      },

      react: {
          wait: true,
          bindI18n: "languageChanged loaded",
          bindStore: "added removed",
          nsMode: "default"
      }
  });

// load additional namespaces after initialization
i18n.loadNamespaces("about");
i18n.loadNamespaces("legal");


export default i18n;