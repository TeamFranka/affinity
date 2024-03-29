/* global app, Parse */
let { access, constants, readFileSync, readFile} = require("fs");
let express = require("express");
let path = require("path");
let { opengraphImage } = require("./services/imaging.js");
let { Activity, Team, User } = require("./models");
const config = require('./config.js');
const MobileDetect = require('mobile-detect');

const PUBLIC_PATH = path.join(__dirname, 'public');
const OG_REPLACE_KEY = '<base href="/">';

const SITENAMES = {
  "app.wir.md": "Wir.md",
  "community.affinity.wtf": "Affinity"
};
const DEFAULT_SITENAME = "Affinity";

app.use(express.static(PUBLIC_PATH));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get("/og/:className/:id/image.png", opengraphImage);

function renderOG(data, req, res, next) {
  const context = Object.assign({
    server: req.hostname,
    fullUrl: `${req.protocol}://${req.hostname}/${req.originalUrl}`,
    sitename: SITENAMES[req.hostname] || DEFAULT_SITENAME
  }, data)
  res.render("opengraphmeta", context, (err, html) => {
    if (!err) {
      req.ogInject = html;
    }
    next()
  })

}

function makeWithOG(cls, includes) {
  async function inner(req, res, next) {
    const { id } = req.params;
    return (new Parse.Query(cls)).include(includes).get(id).then(
      (obj) => {
        renderOG(obj.makeOpenGraphData(req), req, res, next);
      },
      (err) => {
        next()
      }
    );
  }
  return inner;
}

app.get("/t/:slug", async function inner(req, res, next) {
  const { slug } = req.params;
  const team = await (new Parse.Query(Team)).equalTo("slug", slug).first();
  console.log(team);
  if (team) {
    renderOG(team.makeOpenGraphData(req), req, res, next)
  } else {
    next()
  }
});
app.get("/u/:id", makeWithOG(User, []));
app.get("/a/:id", makeWithOG(Activity, ["objects", "team"]));

app.get("/app-redir", (req, res) => {
  const hostname = req.hostname
  const pageConfig = config.pages[hostname]
  if (!pageConfig) {
    res.redirect("/");
    return
  }

  const md = new MobileDetect(req.headers['user-agent']);
  switch (md.os()) {
    case "AndroidOS":
      res.redirect(pageConfig.ANDROID_INSTALL_URL)
      break
    case "iOS":
      res.redirect(pageConfig.IOS_INSTALL_URL)
      break
    default:
      res.redirect("/")
      break
  }
})

app.get("*", (req, res, next)=> {
   // fallback, try to deliver the host-specific index
  if (req.path.match(/.*(request_password_reset|confirm_password_reset|verify_email|choose_password)/i)) {
     console.log(`'${req.path}' is native, continuing`);
     next()
     return
  }

  const hostname = req.hostname
  const pageConfig = config[hostname]
  let targetFile = path.join(PUBLIC_PATH, 'index.html');

  if (pageConfig && pageConfig.filename) {
    // we have a specific page config filename, use that instead.
    targetFile = path.join(PUBLIC_PATH, pageConfig.filename);
  }

  if (req.ogInject) { // a previous match put us up to inject OpenGraphData
    readFile(targetFile, 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        next(err)
      } else {
        res.send(data.replace(OG_REPLACE_KEY, req.ogInject));
      }
    })
  } else {
    // regular send file is good enough
    res.sendFile(targetFile)
  }
});