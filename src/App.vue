<template>
  <div id="app" class="has-text-centered" tabindex="0" @keydown.right="rightkey" @keydown.left="leftkey" @keydown.esc="hide">
    <modal ref="modal" @hide="hide" :show="show" :files="files"></modal>
    <div class="hero is-primary is-bold">
      <div class="hero-body">
        <h1 class="title is-1">{{folder}}</h1>
        <!--<h2 class="subtitle is-2">imageinary</h2>-->
        <hr>
        <!-- <button class="button is-info is-outlined is-large" @click="download">Download all images</button> -->
      </div>
    </div>
    <div class="hero is-bold is-info">
      <div class="hero-body">
        <div class="columns is-multiline is-mobile is-centered">
          <template v-for="(file, key) in files">
            <div class="column card is-2-desktop is-3-tablet is-6-mobile">
              <image-card @modalimg="modalimg" key="file.url" :source="file.url" :index="key" :type="file.type"></image-card>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { bus } from './bus.js'
  import isVideo from 'is-video'
  import axios from 'axios'

  export default {
    name: 'app',
    data() {
      return {
        show: false,
        files: [],
        folder: ''
      }
    },
    mounted() {
      axios.get('data.json').then((res) => {
        this.files = res.data.files.map((x) => {
          if (isVideo(x)) {
            return {type: 'video', url: x}
          }
          return {type: 'image', url: x}
        })

        this.folder = res.data.folder;
      }).catch((err) => {
        console.error(err)
      })
    },
    methods: {
      modalimg(val) {
        bus.$emit('clicked', val)
        this.show = true
      },
      leftkey() {
        bus.$emit('decrement') //'modal' listens for these events on the bus!
      },
      rightkey() {
        bus.$emit('increment')
      },
      download() {

      },
      updateDB(file, val) {
        console.log(file + ": " + val + " stars")
      },
      hide() {
        this.show = false
      }
    }
  }
</script>
<style>
  .fix-footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.4);
    height: 5rem;
    padding: 1rem
  }
</style>