//web server
var express = require('express');
var ip = require('ip')
var yesno = require('yesno')

//file system
var path = require('path')
var rimraf = require('rimraf')

//image
var thumbnails = require('./thumbnails') //script for generating thumbnails

//opn
var opn = require('opn')

var keepThumbnails = process.argv[2] == '--keep-thumbnails'

function middleware(files) {
    var app = express()
    thumbnails(files) //generate thumbnails for input files

    app.get('/data.json', (req, res) => {
        var o = {
            files: files,
            folder: path.basename(process.cwd())
        }
        res.send(JSON.stringify(o))
        // res.send(`var files = ${JSON.stringify(files)}; var folder = ${JSON.stringify(path.basename(process.cwd()))}`)
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'))
    });

    app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
    app.use('/src/assets', express.static(path.join(__dirname, '../src/assets')));
    app.use('/dist', express.static(path.join(__dirname, '../dist')));

    //"catch all"-route
    app.use('/', express.static('.'))
    //this way, if an asset is present in both dirs, the server will prefer the one that came from this package (which is probably more important)
    // app.use('/', express.static(__dirname));

    return app
}

//Exports:
module.exports.middleware = middleware

module.exports.cli = function (files) {
    var app = middleware(files)

    var port = process.env.PORT || 8080
    app.listen(port, () => {
        console.log('imageinary listening on ' + ip.address() + ':'+port+'!');
        //open localhost in browser
        opn('http://localhost:' + port)
    })

    //on server exit
    process.on('SIGINT', () => {
        if (keepThumbnails) {
            process.exit()
        }
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
    });
}