<template>
  <scroll class="suggest-wrap" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore"
          @beforeScroll="listScroll" ref="suggestWrap">
    <ul class="suggest-list">
      <li class="item" v-for="item in result" @click="selectItem(item)">
        <i class="icon" :class="getIconCls(item)"></i>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <li v-show="hasMore">
        <loading :online="true" title=""></loading>
      </li>
    </ul>
    <div class="no-result-box" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
  import {search} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'
  import Singer from '../../common/js/singer'
  import {mapMutations, mapActions} from 'vuex'

  const TYPE_SINGER = 'singer'
  const PERPAGE = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        hasMore: true,
        pullup: true,
        beforeScroll: true
      }
    },
    methods: {
      selectItem(item) {
        if (item.type == TYPE_SINGER) {
          let singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      getDisplayName(item) {
        return item.type == TYPE_SINGER ? item.singername : `${item.name}-${item.singer}`
      },
      getIconCls(item) {
        return item.type == TYPE_SINGER ? 'icon-mine' : 'icon-music'
      },
      reformData(list) {
        let arr = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            arr.push(createSong(musicData))
          }
        })
        return arr
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page += 1
        search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code == ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      listScroll() {
        this.$emit('listScroll')
      },
      refresh() {
        this.$refs.suggestWrap.refresh()
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions(['insertSong']),
      _search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggestWrap.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code == ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data) {
        let song = data.song
        if (!song.list.length || (song.curnum + song.curpage * PERPAGE) >= song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data) {
        let arr = []
        if (data.zhida && data.zhida.singerid) {
          arr.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          arr = arr.concat(this.reformData(data.song.list))
        }
        return arr
      }
    },
    watch: {
      query() {
        this._search()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .suggest-wrap {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          font-size: 14px;
          color: $color-text-d;
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include dot;
          }
        }
      }
    }
    .no-result-box {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
    }
  }
</style>
