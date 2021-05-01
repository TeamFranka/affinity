/* global app */
let { access, constants } = require("fs");
let express = require("express");
let path = require("path");

app.use(express.static(path.join(__dirname, 'public')));

app.get("*", (req, res, next)=> {
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