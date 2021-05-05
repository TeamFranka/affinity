/* global app, Parse */
let { access, constants, readFileSync } = require("fs");
let express = require("express");
let path = require("path");
let { generateOGImage } = require("./services/imaging.js");
const { OGObjects } = require("./models");
const { settings } = require("cluster");

const DEFAULT_COLOR = "#7253ed";

const FONTS = {
   "Roboto": readFileSync(path.join(__dirname, "fonts/Roboto/Roboto-Regular.ttf")),
}

function remap(model, params) {

  // we must have a font.
  params.font = FONTS[params.font] || FONTS.Roboto;

  // resolve text path for element
  for (let index = 0; index < params.attr.length; index++) {
    const path = params.attr[index];
    const entries = path.split(".");
    let entry = model;
    for (let index = 0; index < entries.length; index++) {
        const key = entries[index];
        entry = entry.get ? entry.get(key) : entry[key]
        if (!entry) {
          break
        }
    }
    if (entry) {
        params.text = entry;
        break
    }
  }
  return params
}


app.use(express.static(path.join(__dirname, 'public')));

app.get("/og/:className/:id/image.png", async (req, res) => {
   const { className, id } = req.params;
   const model = OGObjects[className];
   if (!model) {
      throw `Don't know ${className}`
   }
   const obj = await (new Parse.Query(model)).include(["team", "author"]).get(id);
   let file = false; //obj.get("ogImage");
   if (!file) {
    // we must generate
    const team = obj.get("team");
    const background = team.get("ogTemplate") ? team.get("ogTemplate").url() : DEFAULT_COLOR;
    const allSettings = team.get("ogSettings") || {};
    const settings = allSettings[className] || allSettings.default || {
      texts: [{
              attr: ["team.name", "team.slug"],
              font: "Roboto",
              color: "#ffffff",
              fontSize: 32,
              x: 10,
              y: 20,
            },
            {
              attr: [ "title", "name", "description"],
              font: "Roboto",
              color: "#ffffff",
              verticalAlign: "bottom",
              fontSize: 64,
              x: 10,
              y: 500,
              maxWidth: 800,
            },
            {
              attr: [ "author.name", "author.username"],
              font: "Roboto",
              color: "#ffffff",
              fontSize: 24,
              x: 10,
              y: 505,
              maxWidth: 800,
            }
      ],
    };

    const ogImage = await generateOGImage({
        background,
        texts: (settings.texts || []).map((params) => remap(obj, params))
    });
    file = new Parse.File(`${id}_og.png`, {base64: ogImage}, "image/png");
    await file.save();
    await obj.save({ "ogImage": file }, { useMasterKey: true });
  }

  res.redirect(file.url());
  return
});

app.get("*", (req, res)=> {
   // fallback, try to deliver the host-specific index
   const file = path.join(__dirname, `public/${req.hostname}.html`);

   // Check if the file is readable.
   access(file, constants.R_OK, (err) => {
      if (err) {
         console.warn(`Server request ${req.hostname}, failed: ${err}.`);
         res.sendFile(path.join(__dirname, 'public/index.html'));
      } else {
         res.sendFile(file);
      }
   });

});