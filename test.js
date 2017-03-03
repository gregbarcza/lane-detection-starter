const pipeline = require('./pipeline')

const inPath = './test-input.jpg'
const outPath = './test-output.jpg'
pipeline(inPath, outPath)
.catch((e) => console.error(e.stack))
