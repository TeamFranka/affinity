/* global Parse */
// eslint-disable @typescript-eslint/no-var-requires

const Objects = require("./consts.js").Objects;
const path = require('path');
const fetch = require('node-fetch');

const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-video')(),
  require('metascraper-soundcloud')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
]);

const genericObjectsPreSave = require("./common.js").genericObjectsPreSave;

for (let index = 0; index < Objects.length; index++) {
  Parse.Cloud.beforeSave(Objects[index], genericObjectsPreSave, {
    requireUser: true
  });
}



Parse.Cloud.define("fetchLinkMetadata", async (request) => {
  const stripped = request.params.url.trim();

  const response = await fetch(stripped, {
    // FIX for twitter:
    // https://github.com/microlinkhq/metascraper/issues/260#issuecomment-581141258
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
      'X-Requested-With': 'XMLHttpRequest',
    }
  });
  const html = await response.text();
  const result = await metascraper({ html, url: stripped });

  console.log("results", result);

  const imgPath = result.image;

  if (imgPath) {
    const filename = path.basename(((new URL(imgPath))||{}).pathname || ""
      ).replace(/[^a-zA-Z.]/g, "") || "og_file.jpg";
    result.previewImage = new Parse.File(filename, {uri: imgPath});
    await result.previewImage.save();
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