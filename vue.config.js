module.exports = {
    pages: {
        app: "src/main.ts",
        widget: {
            entry: "src/chat-widget.js",
            filename: "widget.html",
        }
    },
    configureWebpack: {
        output: {
            filename: (chunkData) => {
                return chunkData.chunk.name === 'widget'
                    ? '[name].js'
                    : '[name].[chunkhash:8].js';
            }
        }
    }
}