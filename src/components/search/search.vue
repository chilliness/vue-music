<template>
  <div class="search-wrap">
    <div class="search-box">
      <search-box class="search" @query="onQueryChange" ref="search"></search-box>
      <p></p>
    </div>
    <div class="shortcut-box" v-show="!query" ref="shortcutBox">
      <scroll class="shortcut" :data="shortCut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h2 class="title">热门搜索</h2>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">{{item.k}}</li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <div class="title">
              <span class="text">搜索历史</span>
              <i class="icon-clear" @click="showConfirm"></i>
            </div>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm title="是否清空所有搜索历史" btn-ok="清空" @confirm="clearSearchHistory" ref="confirm"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getHotKey} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import suggest from '../suggest/suggest.vue'
  import {mapActions} from 'vuex'
  import {playlistMixin, searchMixin} from '../../common/js/mixin'

  export default {
    mixins: [playlistMixin, searchMixin],
    data() {
      return {
        hotKey: []
      }
    },
    computed: {
      shortCut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.shortcutBox.style.bottom = bottom
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.shortcut.refresh()
        this.$refs.suggest.refresh()
      },
      showConfirm() {
        this.$refs.confirm.toggleDisplay()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code == ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      ...mapActions(['clearSearchHistory'])
    },
    watch: {
      query(val) {
        if (!val) {
          this.$nextTick(() => {
            this.$refs.shortcut.refresh()
          })
        }
      }
    },
    components: {
      suggest
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .search-wrap {
    position: absolute;
    left: 0;
    top: 88px;
    right: 0;
    .search-box {
      margin: 20px;
    }
    .shortcut-box {
      position: fixed;
      left: 0;
      top: 178px;
      right: 0;
      bottom: 0;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 20px 20px;
          font-size: 0;
          .title {
            margin-bottom: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            font-size: $font-size-medium;
            color: $color-text-d;
            border-radius: 6px;
            background: $color-highlight-background;
          }
        }
        .search-history {
          position: relative;
          margin: 0 20px;
          .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            font-size: $font-size-medium;
            color: $color-text-l;
            .text {
              felx: 1;
            }
            .icon-clear {
              margin-right: -10px;
              padding: 10px;
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
    .search-result {
      position: fixed;
      left: 0;
      top: 178px;
      right: 0;
      bottom: 0;
    }
  }
</style>
