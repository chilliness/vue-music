<template>
  <div class="no-result-wrap">
    <div class="bg-img"></div>
    <p class="text">{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .no-result-wrap {
    text-align: center;
    .bg-img {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      @include bg("./no-result");
    }
    .text {
      margin-top: 30px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
</style>
