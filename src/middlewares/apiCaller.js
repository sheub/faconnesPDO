import wdk from "wikidata-sdk/dist/wikidata-sdk.js";

const apiCaller = (store) => (next) => (action) => { // eslint-disable-line

    switch (action.type) {
  // ---------------------------------------------------------------------------
    case "GET_PLACE_INFO": {
        const url = wdk.getEntities({
            ids: action.id,
            languages: ["en"],
        });

        fetch(url, {method: "get"})
      .then(res => {
          if (res.ok) {
              return res.json();
          } else { // 4xx or 5xx response
              var err = new Error(res.statusText);
              return Promise.reject(err);
          }
      })
      .then(data => {
        // Success
          const entity = data.entities[action.id];
          const simplifiedClaims = wdk.simplifyClaims(entity.claims);
          const description = entity.descriptions.en.value;
          const label = entity.labels.en.value;
          next({
              type: "SET_STATE_VALUE",
              key: "placeInfo",
              value: {
                  claims: simplifiedClaims,
                  description,
                  label
              }
          });
      })
      .catch(() => {});
        break;
    }

    default:
        next(action); // let through as default
        break;
    }

    return;
};

export default apiCaller;
