<template>
  <transition name="drop">
    <div class="top-tip-wrap" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(this.hide, 2000)
      },
      hide() {
        this.showFlag = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .top-tip-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background: $color-dialog-background;
    &.drop-enter-active, &.drop-leave-active {
      transition: all .3s;
    }
    &.drop-enter, &.drop-leave-to {
      transform: translate3d(0, -100%, 0)
    }
  }
</style>
