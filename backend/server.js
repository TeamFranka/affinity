const express = require('express');
const { createServer } = require('http');
const { Parse, ParseServer } = require('./lib');
const app = express();
global.app = app;
global.Parse = Parse;

const config = {
  // Basics
  appName: "Affinity",
  appId: "APPLICATION_ID",
  masterKey: "MASTER_KEY",
  publicServerURL: "http://localhost:1337/parse",

  // Specific for Dev
  databaseURI: "mongodb://mongo/dev",
  cloud: "/parse-server/cloud/main.js",

  startLiveQueryServer: true,
  liveQuery: {
    classNames: [
      "Conversation",
      "Message",
      "Activity",
       "FaqEntry",
       "Picture",
       "Bookmark",
       "Document",
       "Poll",
       "Link",
       "Notification"
    ]
  },


  // E-Mail Stuff
  verifyUserEmails: true,
  emailVerifyTokenValidityDuration: 48 * 60 * 60,

  emailAdapter: {
    module: "simple-parse-smtp-adapter",
    options: {
        fromAddress: 'your@affinity.wtf',
        user: 'affinity@mailhog.example',
        password: 'whatever',
        host: 'mailhog',
        port: 1025
    }
  }
}
if (process.env.VUE_APP_PARSE_URL) config.publicServerURL = process.env.VUE_APP_PARSE_URL;
const api = new ParseServer(config);

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);

require("/parse-server/cloud/app.js");


const httpServer = createServer(app);
const parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);

httpServer.listen(1337, function() {
  console.warn('------- parse-server-example running on port 1337.');
});