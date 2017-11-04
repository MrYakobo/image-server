#!/usr/bin/env node

var getFiles = require('./walker') //recursive traversal of images
var isImage = require('is-image')
var isVideo = require('is-video')
var path = require('path')

var server = require('./main')

main()
async function main() {
    try{ var _files = await getFiles('.') }
    catch(err) { console.error('Err in traversing file tree: ' + err) }
    files = _files.filter((x) => {
        //keep: files that are images AND files whose dirname doesn't have '.thumbnails' in it
        return (isImage(x) || isVideo(x)) && path.dirname(x).indexOf('.thumbnails') < 0
    });

    server.cli(files)
}