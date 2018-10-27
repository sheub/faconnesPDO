module.exports = {
	runtimeCaching: [
		{
			urlPattern: /^https:\/\/maps\.tilehosting\.com\/.*/,
			handler: 'cacheFirst',
			options: {
				cache: {
					name: 'mapTiles',
					// Only cache requests for a week
					maxAgeSeconds: 7 * 24 * 60 * 60,
				},
			},
		},
		{
			urlPattern: /^https:\/\/faconnes\.de\/tiles\/*/,
			handler: 'cacheFirst',
			options: {
				cache: {
					name: 'mapEvents',
					// Only cache requests for one day
					maxAgeSeconds: 24 * 60 * 60,
				},
			},
		},
		{
			urlPattern: /^https:\/\/api\.mapbox\.com\/.*/,
			handler: 'cacheFirst',
		}
	],
};