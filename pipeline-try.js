const Promise = require('bluebird')
const cv = require('opencv')
var nj = require('numjs')

const IN = './img/frame1.jpg'
const OUT = './example.jpg'

const CANNY_LOW_THRESHOLD = 50
const CANNY_HIGH_THRESHOLD = 150

// mask coordinates
const MASK_CUT_Y_TOP = 0.5
const MASK_CUT_X_TOP_LEFT = 0.45
const MASK_CUT_X_TOP_RIGHT = 0.45
const MASK_CUT_X_BOTTOM_LEFT = 0
const MASK_CUT_X_BOTTOM_RIGHT = 1

// const readImage = Promise.coroutine(function * (path) {
//   const img = yield cv.readImageAsync(path)
//   return Promise.promisifyAll(img)
// })

cv.readImage(IN, function (err, im) {
  if (err) throw err
  const W = im.width()
  const H = im.height()
  if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size')

  im.cvtColor('CV_BGR2GRAY')
  im.gaussianBlur([5, 5], 0)
  const edges = im.clone()
  edges.canny(CANNY_LOW_THRESHOLD, CANNY_HIGH_THRESHOLD)
  console.log(edges)
  const maskVertices = nj.array([[
    [W * MASK_CUT_X_TOP_LEFT, H * MASK_CUT_Y_TOP],
    [W * MASK_CUT_X_TOP_RIGHT, H * MASK_CUT_Y_TOP],
    [W * MASK_CUT_X_BOTTOM_RIGHT, H],
    [W * MASK_CUT_X_BOTTOM_LEFT, H]
  ]])
  let mask = nj.zeros(edges)
  mask = mask.fillPoly(maskVertices, 255)
  let maskedEdges = edges.bitwiseAnd(mask)

  maskedEdges.save(OUT)
  console.log('Image saved to', OUT)
})

// Promise.coroutine(function * () {
//   const img = yield readImage('./img/frame1.jpg')
//   yield img.save('./example.jpg')
// })().catch((e) => console.error(e.stack))


// blur_gray = cv2.cvtColor(img,cv2.COLOR_RGB2GRAY)
// blur_gray = cv2.GaussianBlur(blur_gray, (BLUR_KERNEL_SIZE, BLUR_KERNEL_SIZE), 0)
// edges = cv2.Canny(blur_gray, CANNY_LOW_THRESHOLD, CANNY_HIGH_THRESHOLD)