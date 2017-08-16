#!/usr/bin/env node
//web server
var express = require('express');
var app = express();
var ip = require('ip')

//file system
var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')

//image
var getFiles = require('./walker') //recursive traversal of images
var thumbnails = require('./thumbnails') //script for generating thumbnails
var isImage = require('is-image')

//opn
var opn = require('opn')


var files = [];

getFiles('.').then((_files) => {
    files = _files.filter((x) => {
        //keep: files that are images AND files whose dirname doesn't have '.thumbnails' in it
        return isImage(x) && path.dirname(x).indexOf('.thumbnails') < 0
    });

    thumbnails(files) //generate thumbnails for these images

}, (err) => {
    console.error('Err in traversing file tree: ' + err)
})

app.get('/data.js', (req, res) => {
    res.send(`var files = ${JSON.stringify(files)}; var folder = ${JSON.stringify(path.basename(process.cwd()))}`)
});

app.get('/', (req, res) => {
    res.send(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'))
});

//app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
//app.use('/.thumbnails', express.static('.thumbnails'))
app.use('/', express.static('.'))
app.use('/', express.static(__dirname));

app.listen(8080, () => {
    console.log('image-server listening on ' + ip.address() + ':8080!');
    opn('http://localhost:8080')
})

//on server exit
process.on('SIGINT', () => {
    if(process.argv[2] == '--keep-thumbnails') {
        process.exit()
    }
    console.log('\nCleaning up thumbnails directory...')
    console.log('(run with --keep-thumbnails to avoid this behaviour)')
    rimraf('.thumbnails', function () {
        process.exit();
    })
});
