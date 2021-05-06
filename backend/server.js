const express = require('express');
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

app.listen(1337, function() {
  console.log('------- parse-server-example running on port 1337.');
});