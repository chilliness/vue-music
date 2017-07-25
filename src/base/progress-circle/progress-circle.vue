<template>
  <div class="progress-circle-wrap">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle bg" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="circle propress-bar" r="50" cx="50" cy="50" fill="transparent"
              :stroke-dasharray="dashArr"
              :stroke-dashoffset="dashArr * (1 - percent)"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dashArr: Math.PI * 100
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .progress-circle-wrap {
    position: relative;
    .circle {
      stroke-width: 8px;
      transform-origin: center;
      &.bg {
        stroke: $color-theme-d;
        transform: scale(0.9);
      }
      &.propress-bar {
        stroke: $color-theme;
        transform: scale(0.9) rotate(-90deg);
      }
    }
  }
</style>
