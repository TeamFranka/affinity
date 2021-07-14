// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const ROOT = path.resolve(__dirname)
const appConfigs = require('./backend/cloud/config.js');

const PAGE_DEFAULTS = {
  entry: 'src/main.ts',
  favicon: path.join(ROOT, 'public/assets/favicon.png'),
  template: 'src/templates/app.html',
  filename: 'index.html',
}
const APP_SETTING_DEFAULTS = {
  AFFINITY_DEFAULT_TEAM: process.env.VUE_APP_DEFAULT_TEAM,
  AFFINITY_EXTRA_TEAMS: process.env.VUE_APP_EXTRA_TEAMS || '',
  PARSE_APP_ID: process.env.VUE_APP_PARSE_APP_ID || '',
  PARSE_JS_KEY: process.env.VUE_APP_PARSE_JS_KEY,
  PARSE_URL: process.env.VUE_APP_PARSE_URL || 'http://localhost:1337/parse',
  PARSE_LIVE_URL: process.env.VUE_APP_PARSE_LIVE_URL,
}

const AffinityDefault = appConfigs["community.affinity.wtf"];
const WirMD = appConfigs["app.wir.md"];

module.exports = {
  pages: {
    app: Object.assign({}, PAGE_DEFAULTS, {
      templateParameters: {
        title: 'Affinity',
        settings: Object.assign({}, APP_SETTING_DEFAULTS, {}),
      },
    }),
    'community.affinity.wtf': Object.assign({}, PAGE_DEFAULTS, {
      filename: AffinityDefault.filename,
      templateParameters: {
        title: AffinityDefault.title,
        settings: Object.assign({}, APP_SETTING_DEFAULTS, {
          AFFINITY_DEFAULT_TEAM: AffinityDefault.DEFAULT_TEAM,
          PARSE_URL: AffinityDefault.PARSE_URL,
          PARSE_LIVE_URL: AffinityDefault.PARSE_LIVE_URL,
        }),
      },
    }),
    'app.wir.md': Object.assign({}, PAGE_DEFAULTS, {
      filename: WirMD.filename,
      favicon: path.join(ROOT, 'public/assets/favicon-wir-md.png'),
      templateParameters: {
        title: WirMD.title,
        settings: Object.assign({}, APP_SETTING_DEFAULTS, {
          AFFINITY_DEFAULT_TEAM: WirMD.DEFAULT_TEAM,
          AFFINITY_EXTRA_TEAMS: WirMD.EXTRA_TEAMS,
          PARSE_URL: WirMD.PARSE_URL,
          PARSE_LIVE_URL: WirMD.PARSE_LIVE_URL,
          ANDROID_INSTALL_URL: WirMD.ANDROID_INSTALL_URL,
          IOS_INSTALL_URL: WirMD.IOS_INSTALL_URL,
        }),
      },
    }),
    widget: {
      entry: 'src/chat-widget.js',
      template: 'src/templates/chat-widget.html',
      filename: 'chat-example.html',
      templateParameters: {
        settings: Object.assign({}, APP_SETTING_DEFAULTS),
      },
    },
  },
  configureWebpack: {
    output: {
      filename: (chunkData) => {
        return chunkData.noChunkHash || chunkData.chunk.name === 'widget'
          ? '[name].js'
          : '[name].[chunkhash:8].js'
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },

  devServer: {
    disableHostCheck: true,
    proxy: {
      '/parse/': {
        target: 'http://localhost:1337/',
        ws: true,
        changeOrigin: true,
      },
    },
  },
}

