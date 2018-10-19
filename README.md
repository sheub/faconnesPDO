# Marvelous Map

[An interactive map of France with local tourism infos](https://faconnes.de)


------

## Building a map 

### Why this project?


### Tech

The summary:
- [React](https://facebook.github.io/react/)
- [Redux](http://redux.js.org/)
- [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/)
- [Assembly.css](https://www.mapbox.com/assembly/)
- [Mapbox Geocoding API](https://www.mapbox.com/api-documentation/#geocoding)
- [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions)
- [Wikidata SDK](https://github.com/maxlath/wikidata-sdk)

The geocoding is delivered with https://adresse.data.gouv.fr/api

The directions are powered by the [Directions Traffic API](https://www.mapbox.com/api-documentation/#directions).

### Do it yourself!

Create a `.env` file at the root that contains the following variables:

```sh
REACT_APP_MAPBOX_TOKEN=<your access token>
PUBLIC_URL=https://<your base url>
```

### Icons and sprites

The style uses [sprites](https://www.mapbox.com/help/define-sprite/) for icons on the map. The spritesheet is generated automatically from the `styles/icons` directory with the module `@mapbox/spritezero-cli`. If you want to generate a new spritesheet from the icons stored in that directory, run the following commands:

```sh
$ npm run build-sprites
```

The spritesheet is generated automatically when building the project in whole (`npm run build` or `npm run deploy`).

