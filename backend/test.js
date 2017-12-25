var folderThumb = require('./thumbnails').folder
var path = require('path')
var fs = require('fs')
var opn = require('opn')

async function main() {
    var f = 'folder'
    var files = fs.readdirSync(f).filter(f=>f!=='.thumbnails')
    var out = await folderThumb(f, files)
    opn(out)
}

main()