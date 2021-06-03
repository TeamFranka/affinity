// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const ROOT = path.resolve(__dirname);

const PAGE_DEFAULTS = {
  entry: "src/main.ts",
  favicon: path.join(ROOT,"public/assets/favicon.png"),
  template: "src/templates/app.html",
  filename: "index.html",
};
const APP_SETTING_DEFAULTS = {
  AFFINITY_DEFAULT_TEAM: process.env.VUE_APP_DEFAULT_TEAM,
  AFFINITY_EXTRA_TEAMS: process.env.VUE_APP_EXTRA_TEAMS || "",
  PARSE_APP_ID: process.env.VUE_APP_PARSE_APP_ID || "",
  PARSE_JS_KEY: process.env.VUE_APP_PARSE_JS_KEY,
  PARSE_URL: process.env.VUE_APP_PARSE_URL || "http://localhost:1337/parse",
  PARSE_LIVE_URL: process.env.VUE_APP_PARSE_LIVE_URL,
  ANDROID_INSTALL_URL: "https://install.appcenter.ms/orgs/teamfranka/apps/affinity-live/distribution_groups/public%20beta",
  IOS_INSTALL_URL: "https://install.appcenter.ms/orgs/teamfranka/apps/affinity-live-ios/distribution_groups/public%20beta",
}


module.exports = {
  pages: {
    app: Object.assign({}, PAGE_DEFAULTS, {
      templateParameters: {
        title: "Affinity",
        settings: Object.assign({}, APP_SETTING_DEFAULTS, {
        })
      }
    }),
    "affinity": Object.assign({}, PAGE_DEFAULTS, {
      filename: "community.affinity.wtf.html",
      templateParameters: {
        title: "Affinity Community Organising",
        settings: Object.assign({}, APP_SETTING_DEFAULTS, {
          AFFINITY_DEFAULT_TEAM: "adbcdef",
          PARSE_URL: "https://community.affinity.wtf/parse",
          PARSE_LIVE_URL: "wss://community.affinity.wtf/parse",
        })
      }
    }),
    "wir-md": Object.assign({}, PAGE_DEFAULTS, {
      filename: "app.wir.md.html",
      favicon: path.join(ROOT,"public/assets/favicon-wir-md.png"),
      templateParameters: {
        title: "Wir.md",
        settings: Object.assign({}, APP_SETTING_DEFAULTS, {
          AFFINITY_DEFAULT_TEAM: "jZ4ZFLEnzO",
          AFFINITY_EXTRA_TEAMS: "US2YJKbs7U",
          PARSE_URL: "https://app.wir.md/parse",
          PARSE_LIVE_URL: "wss://app.wir.md/parse",
          ANDROID_INSTALL_URL: "https://play.google.com/store/apps/details?id=md.wir.app&hl=de_DES&gl=de",
          IOS_INSTALL_URL: "https://apps.apple.com/us/app/wir-md-by-teamfranka/id1567204902"
        })
      }
    }),
    widget: {
      entry: "src/chat-widget.js",
      template: "src/templates/chat-widget.html",
      filename: "chat-example.html",
      templateParameters: {
        settings: Object.assign({}, APP_SETTING_DEFAULTS)
      }
    },
  },
  configureWebpack: {
    output: {
      filename: (chunkData) => {
        return chunkData.noChunkHash || chunkData.chunk.name === "widget"
          ? "[name].js"
          : "[name].[chunkhash:8].js";
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },

  devServer: {
    disableHostCheck: true,
    proxy: {
      "/parse/": {
        target: "http://localhost:1337/",
        ws: true,
        changeOrigin: true
      }
    },
  },
};
