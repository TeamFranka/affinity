// originals from https://github.com/codepunkt/gatsby-remark-opengraph
/* global app, Parse */
let { readFileSync } = require("fs");
let path = require("path");
const { OGObjects } = require("../models");
const Jimp = require('jimp');
const {
  render,
  Text,
  RgbColor,
  Position,
  Dimension,
  Alignment,
  VerticalAlign,
  HorizontalAlign,
} = require('@codepunkt/wasm-layout-text');


const DEFAULT_COLOR = "#7253ed";

const FONTS = {
  "Roboto": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-Regular.ttf")),
  "Roboto Black": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-Black.ttf")),
  "Roboto BlackItalic": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-BlackItalic.ttf")),
  "Roboto Bold": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-Bold.ttf")),
  "Roboto BoldItalic": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-BoldItalic.ttf")),
  "Roboto Italic": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-Italic.ttf")),
  "Roboto Light": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-Light.ttf")),
  "Roboto LightItalic": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-LightItalic.ttf")),
  "Roboto Medium": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-Medium.ttf")),
  "Roboto Thin": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-Thin.ttf")),
  "Roboto ThinItalic": readFileSync(path.join(__dirname, "../fonts/Roboto/Roboto-ThinItalic.ttf")),
}

FONTS.default = FONTS["Roboto Regular"] = FONTS.Roboto;


const hexToRgb = (hex) => {
  const hexCode = hex.replace(/^#/, '')
  const bigint = parseInt(hexCode, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
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

async function generateOGImage(
  {
    background,
    width = 1200,
    height = 630,
    texts = [],
  }
) {

  const backgroundLayer = background.match(/[0-9A-Fa-f]{6}/g)
    ? await new Jimp(width, height, background)
    : await Jimp.read(background)

  return Promise.all([
    backgroundLayer,
    ...texts.map(
      ({
        text,
        font,
        fontSize = 64,
        color = '#000000',
        x = 0,
        y = 0,
        maxWidth = width,
        maxHeight = height,
        horizontalAlign = 'left',
        verticalAlign = 'top',
      }) => {
        let hAlign, vAlign
        switch (horizontalAlign) {
          case 'left':
            hAlign = HorizontalAlign.Left
            break
          case 'center':
            hAlign = HorizontalAlign.Center
            break
          case 'right':
            hAlign = HorizontalAlign.Right
            break
          default:
            throw new Error(`Unknown horizontalAlign!`)
        }
        switch (verticalAlign) {
          case 'top':
            vAlign = VerticalAlign.Top
            break
          case 'center':
            vAlign = VerticalAlign.Center
            break
          case 'bottom':
            vAlign = VerticalAlign.Bottom
            break
          default:
            throw new Error(`Unknown verticalAlign!`)
        }
        const buffer = render(
          new Text(
            text,
            fontSize,
            new RgbColor(...hexToRgb(color)),
            font
          ),
          new Dimension(width, height),
          new Dimension(maxWidth, maxHeight),
          new Position(x, y),
          new Alignment(hAlign, vAlign)
        )
        return new Jimp({ data: buffer, width, height })
      }
    ),
  ])
  .then(([backgroundLayer, ...textLayers]) => {
    let result = backgroundLayer
    textLayers.forEach((textLayer) => {
      result = result.composite(textLayer, 0, 0)
    })
    return result.quality(100)
  }).then(image => image.getBase64Async(Jimp.MIME_PNG))
}

async function opengraphImage(req, res) {
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
             font: "Roboto Thin",
             color: "#ffffff",
             fontSize: 32,
             x: 25,
             y: 20,
           },
           {
             attr: [ "title", "name", "description"],
             font: "Roboto Light",
             color: "#ffffff",
             verticalAlign: "bottom",
             fontSize: 64,
             x: 25,
             y: 500,
             maxWidth: 800,
           },
           {
             attr: [ "author.name", "author.username"],
             font: "Roboto LightItalic",
             color: "#ffffff",
             fontSize: 24,
             x: 25,
             y: 520,
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
}

module.exports = {
  opengraphImage
}