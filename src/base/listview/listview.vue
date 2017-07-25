<template>
  <scroll class="listview-wrap" @scroll="scroll" :listen-scroll="true" :data="list" ref="listviewWrap">
    <ol>
      <li class="singer-list" v-for="group in list" ref="singerList">
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li class="item" v-for="item in group.items" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ol>
    <h2 class="fixed-title" v-for="(item, index) in list" v-show="current == index && scrollY < 0" ref="fixedTitle">
      {{item.title}}</h2>
    <div class="kinds-list" v-show="list.length">
      <ol @touchstart.stop.prevent="toStart"
          @touchmove.stop.prevent="toMove"
          @touchend="seen = !seen">
        <li class="item" :class="{active: current == index}" v-for="(item, index) in kinds" :data-index="index"
            v-text="item"></li>
      </ol>
    </div>
    <div class="tips" v-show="seen">{{kinds[current]}}</div>
    <loading v-show="!list.length"></loading>
  </scroll>
</template>

<script>
  import {getData, prefixStyle} from '../../common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGTH = 30
  let transform = prefixStyle('transform')

  export default {
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        current: 0,
        scrollY: 0,
        seen: false
      }
    },
    computed: {
      kinds() {
        return this.list.map((item) => {
          return item.title.substr(0, 1)
        })
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      selectItem(obj) {
        this.$emit('select', obj)
      },
      toStart(e) {
        let index = getData(e.target, 'index')
        this.seen = !this.seen
        this.touch.y = e.touches[0].pageY
        this.touch.num = index | 0
        this.current = index
        this._scrollTo(this.current)
      },
      toMove(e) {
        let diff = (e.touches[0].pageY - this.touch.y) / ANCHOR_HEIGHT | 0
        this.touch.cur = this.touch.num + diff
        // 过界处理
        this.current = this.touch.cur < 0 ? 0 : Math.min(this.touch.cur, this.list.length - 1)
        this._scrollTo(this.current)
      },
      refresh() {
        this.$refs.listviewWrap.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
        let index = this.arr.findIndex((item) => {
          return -pos.y <= item
        })
        this.current = index - 1
        // 记录当前移动和目标点还有多远
        let temp = Math.max(TITLE_HEIGTH - (pos.y + this.arr[index]), 0)
        // 解决滚动时切换路由bug
        if (!this.$refs.fixedTitle[this.current] || isNaN(temp)) {
          return
        }
        this.$refs.fixedTitle[this.current].style[transform] = `translate3d(0, -${temp}px, 0)`
      },
      calcList() {
        let lis = this.$refs.singerList
        let height = 0
        this.arr = []
        lis.forEach((item) => {
          height += item.clientHeight
          this.arr.push(height)
        })
        // 设置开始为无穷小，结束为无穷大
        this.arr.unshift(-Infinity)
        this.arr.splice(this.arr.length - 1, 1, Infinity)
      },
      _scrollTo(index) {
        this.$refs.listviewWrap.scrollToElement(this.$refs.singerList[index], 0)
      }
    },
    watch: {
      list: {
        handler() {
          this.$nextTick(() => {
            this.calcList()
          })
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .listview-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .singer-list {
      padding-bottom: 30px;
      .title {
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
    .fixed-title {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .kinds-list {
      position: absolute;
      right: 0;
      top: 50%;
      width: 20px;
      text-align: center;
      padding: 20px 0;
      font-size: $font-size-small;
      color: $color-text-l;
      border-radius: 10px;
      transform: translateY(-50%);
      background: $color-background-d;
      .item {
        line-height: 18px;
        &.active {
          color: $color-theme
        }
      }
    }
    .tips {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      margin: auto;
      font-size: 30px;
      color: $color-text-l;
      border-radius: 50%;
      background: $color-background-d;
    }
  }
</style>
