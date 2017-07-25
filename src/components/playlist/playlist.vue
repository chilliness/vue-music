<template>
  <div class="playlist-wrap" v-show="showFlag" @click="toggleDisplay">
    <div class="list-box" @click.stop>
      <div class="list-header">
        <i class="icon" :class="iconMode" @click="changeMode"></i>
        <span class="text">{{modeText}}</span>
        <i class="icon-clear" @click="showConfirm"></i>
      </div>
      <scroll class="list-content" :data="sequenceList" ref="listContent">
        <ul>
          <li class="item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)"
              ref="item">
            <i class="current" :class="getCurrentIcon(item)"></i>
            <span class="text">{{item.name}}</span>
            <i class="icon" :class="getFavoriteIcon(item)" @click.stop="toggleFavorite(item)"></i>
            <i class="icon-delete" @click.stop="deleteOne(item)"></i>
          </li>
        </ul>
      </scroll>
      <div class="list-operate">
        <div class="add" @click="addSong">
          <i class="icon-add"></i>
          <span class="text">添加歌曲到队列</span>
        </div>
      </div>
      <div class="list-close" @click="toggleDisplay">
        <span>关闭</span>
      </div>
    </div>
    <confirm title="是否清空播放列表" btn-ok="清空" @confirm="confirmClear" ref="confirm"></confirm>
    <add-song ref="addSong"></add-song>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {playMode} from '../../common/js/config'
  import {playerMixin} from '../../common/js/mixin'
  import addSong from '../add-song/add-song.vue'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false
      }
    },
    computed: {
      modeText() {
        return this.playMode == playMode.sequence ? '顺序播放' : this.playMode == playMode.random ? '随机播放' : '单曲循环'
      }
    },
    methods: {
      addSong() {
        this.$refs.addSong.toggleDisplay()
      },
      showConfirm() {
        this.$refs.confirm.toggleDisplay()
      },
      confirmClear() {
        this.deleteSongList()
        this.toggleDisplay()
      },
      toggleDisplay() {
        this.showFlag = !this.showFlag
        if (this.showFlag) {
          this.$nextTick(() => {
            this.$refs.listContent.refresh()
            this.scrollToCurrent(this.currentSong)
          })
        }
      },
      getCurrentIcon(item) {
        if (this.currentSong.id == item.id) {
          return 'icon-play'
        }
        return ''
      },
      deleteOne(item) {
        this.deleteSong(item)
        if (!this.playlist.length) {
          this.toggleDisplay()
        }
      },
      selectItem(item, index) {
        if (this.playMode === playMode.random) {
          index = this.playlist.findIndex((song) => {
            return song.id == item.id
          })
        }
        this.setCurrentIndex(index)
      },
      scrollToCurrent(current) {
        let index = this.sequenceList.findIndex((song) => {
          return current.id == song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.item[index], 300)
      },
      ...mapActions(['deleteSong', 'deleteSongList'])
    },
    watch: {
      currentSong(val, oldVal) {
        if (!this.showFlag || val.id == oldVal.id) {
          return
        }
        this.scrollToCurrent(val)
      }
    },
    components: {
      addSong
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .playlist-wrap {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-box {
        transiton: all .3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-box {
        transfrom: translate3d(0, 100%, 0);
      }
    }
    .list-box {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        display: flex;
        align-items: center;
        position: relative;
        padding: 20px 30px 10px 20px;
        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .icon-clear {
          margin-right: -10px;
          padding: 10px;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme;
          }
          .text {
            flex: 1;
            @include dot;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .icon {
            margin-right: 5px;
            padding: 10px;
            font-size: $font-size-small;
            color: $color-theme;
          }
          .icon-favorite {
            color: #d53d10;
          }
          .icon-delete {
            margin-right: -10px;
            padding: 10px;
            font-size: $font-size-small;
            color: $color-theme;
          }
        }
      }
      .list-operate {
        width: 140px;
        margin: 20px auto 30px;
        .add {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        line-height: 50px;
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-text-l;
        background: $color-background;
      }
    }
  }
</style>
