/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Objects = require("./consts.js").Objects;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ogs = require("open-graph-scraper");

const genericObjectsPreSave = require("./common.js").genericObjectsPreSave;

for (let index = 0; index < Objects.length; index++) {
  Parse.Cloud.beforeSave(Objects[index], genericObjectsPreSave, {
    requireUser: true
  });
}

Parse.Cloud.define("fetchLinkMetadata", async (request) => {
  const { error, result, response } = await ogs({url: request.params.url});
  //console.log(error, result, response);
  if  (error) {
    throw result
  }
  // FIXME: also extract favicon...
  return result
},{
  requireUser: true,
  fields: {
    url: {
      type: String,
      required: true,
    }
  }
}
)