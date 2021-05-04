/* global app, Parse */
let { access, constants, readFileSync } = require("fs");
let express = require("express");
let path = require("path");
let { generateOGImage } = require("./services/imaging.js");

const DEFAULT_COLOR = "#7253ed";

const FONTS = {
   "Roboto": readFileSync(path.join(__dirname, "fonts/Roboto/Roboto-Regular.ttf")),
}

app.use(express.static(path.join(__dirname, 'public')));

app.get("/og/:className/:id/image.png", async (req, res) => {
   const { className, id } = req.params;
   const obj = await (new Parse.Query(className)).include("team").get(id);
   let file = obj.get("ogImage");
   if (!file) {
      // we must generate
      const team = obj.get("team");
      const background = team.get("ogTemplate") ? team.get("ogTemplate").url() : DEFAULT_COLOR;
      //const settings = team.get("ogSettings");
      const ogImage = await generateOGImage({
         background,
         texts: [
            {
               text: "test",
               font: FONTS.Roboto
            }
         ]
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