//web server
var express = require('express');
var ip = require('ip')
var yesno = require('yesno')

//file system
var path = require('path')
var rimraf = require('rimraf')
//image
var thumbnails = require('./thumbnails').files //script for generating thumbnails
var folderThumb = require('./thumbnails').folder //script for generating thumbnails
//opn
var opn = require('opn')
var keepThumbnails = process.argv[2] == '--keep-thumbnails'

var ROOT = process.cwd()

var walker = require('./walker').single
var recursiveWalk = require('./walker').recursive

var fs = require('fs-extra')

//path is the requested path (starts at / and goes to /folder/subfolder)
function middleware(failed) {
    var app = express()

    //GET data.json?path=Jakob/EOS%20M
    //returns JSON with files
    app.get('/data.json', async (req, res) => {
        try {
            var p = path.resolve(path.join(ROOT, req.query.path))
            await fs.access(p)

            var [files, folders] = await walker(p)
            var o = { err: false, files: files.filter(f=> failed.indexOf(f.url)<0), folders: folders } //keep files that didn't fail
            res.send(JSON.stringify(o))
        }
        catch(er){
            console.error(er)
            res.send(JSON.stringify({err: er}))
        }
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'))
    });

    app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
    app.use('/src/assets', express.static(path.join(__dirname, '../src/assets')));
    app.use('/dist', express.static(path.join(__dirname, '../dist')));

    //"catch all"-route
    app.use('/', express.static('.'))

    return app
}

//Exports:
module.exports.middleware = middleware

module.exports.cli = async function() {
    var app = middleware([])
    var port = process.env.PORT || 8080
    app.listen(port, () => {
        console.log(`imageinary listening on ${ip.address()}:${port}!`)
        //open localhost in browser
        // opn('http://localhost:' + port)
    })

    var [allFiles, folders] = await recursiveWalk('.')
    thumbnails(allFiles).then(()=>{

    }) //generate thumbnails for ALL files in subdirectories

    for(var i = 0; i < folders.length; i++){
        var files = await fs.readdir(folders[i])
        await folderThumb(folders[i], files)
    }

    var isExiting = false
    //on server exit
    process.on('SIGINT', () => {
        if (keepThumbnails) {
            process.exit()
        }
        if(!isExiting){
            /*
            yesno.ask('\nDo you want me to clean up the thumbnails directory? [Y/n]', true, (yes) => {
                if (yes) {
                    console.log('Ok! rm -rf .thumbnails')
                    rimraf('.thumbnails', function () {
                        process.exit();
                    })
                } else {
                    console.log(`K, I'll leave it there. (run imageinary with --keep-thumbnails to avoid the choice next time)`)
                    process.exit();
                }
            })
            */
            process.exit(0)
            isExiting = true
        }
    });
}