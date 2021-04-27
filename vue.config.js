const PAGE_DEFAULTS = {
  entry: "src/main.ts",
  favicon: "public/assets/icon/favicon.png",
  template: "src/templates/app.html",
  filename: "index.html",
};



module.exports = {
  pages: {
    app: Object.assign({}, PAGE_DEFAULTS, {
      templateParameters: {
        title: "Affinity",
        "AFFINITY_DEFAULT_TEAM": process.env.VUE_APP_DEFAULT_TEAM
      }
    }),
    "wir-md": Object.assign({}, PAGE_DEFAULTS, {
      filename: "wir.md.html",
      templateParameters: {
        title: "Wir.md",
        "AFFINITY_DEFAULT_TEAM": "adbcdef",
      }
    }),
    widget: {
      entry: "src/chat-widget.js",
      template: "src/templates/chat-widget.html",
      filename: "chat-example.html",
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
