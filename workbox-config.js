module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{json,woff2,css,js,html,svg,ttf,woff,txt,png,jpg,ico}'],
  swDest: 'build/sw.js',
  // ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swSrc: 'src/sw-template.js',
};
