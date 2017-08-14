var mkdirp = require('mkdirp')
var path = require('path')
var sharp = require('sharp')
var fs = require('fs')

module.exports = function (files) {
    function cb(i) {
        if (i < files.length) {
            var dest = path.join('.thumbnails', files[i])
            //does dest exist? if it does, iterate to next image
            fs.access(dest, (err) => {
                if (err) {
                    //make sure path to thumbnail exists
                    mkdirp(path.dirname(dest))
                    sharp(files[i]).resize(300, 225).toFile(dest, (err, info) => {
                        cb(i + 1)
                    });
                } else{
                    cb(i+1)
                }
            })

        }
    }
    cb(0);
}