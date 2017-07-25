<template>
  <div class="loading-wrap" :class="{online: online}">
    <img class="img" width="24" height="24" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      online: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .loading-wrap {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    &.online {
      position: static;
    }
    .desc {
      height: 20px;
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l
    }
  }
</style>
