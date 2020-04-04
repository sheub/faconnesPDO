const workboxBuild = require("workbox-build");
// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  workboxBuild
    .generateSW({
      //   swSrc: "src/sw-template.js", // this is your sw template file
      swDest: "build/service-worker.js", // this will be created in the build step
      globDirectory: "build",
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/maps\.tilehosting\.com\/.*/,
          handler: "CacheFirst",
          options: {
            cacheName: "mapTiles",
            expiration: {
                // Only cache requests for a month
                maxAgeSeconds: 7 * 24 * 60 * 60 * 4
            },
          },
        },
        {
          urlPattern: /^https:\/\/faconnes\.de\/tiles\/*/,
          // 'fastest' is now 'StaleWhileRevalidate'
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "mapEvents",
            expiration: {
            //   maxEntries: 5,
              maxAgeSeconds: 24 * 60 * 60,
            },
          },
        },
        {
          urlPattern: /^https:\/\/api\.mapbox\.com\/.*/,
          handler: "CacheFirst",
        },
      ],
      navigationPreload:false,
      globPatterns: [
        "./**/**.html",
        "./static/js/*.js",
        "./static/css/*.css",
        "./static/media/**",
        "./locales/en-US/*.json",
        "./locales/fr/*.json",
        "./ico/*.png",
      ],
      globStrict: true,
      // navigateFallback:"./index.html",
      // navigateFallbackDenylist: [
      //   RegExp(`^https://faconnes.de/current/public/api/`)
      //   // RegExp('^https://example.com/')
      //   // "^https://faconnes\.de/current(?:/.*)?$"
      // ],
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    })
    .catch(console.error);
};
buildSW();