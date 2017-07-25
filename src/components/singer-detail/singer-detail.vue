<template>
  <transition name="slide">
    <music-list :songs="songs" :title="singer.name" :bg-img="singer.avatar"></music-list>
  </transition>
</template>

<script>
  import musicList from '../music-list/music-list.vue'
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters(['singer'])
    },
    created() {
      this._getDetail()
    },
    methods: {
      reformData(list) {
        let arr = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            arr.push(createSong(musicData))
          }
        })
        return arr
      },
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push({name: 'singer'})
        } else {
          getSingerDetail(this.singer.id).then((res) => {
            if (res.code == ERR_OK) {
              this.songs = this.reformData(res.data.list)
            }
          })
        }
      }
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="scss">
  .slide-enter-active, .slide-leave-active {
    transition: all .3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
