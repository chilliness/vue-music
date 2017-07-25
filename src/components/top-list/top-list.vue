<template>
  <transition name="slide">
    <music-list :title="title" :bg-img="bgImg" :songs="songs" :rank="true"></music-list>
  </transition>
</template>

<script>
  import musicList from '../music-list/music-list.vue'
  import {mapGetters} from 'vuex'
  import {getMusicList} from '../../api/rank'
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
        return this.topList.topTitle
      },
      bgImg() {
        return this.topList.picUrl
      },
      ...mapGetters(['topList'])
    },
    created() {
      this._getMusicList(this.topList)
    },
    methods: {
      reformData(list) {
        let arr = []
        list.forEach((item) => {
          let musicData = item.data
          if (musicData.songid && musicData.albumid) {
            arr.push(createSong(musicData))
          }
        })
        return arr
      },
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code == ERR_OK) {
            this.songs = this.reformData(res.songlist)
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
