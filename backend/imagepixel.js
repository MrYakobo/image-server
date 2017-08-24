var dl = require('download-image')
var path = require('path')

for (var i = 0; i < 10; i++) {
    dl('http://lorempixel.com/800/1200/', path.join('test', `${i}.jpg`))
}