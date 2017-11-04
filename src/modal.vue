<template>
    <div class="modal" :style="show ? 'display:block' : ''">
        <div class="modal-background" @click="hide"></div>
        <img v-show="isImage" class="fullscreenimg2" :src="currImg">
        <video v-show="!isImage" controls autoplay class="fullscreenvideo" :src="currImg" ref="video"></video>
        <div class="tag is-success is-large">
            <h4 class="title is-4 has-text-white">{{i+1}}/{{files.length}}</h4>
        </div>
        <!--Misc floating controls-->
        <button class="modal-close is-large" aria-label="close" @click="hide"></button>
        <button class="modal-button-right button is-primary is-large" @click="increment"><i class="fa fa-arrow-right"></i></button>
        <button class="modal-button-left button is-primary is-large" @click="decrement"><i class="fa fa-arrow-left"></i></button>
        <!--TOOLBAR-->
        <div class="fix-footer">
            <a class="button is-large is-outlined is-white" download :href="currImg"><i class="fa fa-download"></i></a>
            <button class="button is-large is-outlined is-danger" @click="trash"><i class="fa fa-trash-o"></i></button>
            <!-- <star-panel :rating="2" @rating="val => { updateDB(file, val) }"></star-panel> -->
        </div>
    </div>
</template>

<script>
    import {
        bus
    } from './bus.js'

    export default {
        name: 'modal',
        props: ['files', 'show'],
        data() {
            return {
                i: 0
            }
        },
        watch: {
            show() {
                if (!this.isImage) {
                    if (this.show) {
                        this.$refs.video.play()
                    }
                    else{
                        this.$refs.video.pause()
                    }
                }
            }
        },
        methods: {
            increment() {
                if (this.i + 1 < this.files.length)
                    this.i++
            },
            decrement() {
                if (this.i > 0)
                    this.i--
            },
            trash() {
                this.$emit('remove', i)
                this.i--
            },
            hide() {
                this.$emit('hide')
            }
        },
        computed: {
            //helper property to check if files length > 0
            isLoaded(){
                return this.files.length > 0
            },
            isImage() {
                if(this.isLoaded)
                    return this.files[this.i].type === 'image'
            },
            currImg() {
                if (this.files.length === 0) {
                    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM88R8AApUByU2MEcEAAAAASUVORK5CYII='
                }
                return this.files[this.i].url
            }
        },
        created() {
            bus.$on('increment', this.increment)
            bus.$on('decrement', this.decrement)
            var that = this

            bus.$on('clicked', function (val) {
                that.i = val
            })
        }
    }
</script>
<style>
    .fullscreenimg {
        /* Full height */
        height: 100vh;
        width: 100vw;

        /* Center and scale the image nicely */
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        position: relative
    }

    .fullscreenimg2 {
        max-height: 100%;
        /* min-height: 100%; */
        width: auto;
        position: absolute;
        top: -100%;
        bottom: -100%;
        left: -100%;
        right: -100%;
        margin: auto;
    }

    .fullscreenvideo {
        height: 80%;
        position: absolute;
        top: -100%;
        bottom: -100%;
        left: -100%;
        right: -100%;
        margin: auto;
    }
</style>