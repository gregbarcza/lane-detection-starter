const pipeline = require('./pipeline')
const ffmpeg = require('fluent-ffmpeg')
const Promise = require('bluebird')

function enqueueFrame (number) {
  const inPath = `./img/frame${number}.jpg`
  const outPath = `./img-out/frame${number}.jpg`
  return pipeline(inPath, outPath)
}
const ProgressBar = require('ascii-progress')
var bar1 = new ProgressBar()

var lastFrameEnqueued = 0
const frameArr = []
console.log('Convert started')
ffmpeg('./clip1.mp4')
  .on('progress', function (progress) {
    bar1.update(progress.percent / 100)
    var n = lastFrameEnqueued + 1
    lastFrameEnqueued = progress.frames - 1
    for (; n < progress.frames; n++) {
      frameArr.push(enqueueFrame(n))
    }
  })
  .on('error', function (err) {
    console.log('an error happened: ' + err.message)
  })
  .on('end', function (stdout, stderr) {
    bar1.update(1)
    console.log('Transcoding succeeded !')
    Promise.all(frameArr)
    .then(saveVideo)
    .catch((e) => console.error(e.stack))
  })
  .save('./img/frame%d.jpg')

function saveVideo () {
  console.log('Export started!')
  var bar2 = new ProgressBar()
  ffmpeg('./img-out/frame%d.jpg')
  .on('progress', function (progress) {
    bar2.update(progress.percent / 100)
  })
  // setup event handlers
  .on('end', function () {
    bar2.update(1)
    console.log('file has been converted succesfully')
  })
  .on('error', function (err) {
    console.log('an error happened: ' + err.message)
  })
  // save to file
  .save('./out.m4v')
}


