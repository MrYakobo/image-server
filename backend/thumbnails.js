var mkdirp = require('mkdirp')
var path = require('path')
var sharp = require('sharp')
var fs = require('fs')

var isVideo = require('is-video')
var videothumbnail = require('video-thumbnail')

var _progress = require('cli-progress');

module.exports = function (files) {
    var bar1 = new _progress.Bar({
        format: 'Now generating thumbnails... [{bar}] {percentage}%',
        stopOnComplete: true
    }, _progress.Presets.shades_grey);

    function cb(i) {
        if (i < files.length) {
            var dest = path.join('.thumbnails', files[i])
            //does dest exist? if it does, iterate to next image
            fs.access(dest, (err) => {
                bar1.increment()
                if (err) {
                    //make sure path to thumbnail exists
                    mkdirp(path.dirname(dest))
                    if (isVideo(files[i])) {
                        videothumbnail(files[i], dest, {width: 290}).then(()=>{
                            cb(i+1)
                        })
                    } else {
                        sharp(files[i]).resize(290, 217).toFile(dest, (err, info) => {
                            cb(i + 1)
                        });
                    }
                } else {
                    cb(i + 1)
                }
            })
        } else {
            bar1.stop()
            console.log('Done!')
        }
    }
    bar1.start(files.length, 0);
    cb(0);
}