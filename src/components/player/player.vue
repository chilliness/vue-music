<template>
  <div class="player-wrap" v-show="playlist.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="bg" :style="{backgroundImage: `url(${this.currentSong.image})`}"></div>
        <div class="top">
          <h2 class="title" v-html="currentSong.name"></h2>
          <i class="icon icon-back" @click="back"></i>
          <h3 class="caption" v-html="currentSong.singer"></h3>
        </div>
        <div class="middle"
             @touchstart.prevent="toStart"
             @touchmove.prevent="toMove"
             @touchend="toEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-box" ref="cdBox">
              <img class="cd play" :class="{pause: !playing}" :src="currentSong.image" alt="">
            </div>
            <p class="playing-lyric">{{playingLyric}}</p>
          </div>
          <scroll class="middle-r" :data="currentLyric&&currentLyric.lines" ref="middleR">
            <div class="playing-lyric">
              <div v-if="currentLyric">
                <p class="text"
                   :class="{active: currentLineNum == index}"
                   v-for="(item, index) in currentLyric.lines"
                   ref="playingLyric">
                  {{item.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-box">
            <span class="dot" :class="{active: currentShow == 'cd'}"></span>
            <span class="dot" :class="{active: currentShow == 'lyric'}"></span>
          </div>
          <div class="progress-box">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar">
              <progress-bar :percent="percent" @changed="changeTime"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="player-bar">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <i class="icon icon-prev" :class="{disabled: !songReady}" @click="prev"></i>
            <i class="icon icon-pause" :class="[{'icon-play': !playing}, {disabled: !songReady}]"
               @click="togglePlay"></i>
            <i class="icon icon-next" :class="{disabled: !songReady}" @click="next"></i>
            <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="open" v-show="!fullScreen && fullScreen != null">
        <img width="40" height="40" class="cd play" :class="{pause: !playing}" :src="currentSong.image" alt="">
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i class="icon icon-play-mini" :class="{'icon-pause-mini': playing}" @click.stop="togglePlay"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio :src="currentSong.url"
           @play="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end" ref="audio"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from '../../common/js/dom'
  import {playMode} from '../../common/js/config'
  import Lyric from 'lyric-parser'
  import playlist from '../playlist/playlist.vue'
  import {playerMixin} from '../../common/js/mixin'

  let transform = prefixStyle('transform')
  let transitionDuration = prefixStyle('transitionDuration')

  export default {
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        percent: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    computed: {
      ...mapGetters(['fullScreen', 'playing', 'currentIndex'])
    },
    created() {
      this.touch = {}
    },
    methods: {
      showPlaylist() {
        this.$refs.playlist.toggleDisplay()
      },
      toStart(e) {
        this.touch.init = true
        this.touch.x = e.touches[0].pageX
        this.touch.y = e.touches[0].pageY
      },
      toMove(e) {
        if (!this.touch.init) {
          return
        }
        this.touch.diffX = e.touches[0].pageX - this.touch.x
        this.touch.diffY = e.touches[0].pageY - this.touch.y
        if (Math.abs(this.touch.diffY) > Math.abs(this.touch.diffX)) {
          return
        }
        let left = this.currentShow == 'cd' ? 0 : -window.innerWidth
        let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + this.touch.diffX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.middleR.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.middleR.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      toEnd() {
        if (Math.abs(this.touch.diffY) > Math.abs(this.touch.diffX)) {
          return
        }
        this.touch.init = false
        let offsetWidth
        let opacity
        if (this.currentShow == 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.middleR.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.middleR.$el.style[transitionDuration] = '300ms'
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = '300ms'
      },
      getLyric() {
        this.currentSong.getLyric().then((res) => {
          if (this.currentSong.lyric != res) {
            return
          }
          this.currentLyric = new Lyric(res, this.handleLyric)
          this.playing && this.currentLyric.play()
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.playingLyric[lineNum - 5]
          this.$refs.middleR.scrollToElement(lineEl, 300)
        } else {
          this.$refs.middleR.scrollTo(0, 0, 300)
        }
        this.playingLyric = txt
      },
      enter(el, done) {
        let {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: 'translate3d(0, 0, 0) scale(1.1)'
          },
          100: {
            transform: 'translate3d(0, 0, 0) scale(1)'
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdBox, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdBox.style.animation = ''
      },
      leave(el, done) {
        let {x, y, scale} = this._getPosAndScale()
        this.$refs.cdBox.style.transition = 'all .4s'
        this.$refs.cdBox.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdBox.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdBox.style.transition = ''
        this.$refs.cdBox.style[transform] = ''
      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      prev() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length == 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1
          if (index == -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
        }
        this.songReady = false
      },
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length == 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index == this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
        }
        this.songReady = false
      },
      ready() {
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      error() {
        this.songReady = true
      },
      end() {
        if (this.playMode == playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.setPlaying(true)
        if (this.currentLyric) {
          this.currentLyric.seek()
        }
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
        this.percent = e.target.currentTime / this.currentSong.duration
      },
      changeTime(percent) {
        let temp = this.currentSong.duration * percent
        this.$refs.audio.currentTime = temp
        if (!this.playing) {
          this.setPlaying(true)
        }
        if (this.currentLyric) {
          this.currentLyric.seek(temp * 1000)
        }
      },
      togglePlay() {
        if (!this.songReady) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
        this.setPlaying(!this.playing)
      },
      format(interval) {
        interval = interval | 0
        let m = (interval / 60 | 0).toString().padStart(2, '0')
        let s = (interval % 60).toString().padStart(2, '0')
        return `${m}:${s}`
      },
      _getPosAndScale() {
        let targetWidth = 40
        let paddingLeft = 40
        let paddingTop = 80
        let paddingBottom = 30
        let width = window.innerWidth * 0.8
        let scale = targetWidth / width
        let x = -(window.innerWidth / 2 - paddingLeft)
        let y = window.innerHeight - paddingBottom - paddingTop - width / 2
        return {x, y, scale}
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
      }),
      ...mapActions(['savePlayHistory'])
    },
    watch: {
      currentSong: {
        handler(val, oldVal) {
          // val.id == undefined解决删除完列表bug
          if (!val.id) {
            return
          }
          if (val.id == oldVal.id) {
            return
          }
          // 解决来回切歌定时器bug
          if (this.currentLyric) {
            this.currentLyric.stop()
          }
          // 解决微信后台切换到前台bug
          this.timer && clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$refs.audio.play()
            // 解决暂停状态切换歌曲状态不同步bug
            if (!this.playing) {
              this.setPlaying(true)
            }
            this.getLyric()
          }, 1000)
        },
        deep: true
      },
      playing(val) {
        this.$nextTick(() => {
          let audio = this.$refs.audio
          val ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      playlist
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .player-wrap {
    .normal-player {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: $color-background;
      .bg {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: .6;
        filter: blur(20px);
        background: no-repeat center;
        background-size: cover;
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .title {
          width: 70%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin: 0 auto;
          font-size: $font-size-large;
          color: $color-text;
          @include dot;
        }
        .icon {
          position: absolute;
          left: 6px;
          top: 0;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .caption {
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
          @include dot;
        }
      }
      .middle {
        position: fixed;
        left: 0;
        top: 80px;
        right: 0;
        bottom: 170px;
        font-size: 0;
        white-space: nowrap;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          .cd-box {
            position: relative;
            width: 80%;
            height: 0;
            padding-top: 80%;
            margin: 0 auto;
            .cd {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border: 10px solid rgba(255, 255, 255, .1);
              border-radius: 50%;
              box-sizing: border-box;
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
                animation-play-state: paused;
              }
            }
          }
          .playing-lyric {
            width: 80%;
            height: 20px;
            line-height: 20px;
            text-align: center;
            margin: 30px auto 0;
            font-size: $font-size-medium;
            color: $color-text-l;
            @include dot;
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .playing-lyric {
            width: 80%;
            margin: 0 auto;
            text-align: center;
            .text {
              line-height: 32px;
              font-size: $font-size-medium;
              color: $color-text-l;
              @include dot;
              &.active {
                color: $color-text;
              }
            }
          }
        }
      }
      .bottom {
        position: absolute;
        left: 10%;
        right: 10%;
        bottom: 50px;
        .dot-box {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            width: 20px;
            height: 8px;
            &:after {
              content: "";
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: $color-text-l;
              transition: all .15s;
            }
            &.active:after {
              width: 20px;
              border-radius: 5px;
            }
          }
        }
        .progress-box {
          display: flex;
          align-items: center;
          padding: 10px 0;
          .time {
            display: flex;
            align-items: center;
            flex: 0 0 30px;
            width: 30px;
            height: 30px;
            font-size: $font-size-small;
            color: $color-text;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar {
            flex: 1;
            margin: 0 12px;
          }
        }
        .player-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 30px;
          .icon {
            color: $color-theme;
            &.disabled {
              color: $color-theme-d;
            }
          }
          .icon-pause {
            font-size: 40px;
          }
          .icon-favorite {
            color: #d53d10;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .4s;
        .bg {
          transition: all .4s;
        }
        .top, .bottom {
          transition: all .4s cubic-bezier(.86, .18, .82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .bg {
          opacity: 0;
        }
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      padding-left: 20px;
      height: 60px;
      background: $color-highlight-background;
      &.mini-enter-active, &.mini-leave-active {
        transition: all .4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
      .cd {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          height: 20px;
          margin-bottom: 2px;
          @include dot;
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          height: 20px;
          @include dot;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .control {
        position: relative;
        flex: 0 0 30px;
        width: 30px;
        height: 30px;
        margin: 0 10px;
        .icon {
          font-size: 30px;
          color: $color-theme-d;
        }
        .icon-play-mini {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 32px;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
