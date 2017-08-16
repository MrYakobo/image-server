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

function middleware(files) {

    thumbnails(files) //generate thumbnails for input files

    app.get('/data.js', (req, res) => {
        res.send(`var files = ${JSON.stringify(files)}; var folder = ${JSON.stringify(path.basename(process.cwd()))}`)
    });

    app.get('/', (req, res) => {
        res.send(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'))
    });

    app.use('/', express.static('.'))
    app.use('/', express.static(__dirname));

    return app
}

//Exports:
module.exports.middleware = middleware

module.exports.cli = function (files) {
    var app = middleware(files)

    app.listen(8080, () => {
        console.log('imageinary listening on ' + ip.address() + ':8080!');
        //open localhost in browser
        opn('http://localhost:8080')
    })

    //on server exit
    process.on('SIGINT', () => {
        if (process.argv[2] == '--keep-thumbnails') {
            process.exit()
        }
        console.log('\nCleaning up thumbnails directory...')
        console.log('(run with --keep-thumbnails to avoid this behaviour)')
        rimraf('.thumbnails', function () {
            process.exit();
        })
    });
}