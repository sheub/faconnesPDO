const workboxBuild = require("workbox-build");
const baseUrl = process.env.PUBLIC_URL;
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
      navigationPreload:true,
      globPatterns: [
        "./**/**.html",
        "./static/js/*.js",
        "./static/css/*.css",
        "./static/media/**",
        "./locales/en/*.json",
        "./locales/fr/*.json",
        "./ico/*.png",
      ],
      globStrict: true,
      // navigateFallbackDenylist: [
      //   new RegExp(`^https://faconnes\.de/current`)
      //   // "^https://faconnes\.de/current(?:/.*)?$"
      // ],
      // navigateFallback:"./index.html",
      sourcemap:true,
      //   stripPrefix: "./build",
      //   globPatterns: ["**/*.{jpg}"] // precaching jpg files
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    })
    .catch(console.error);
};
buildSW();