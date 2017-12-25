var mkdirp = require('mkdirp')
var path = require('path')
var sharp = require('sharp')
var fs = require('fs-extra')

var isVideo = require('is-video')
var videothumbnail = require('video-thumbnail')
var tmp = require('tmp-promise')
var hash = require('checksum')

var opn = require('opn')

var _progress = require('cli-progress');

async function hashCheck(hashfile, string) {
    var old
    if(!fs.existsSync(hashfile)){
        await fs.createFile(hashfile) //to avoid .thumbnails/folder/.hash not existing
        old = ''
    }
    else{
        old = await fs.readFile(hashfile, 'utf8')
    }

    var cs = hash(string)
    await fs.writeFile(hashfile, cs)
    return cs != old
}

function folderThumbnail(folderPath, files){
    return new Promise(async (res, rej)=>{
    files = files.map(f=>path.join(path.relative(ROOT, folderPath), f))
    var dest = path.join('.thumbnails', folderPath, 'folder.png')

    var p = path.join('.thumbnails', folderPath, '.hash')
    var newFiles = hashCheck(p, JSON.stringify(files))

    if(newFiles){
        mkdirp(path.dirname(dest)) //make .thumbnails directory

        var paths = []

        for(var i = 0; i < 4; i++){ //shrink down four images in the directory
            var inp = files[i%(files.length-1)]
            var p = (await tmp.file()).path
            paths[i] = p
            await sharp(inp).resize(160,120).crop(sharp.strategy.attention).toFile(p)
        }

        var gravitys = ['northwest', 'northeast', 'southwest', 'southeast']

        const options = {
            raw: {
            width: 350,
            height: 262,
            channels: 4
            }
        };
        
        const base = sharp({ create: { width: 350, height: 262, channels: 4, background: 'transparent' }}
        ).raw().toBuffer();
        
        const composite = paths.reduce((input, overlay, i) => {
            return input.then(function(data) {
            return sharp(data, options).overlayWith(overlay, {gravity: sharp.gravity[gravitys[i]]}).raw().toBuffer();
            });
        }, base);
        
        composite.then(function(data) {
            sharp(data, options)
            .png()
            .toFile(dest)
            res(dest)
        });
    }
    })
}

const ROOT = process.cwd()

module.exports.folder = folderThumbnail
module.exports.files = async function (files) {
    var bar1 = new _progress.Bar({ format: 'Now generating thumbnails... [{bar}] {percentage}%', stopOnComplete: true }, _progress.Presets.shades_grey);
    bar1.start(files.length, 0);

    var failed = []

    for (var i = 0; i < files.length; i++) {
        var dest = path.join('.thumbnails', files[i])
        //if dest exist: skip to next image
        try {
            await fs.access(dest)
        } catch (err) {
            //make sure path to thumbnail exists
            mkdirp(path.dirname(dest))
            if (isVideo(files[i])) {
                await videothumbnail.video(files[i], dest, { width: 290 })
            } else {
                try {
                    await sharp(files[i]).resize(290, 217).toFile(dest)
                }
                catch(er){
                    failed.push(files[i])
                }
            }
        }
        bar1.increment()
    }
    bar1.stop()
    return failed
    console.log('Done!')
}