// vue.config.js
const path = require('path');

module.exports = {
  pwa: {
    name: 'FotoMapa',
    themeColor: '#2c3e50',
    backgroundColor: '#ffffff',
    display: 'standalone',
    start_url: '.',
    scope: '.',

    manifestOptions: { /* … */ },

    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // Opción A ─ relativa
      swSrc: './src/service-worker.js',

      // Opción B ─ absoluta (equivalente)
      // swSrc: path.resolve(__dirname, 'src/service-worker.js'),
    },
  },
};
