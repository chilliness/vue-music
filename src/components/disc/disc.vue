<template>
  <transition name="slide">
    <music-list :title="title" :bg-img="bgImg" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import musicList from '../music-list/music-list.vue'
  import {mapGetters} from 'vuex'
  import {getSongList} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImg() {
        return this.disc.imgurl
      },
      ...mapGetters(['disc'])
    },
    created() {
      this._getSongList()
    },
    methods: {
      reformData(list) {
        let arr = []
        list.forEach((item) => {
          if (item.songid && item.albumid) {
            arr.push(createSong(item))
          }
        })
        return arr
      },
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code == ERR_OK) {
            this.songs = this.reformData(res.cdlist[0].songlist)
          }
        })
      }
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="scss">
  .slide-enter-active, .slide-leave-active {
    transition: all .3s ease;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
