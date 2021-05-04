// originals from https://github.com/codepunkt/gatsby-remark-opengraph
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

const hexToRgb = (hex) => {
  const hexCode = hex.replace(/^#/, '')
  const bigint = parseInt(hexCode, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
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

module.exports = {
  generateOGImage
}