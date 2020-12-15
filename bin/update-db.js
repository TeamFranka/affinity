require("./ts-cli-setup.js");

const Parse = require('parse/node');

Parse.initialize(
    process.env.PARSE_APP_ID,
    process.env.PARSE_JS_KEY,
    process.env.PARSE_MASTER_KEY
);
Parse.serverURL = process.env.PARSE_URL || 'https://parseapi.back4app.com/';

var All = require('../src/db/models').All;
var buildSchemas = require('../src/db/buildSchema').buildSchemas;

buildSchemas(All)
    .then(() => console.log("---- Done!"))
    .catch(console.error);