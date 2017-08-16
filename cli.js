var getFiles = require('./walker') //recursive traversal of images
var isImage = require('is-image')
var path = require('path')

var server = require('./main')

getFiles('.').then((_files) => {
    files = _files.filter((x) => {
        //keep: files that are images AND files whose dirname doesn't have '.thumbnails' in it
        return isImage(x) && path.dirname(x).indexOf('.thumbnails') < 0
    });

    server.cli(files)

}, (err) => {
    console.error('Err in traversing file tree: ' + err)
})