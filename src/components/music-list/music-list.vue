<template>
  <div class="music-list-wrap">
    <div class="title-bar">
      <div class="bg-layer" :style="{backgroundImage: `url(${bgImg})`}" ref="bgLayer"></div>
      <h2 class="title" v-html="title"></h2>
      <i class="icon icon-back" @click="$router.back()"></i>
    </div>
    <div class="bg-img" :style="{backgroundImage: `url(${bgImg})`}" ref="bgImg">
      <div class="filter">
        <div class="btn" v-show="songs.length" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <scroll class="scroll" :data="songs" :listenScroll="true" @scroll="scroll" ref="scroll">
      <div class="song-box">
        <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
      </div>
    </scroll>
    <loading v-show="!songs.length"></loading>
  </div>
</template>

<script>
  import {prefixStyle} from '../../common/js/dom'
  import {mapActions} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'

  let transform = prefixStyle('transform')

  export default {
    mixins: [playlistMixin],
    props: {
      bgImg: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    mounted() {
      let oScroll = this.$refs.scroll.$el
      let obgImg = this.$refs.bgImg
      oScroll.style.top = `${obgImg.clientHeight}px`
      // 解决改变浏览器窗口页面布局bug
      window.addEventListener('resize', () => {
        oScroll.style.top = `${obgImg.clientHeight}px`
      })
    },
    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item, index) {
        this.selectPlay({list: this.songs, index})
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      random() {
        this.randomPlay({list: this.songs})
      },
      ...mapActions(['selectPlay', 'randomPlay'])
    },
    watch: {
      scrollY(val) {
        let scale = 1
        let precent = val / this.$refs.bgImg.clientHeight
        if (val > 0) {
          scale += precent
        }
        this.$refs.bgLayer.style[transform] = `scale(${scale})`
        this.$refs.bgImg.style[transform] = `scale(${scale})`
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .music-list-wrap {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
    .title-bar {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 40px;
      overflow: hidden;
      transform-origin: top;
      background-size: cover;
      .bg-layer {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        transform-origin: top;
        background-size: cover;
      }
      .title {
        position: relative;
        line-height: 40px;
        text-align: center;
        padding: 0 40px;
        @include dot;
        font-size: $font-size-large;
        color: $color-text;
        background: rgba(7, 17, 27, .4);
      }
      .icon {
        position: absolute;
        left: 0;
        top: 0;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .bg-img {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .filter {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(7, 17, 27, .4);
        .btn {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          bottom: 20px;
          left: 50%;
          width: 135px;
          padding: 7px 0;
          color: $color-theme;
          border: 1px solid $color-theme;
          border-radius: 100px;
          transform: translateX(-50%);
          box-sizing: border-box;
          .icon-play {
            margin-right: 6px;
            font-size: $font-size-medium-x;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
    }
    .scroll {
      position: fixed;
      left: 0;
      bottom: 0;
      right: 0;
      .song-box {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
