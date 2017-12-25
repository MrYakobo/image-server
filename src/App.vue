<template>
  <div id="app" class="has-text-centered is-clipped" tabindex="0" @keydown.right="rightkey" @keydown.left="leftkey" @keydown.esc="hide">
    <modal ref="modal" @hide="hide" :show="show" :files="files"></modal>
    <div class="hero is-primary is-bold">
      <div class="hero-body">
      <div class="columns">
      <div class="column">
        <a class="button is-light" @click="pathChange(Math.max(path.length-2, 0))">
          <i class="fa fa-arrow-left"></i>
        </a>
        </div>
        <div class="column">
          <a v-for="(link,i) in path" class="is-size-1" style="margin:1px" @click="pathChange(i)">{{link}}</a>
          </div>
        </div>
        <hr>
      </div>
    </div>
    <div class="columns is-multiline is-mobile is-centered">
      <template v-for="(folder, key) in folders">
        <div class="column card is-2-desktop is-3-tablet is-6-mobile" style="background:#d2d2d2">
          <!--
          <button class="button is-large is-light" @click="path.push(folder)">
            <span class="icon is-large">
              <i class="fa fa-3x fa-folder-open light-text" aria-hidden="true"></i>
            </span>
            -->
            <image-card style="border: 1px solid #000" @modalimg="path.push(folder)" :key="folder" :source="folderPreview(folder)" type="image"></image-card>
            <p class="subtitle is-3"> {{folder}}</p>
          </button>
        </div>
      </template>
      <template v-for="(file, key) in files">
        <div class="column card is-2-desktop is-3-tablet is-6-mobile">
          <image-card @modalimg="modalimg" :key="file.url" :source="file.url" :index="key" :type="file.type"></image-card>
        </div>
      </template>
    </div>
  </div>
  </div>
</template>

<script>
  import { bus } from './bus.js'
  import axios from 'axios'

  export default {
    name: 'app',
    data() {
      return {
        show: false,
        files: [],
        folders: [],
        path: []
      }
    },
    computed: {
      // pathLinks(){
      //   return this.folder.split('/').map(f=>f+'/')
      // }
    },
    mounted() {
      this.path = ['/']
    },
    methods: {
      folderPreview(f){
        return f+'/folder.png'
      },
      pathChange(i){
        this.path = this.path.slice(0, i+1)
      },
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
      updatedb(file, val) {
        console.log(file + ": " + val + " stars")
      },
      hide() {
        this.show = false
      }
    },
    watch: {
      path(){
        var path = this.path.join('/')

        axios.get('data.json', {params: {path: path}}).then((res) => {
          if(res.err){
            this.path = res.err
          }
          else{
            this.files = res.data.files
            this.folders = res.data.folders
          }
        }).catch((err) => {
          console.error(err)
        })
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