<template>
  <div class="header-bar-wrap">
    <div class="brand-bar">
      <span class="brand"></span>
      <h2 class="name">Chicken Music</h2>
      <router-link tag="i" class="icon icon-mine" :to="{name: 'user'}"></router-link>
    </div>
    <nav class="nav">
      <router-link class="item" :to="{name: 'recommend'}">
        <span class="text">推荐</span>
      </router-link>
      <router-link class="item" :to="{name: 'singer'}">
        <span class="text">歌手</span>
      </router-link>
      <router-link class="item" :to="{name: 'rank'}">
        <span class="text">排行</span>
      </router-link>
      <router-link class="item" :to="{name: 'search'}">
        <span class="text">搜索</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .header-bar-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 88px;
    .brand-bar {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 44px;
      color: $color-theme;
      .brand {
        width: 30px;
        height: 32px;
        margin-right: 9px;
        @include bg("./logo");
      }
      .name {
        font-size: 18px;
      }
      .icon {
        position: absolute;
        right: 0;
        top: 0;
        padding: 12px;
        font-size: 20px;
      }
    }
    .nav {
      display: flex;
      align-items: center;
      height: 44px;
      .item {
        flex: 1;
        line-height: 44px;
        text-align: center;
        font-size: 14px;
        color: $color-text-l;
        &.router-link-active {
          color: $color-theme;
          .text {
            border-bottom-color: $color-theme;
          }
        }
        .text {
          padding-bottom: 5px;
          border-bottom: 2px solid transparent;
        }
      }
    }
  }
</style>
