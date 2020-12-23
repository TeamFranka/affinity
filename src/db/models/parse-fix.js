/* global Parse */
/* eslint-disable @typescript-eslint/no-var-requires */

try {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    module.exports = require("parse");
} catch {
    module.exports = Parse;
    // We use the same system for backend, parse-sever with Parse as global,
    // and our frontend with node-js-style typescript. To be able to reuse
    // the same code we have to import when we can and ignore and assume it
    // to be global (backend) otherwise.
}
