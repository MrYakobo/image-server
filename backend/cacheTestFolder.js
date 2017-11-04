var fs = require('fs')
var getFiles = require('./walker') //recursive traversal of images
var isImage = require('is-image')
var isVideo = require('is-video')
var path = require('path')

async function main() {
    try{ var _files = await getFiles(path.join(__dirname, '../test')) }
    catch(err) { console.error('Err in traversing file tree: ' + err) }
    files = _files.filter((x) => {
        //keep: files that are images AND files whose dirname doesn't have '.thumbnails' in it
        return (isImage(x) || isVideo(x)) && path.dirname(x).indexOf('.thumbnails') < 0
    });
    files = files.map((x)=>{return 'test/' + x})
    fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify({files: files, folder: 'test'}))
}
main()