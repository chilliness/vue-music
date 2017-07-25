<template>
  <div class="singer-wrap" ref="singerWrap">
    <listview @select="selectSinger" :list="singers" ref="listview"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import {mapMutations} from 'vuex'
  import Singer from '../../common/js/singer'
  import {playlistMixin} from '../../common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_LEN = 10

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singerWrap.style.bottom = bottom
        this.$refs.listview.refresh()
      },
      selectSinger(obj) {
        this.$router.push({path: `/singer/${obj.id}`})
        this.setSinger(obj)
      },
      reformData(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 将数据处理分类
        let [hot, others] = [[], []]
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            others.push(val)
          } else if (val.title == HOT_NAME) {
            hot.push(val)
          }
        }
        // 将others数据进行排序
        others.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
        return hot.concat(others)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code == ERR_OK) {
            this.singers = this.reformData(res.data.list)
          }
        })
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="scss">
  .singer-wrap {
    position: absolute;
    left: 0;
    top: 88px;
    right: 0;
    bottom: 0;
  }
</style>
