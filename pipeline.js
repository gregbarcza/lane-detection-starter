const Promise = require('bluebird')
const cv = require('opencv')
// var nj = require('numjs')

const editImage = (inputPath, outputPath) => new Promise((resolve, reject) => {
  cv.readImage(inputPath, function (err, im) {
    if (err) return reject(err)
    const W = im.width()
    const H = im.height()
    if (W < 1 || H < 1) throw new Error('Image has no size')
    // Write your code here
    im.cvtColor('CV_BGR2GRAY')
    im.gaussianBlur([5, 5], 0)
    im.canny(50, 150)

    // End of edit area

    im.save(outputPath)
    return resolve()
  })
})
module.exports = editImage
