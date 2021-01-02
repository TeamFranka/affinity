/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Objects = require("./consts.js").Objects;
const genericObjectsPreSave = require("./common.js").genericObjectsPreSave;


// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
for (let index = 0; index < Objects.length; index++) {
    Parse.Cloud.beforeSave(Objects[index], genericObjectsPreSave, {
        requireUser: true
    });
}