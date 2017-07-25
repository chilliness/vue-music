<template>
  <div class="rank-wrap" ref="rankWrap">
    <scroll class="scroll" :data="topList" ref="scroll">
      <ul>
        <li class="list-item" v-for="item in topList" @click="selectItem(item)">
          <img class="img" width="100" height="100" v-lazy="item.picUrl" alt="">
          <dl class="text">
            <dd class="title" v-if="index < 3" v-for="(song, index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </dd>
          </dl>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
    <loading v-show="!topList.length"></loading>
  </div>
</template>

<script>
  import {getTopList} from '../../api/rank'
  import {ERR_OK} from '../../api/config'
  import {playlistMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      this._getTopList()
    },
    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length ? '60px' : ''
        this.$refs.rankWrap.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item) {
        this.$router.push({path: `/rank/${item.id}`})
        this.setTopList(item)
      },
      _getTopList() {
        getTopList().then((res) => {
          if (res.code == ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .rank-wrap {
    position: absolute;
    left: 0;
    top: 88px;
    right: 0;
    bottom: 0;
    overflow: hidden;
    .scroll {
      height: 100%;
      font-size: $font-size-small;
      color: $color-text-d;
      overflow: hidden;
      .list-item {
        display: flex;
        align-items: center;
        height: 100px;
        margin: 0 20px;
        padding-top: 20px;
        overflow: hidden;
        &:last-child {
          padding-bottom: 20px;
        }
        .img {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          height: 100px;
          padding: 0 20px;
          overflow: hidden;
          background: $color-highlight-background;
          .title {
            height: 26px;
            line-height: 26px;
            @include dot;
          }
        }
      }
    }
  }
</style>
