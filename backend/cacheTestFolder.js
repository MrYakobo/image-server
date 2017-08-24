var fs = require('fs')
var path = require('path')
var files = fs.readdirSync(path.resolve(__dirname, '../test'))

var o = {files: files, folder: 'test'}
fs.writeFileSync(path.resolve(__dirname, '../data.json'), JSON.stringify(o))