require("./ts-cli-setup.js");

const Parse = require('parse/node');

console.warn("Targeting", process.env.VUE_APP_PARSE_URL);

Parse.initialize(
    process.env.VUE_APP_PARSE_APP_ID,
    process.env.VUE_APP_PARSE_JS_KEY,
    process.env.VUE_APP_PARSE_MASTER_KEY
);
Parse.serverURL = process.env.VUE_APP_PARSE_URL;

var All = require('../src/db/schemas').All;
var buildSchemas = require('../src/db/buildSchema').buildSchemas;

buildSchemas(All)
    .then(() => console.log("---- Done!"))
    .catch(console.error);