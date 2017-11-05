var mkdirp = require('mkdirp')
var path = require('path')
var sharp = require('sharp')
var fs = require('fs-extra')

var isVideo = require('is-video')
var videothumbnail = require('video-thumbnail')

var _progress = require('cli-progress');

module.exports = async function (files) {
    var bar1 = new _progress.Bar({
        format: 'Now generating thumbnails... [{bar}] {percentage}%',
        stopOnComplete: true
    }, _progress.Presets.shades_grey);

    bar1.start(files.length, 0);
    for (var i = 0; i < files.length; i++) {
        var dest = path.join('.thumbnails', files[i])
        //if dest exist: skip to next image
        try { await fs.access(dest) } catch (err) {
            //make sure path to thumbnail exists
            mkdirp(path.dirname(dest))
            if (isVideo(files[i])) {
                await videothumbnail.video(files[i], dest, { width: 290 })
            } else {
                await sharp(files[i]).resize(290, 217).toFile(dest)
            }
        }
        bar1.increment()
    }
    bar1.stop()
    console.log('Done!')
}