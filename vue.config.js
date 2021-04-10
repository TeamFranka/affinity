module.exports = {
  pages: {
    app: {
      entry: "src/main.ts",
      template: "src/templates/app.html",
      filename: "index.html",
    },
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
