/* global Parse */

require("./user.js");
require("./teams.js");
require("./conversations.js");
require("./objects.js");
require("./interactions.js");

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", (request) => {
	return "Hello world!";
});
