#!/usr/bin/env node

var walker = require('./walker') //recursive traversal of images
var path = require('path')

var server = require('./main')

main()
async function main(){
    try{
        await server.cli()
    }
    catch(err) {
        console.error('Err in traversing file tree: ' + err)
    }
}