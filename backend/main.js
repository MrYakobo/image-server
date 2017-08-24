//web server
var express = require('express');
var app = express();
var ip = require('ip')

//file system
var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')

//image
var thumbnails = require('./thumbnails') //script for generating thumbnails

//opn
var opn = require('opn')

var keepThumbnails = process.argv[2] == '--keep-thumbnails'

function middleware(files) {
    thumbnails(files) //generate thumbnails for input files
    
    app.get('/data.json', (req, res) => {
        var o = {files: files, folder: path.basename(process.cwd())}
        res.send(JSON.stringify(o))
        // res.send(`var files = ${JSON.stringify(files)}; var folder = ${JSON.stringify(path.basename(process.cwd()))}`)
    });

    app.get('/', (req, res) => {
        res.send(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'))
    });

    app.use('/node_modules', express.static(path.join(__dirname,'../node_modules')));
    app.use('/src/assets', express.static(path.join(__dirname,'../src/assets')));
    app.use('/dist', express.static(path.join(__dirname,'../dist')));

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

    app.listen(8080, () => {
        //console.log('imageinary listening on ' + ip.address() + ':8080!');
        //open localhost in browser
        opn('http://localhost:8080')
    })

    //on server exit
    process.on('SIGINT', () => {
        if (keepThumbnails) {
            process.exit()
        }
        console.log('\nCleaning up thumbnails directory...')
        console.log('(run with --keep-thumbnails to avoid this behaviour)')
        rimraf('.thumbnails', function () {
            process.exit();
        })
    });
}