var fs = require('fs');
var walk = require('walk');
var path = require('path')

var files = [];
var dirs = [];

module.exports = function (folder) {
    return new Promise((resolve, reject) => {

        walker = walk.walk(folder);

        walker.on("file", function (root, fileStats, next) {
            var f = path.relative(folder, path.resolve(root, fileStats.name));
            files.push(f)
            next();
        });

        walker.on("errors", function (root, nodeStatsArray, next) {
            console.log(nodeStatsArray.errors)
            reject();
            next();
        });

        walker.on("end", function () {
            resolve(files);
        });
    })
}