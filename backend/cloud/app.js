/* global app, Parse */
let { access, constants, readFileSync } = require("fs");
let express = require("express");
let path = require("path");
let { opengraphImage } = require("./services/imaging.js");

app.use(express.static(path.join(__dirname, 'public')));

app.get("/og/:className/:id/image.png", opengraphImage);

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