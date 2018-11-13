# Marvelous Map


[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c742a7145e954de0bbe4869e5428e5d8)](https://app.codacy.com/app/sheub/marvelous-map?utm_source=github.com&utm_medium=referral&utm_content=sheub/marvelous-map&utm_campaign=Badge_Grade_Dashboard) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/sheub/marvelous-map/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/sheub/marvelous-map/?branch=master) [![Build Status](https://scrutinizer-ci.com/g/sheub/marvelous-map/badges/build.png?b=master)](https://scrutinizer-ci.com/g/sheub/marvelous-map/build-status/master)

[An interactive map of France with local tourism infos](https://faconnes.de)


------

## Map rendering 

![Marvelous](https://github.com/sheub/marvelous-map/blob/master/marvelous_map.png)


### Tech

The summary:
- [React](https://facebook.github.io/react/)
- [Redux](http://redux.js.org/)
- [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/)
- [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions)
- [Wikidata SDK](https://github.com/maxlath/wikidata-sdk)

The geocoding is delivered with https://adresse.data.gouv.fr/api

The direction and elevation are powered by the [Directions Traffic API](https://www.mapbox.com/api-documentation/#directions).


### Icons and sprites

The style uses [sprites](https://www.mapbox.com/help/define-sprite/) for icons on the map. The spritesheet is generated automatically from the `styles/icons` directory with the module `@mapbox/spritezero-cli`. If you want to generate a new spritesheet from the icons stored in that directory, run the following commands:

```sh
$ npm run build-sprites
```

The spritesheet is generated automatically when building the project in whole (`npm run build` or `npm run deploy`).

