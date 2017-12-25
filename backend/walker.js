var fs = require('fs-extra')
var realfs = require('fs')
var isVideo = require('is-video')
var walk = require('walk');
var path = require('path')

module.exports.recursive = function (folder) {
    var files = []
    var folders = []
    return new Promise((resolve, reject) => {

        walker = walk.walk(folder);

        walker.on("file", function (root, fileStats, next) {
            var f = path.relative(folder, path.resolve(root, fileStats.name));
            if(f.indexOf('.thumbnails')===-1)
                files.push(f)
            next();
        });

        walker.on("directory", function (root, fileStats, next) {
            var f = path.relative(folder, path.resolve(root, fileStats.name));
            if(f.indexOf('.thumbnails')===-1)
                folders.push(f)

            next();
        });

        walker.on("errors", function (root, nodeStatsArray, next) {
            console.log(nodeStatsArray.errors)
            reject();
            next();
        });

        walker.on("end", function () {
            resolve([files, folders]);
        });
    })
}

const ROOT = process.cwd()

module.exports.single = async function(folder){
    var entries = (await fs.readdir(folder)).map(f=>path.join(path.relative(ROOT, folder), f)) //throws if folder doesn't exist, that's fine
    //below is a very beautiful, functional solution
    var t = entries.map(f=>realfs.lstatSync(f).isDirectory()) //temporary array holding truth values about if an entry is a directory

    var folders = entries.filter((f,i)=>t[i] && f!='.thumbnails') //all directories except for .thumbnails
    var files = entries.filter((f,i)=>!t[i]).map(
        f => isVideo(f) ? {type: 'video', url: f} : {type: 'image', url: f}
    ) //all files, mapped for video/image
    return [files, folders]
}