const express = require('express');
const { createServer } = require('http');
const { Parse, ParseServer } = require('./lib');
const app = express();
global.app = app;
global.Parse = Parse;

const api = new ParseServer({
    "liveQuery": {
        "classNames": ["Conversation", "Message", "Activity"]
    },
    "appId": "APPLICATION_ID",
    "masterKey": "MASTER_KEY",
    "databaseURI": "mongodb://mongo/dev",
    "cloud": "/parse-server/cloud/main.js",
    "startLiveQueryServer": true
});

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);


require("/parse-server/cloud/app.js");


const httpServer = createServer(app);
const parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);

httpServer.listen(1337, function() {
  console.warn('------- parse-server-example running on port 1337.');
});