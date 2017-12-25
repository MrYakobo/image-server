<template>
    <div class='card-image' @click="modaltoggle(source)">
        <!--<a :href="source" target="_blank" :download="dltoggle">-->
        <figure class='image is-4by3'>
            <template v-if="type=='image'">
                <img v-show="!imageloaded" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM88R8AApUByU2MEcEAAAAASUVORK5CYII=" key="loading">
                <img v-show="imageloaded" @load="loaded" @error="tryagain" :src="src">
            </template>
            <template v-else>
                <img v-show="!imageloaded" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOUuvj1PwAFzgLhbof62gAAAABJRU5ErkJggg==" key="loading">
                <video ref="video" class="videofix" v-show="imageloaded" :src="src" @loadstart="loaded" @error="tryagain" autoplay loop></video>
            </template>
        </figure>
    </div>
</template>

<script>
    export default {
        props: ['source', 'index', 'type'],
        name: 'imagecard',
        data() {
            return {
                imageloaded: false,
                src: null
            }
        },
        computed: {
            thumb() {
                return `.thumbnails/${this.source}`
                // var arr = this.source.split('/')
                // var last = arr[arr.length-1]
                // var first = this.source.split(last)[0]
                // return `${first}.thumbnails/${last}`
            }
        },
        methods: {
            modaltoggle(src) {
                this.$emit('modalimg', this.index)
            },
            loaded() {
                this.imageloaded = true
            },
            tryagain() {
                //if image hasn't loaded yet due to computer not having generated the images fast enough:
                setTimeout(() => {
                    this.src = this.thumb + "?" + Date.now()
                }, 2000)
            }
        },
        mounted() {
            this.src = this.thumb
            this.refs.video.volume = 1
        }
    }
</script>
<style>
.videofix{
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 100%; 
}
</style>