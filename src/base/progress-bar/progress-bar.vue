<template>
  <div class="percent-bar-wrap">
    <div class="line-box" @click.stop="toChange" ref="lineBox">
      <div class="line" ref="line"></div>
      <div class="dot"
           @touchstart.prevent="toStart"
           @touchmove.prevent="toMove"
           @touchend="toEnd" ref="dot"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      percent: Number,
      default: 0
    },
    created() {
      this.touch = {}
    },
    methods: {
      toChange(e) {
        let lineBox = this.$refs.lineBox
        this.touch.w = lineBox.clientWidth
        this.touch.l = lineBox.getBoundingClientRect().left
        this.touch.diff = (e.pageX - this.touch.l) / this.touch.w
        this._setOffset(this.touch.diff)
        this.$emit('changed', this.touch.diff)
      },
      toStart() {
        let lineBox = this.$refs.lineBox
        this.touch.w = lineBox.clientWidth
        this.touch.l = lineBox.getBoundingClientRect().left
      },
      toMove(e) {
        this.touch.flag = true
        this.touch.diff = (e.touches[0].pageX - this.touch.l) / this.touch.w
        if (this.touch.diff < 0) {
          this.touch.diff = 0
        } else if (this.touch.diff > 1) {
          this.touch.diff = 1
        }
        this._setOffset(this.touch.diff)
      },
      toEnd() {
        this.touch.flag = false
        this.$emit('changed', this.touch.diff)
      },
      _setOffset(percent) {
        // 防止溢出bug
        if (percent > 1) {
          percent = 1
        }
        this.$refs.line.style.width = `${percent * 100}%`
        this.$refs.dot.style.left = `${percent * 100}%`
      }
    },
    watch: {
      percent(val) {
        if (!this.touch.flag) {
          this._setOffset(val)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .percent-bar-wrap {
    display: flex;
    align-items: center;
    height: 30px;
    .line-box {
      position: relative;
      width: 100%;
      height: 4px;
      background: rgba(0, 0, 0, .3);
      .line {
        width: 0;
        height: 100%;
        background: $color-theme;
      }
      .dot {
        position: absolute;
        left: 0;
        top: -6px;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        transform: translateX(-8px);
        background: $color-theme;
        box-sizing: border-box;
      }
    }
  }
</style>
