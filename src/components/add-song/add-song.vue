<template>
  <transition name="slide">
    <div class="add-song-wrap" v-show="showFlag" @click.stop>
      <div class="header">
        <h2 class="title">添加歌曲到列表</h2>
        <i class="icon-close" @click="toggleDisplay"></i>
      </div>
      <div class="search-box">
        <search-box @query="onQueryChange" placeholder="搜索歌曲" ref="search"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-box">
          <scroll class="list-scroll" :data="playHistory" v-if="currentIndex == 0" ref="listScroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" :data="searchHistory" v-if="currentIndex == 1" ref="listScroll">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
  import suggest from '../suggest/suggest.vue'
  import {searchMixin} from '../../common/js/mixin'
  import {mapGetters, mapActions} from 'vuex'
  import Song from '../../common/js/song'

  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ],
        currentIndex: 0
      }
    },
    computed: {
      ...mapGetters(['playHistory'])
    },
    methods: {
      switchItem(index) {
        this.currentIndex = index
      },
      toggleDisplay() {
        this.showFlag = !this.showFlag
        if (this.showFlag) {
          this.$nextTick(() => {
            this.$refs.listScroll.refresh()
          })
        }
      },
      onQueryChange(query) {
        this.query = query
        // 解决点击搜索歌曲后无法滚动bug
        this.$nextTick(() => {
          this.$refs.listScroll.refresh()
        })
      },
      selectSuggest() {
        this.saveSearch()
        this.showTip()
      },
      selectSong(song, index) {
        if (index != 0) {
          this.insertSong(new Song(song))
          this.showTip()
        }
      },
      showTip() {
        this.$refs.topTip.show()
      },
      ...mapActions(['insertSong'])
    },
    components: {
      suggest
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .add-song-wrap {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all .3s
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0)
    }
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .title {
        line-height: 44px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .icon-close {
        position: absolute;
        right: 8px;
        top: 0;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
    .search-box {
      margin: 20px;
    }
    .shortcut {
      .list-box {
        position: absolute;
        left: 0;
        top: 165px;
        right: 0;
        bottom: 0;
        .list-scroll {
          height: 100%;
          overflow: hidden;
          .list-inner {
            padding: 20px 30px;
          }
        }
      }
    }
    .search-result {
      position: fixed;
      left: 0;
      top: 124px;
      right: 0;
      bottom: 0;
    }
    .tip-title {
      text-align: center;
      padding: 18px 0;
      font-size: 0;
      .icon-ok {
        margin-right: 4px;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .text {
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
</style>
