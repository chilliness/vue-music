<template>
  <div class="slider-wrap" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentIndex == index}" v-for="(item, index) in dotNum"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {addClass} from '../../common/js/dom'

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dotNum: 0,
        currentIndex: 0
      }
    },
    mounted() {
      setTimeout(() => {
        this._setWidth()
        this._initSlider()
        if (this.loop) {
          this._play()
        }
      }, 300)
      window.addEventListener('resize', () => {
        if (this.slider) {
          this._setWidth(true)
          this.slider.refresh()
        }
      })
    },
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      _setWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        if (!isResize) {
          // 为dotNum赋值
          this.dotNum = this.children.length
        }
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth

        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _play() {
        let index = this.currentIndex + 1
        if (this.loop) {
          index += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(index, 0, 400)
        }, this.interval)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          click: true
        })
        // 监听滚动开始事件
        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
        // 监听滚动结束事件
        this.slider.on('scrollEnd', () => {
          let index = this.slider.getCurrentPage().pageX
          if (this.loop) {
            index -= 1
          }
          this.currentIndex = index
          if (this.autoPlay) {
            this._play()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .slider-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    .slider-group {
      font-size: 0;
      white-space: nowrap;
      .slider-item {
        display: inline-block;
        text-align: center;
        overflow: hidden;
        a, img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
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
  }
</style>
