<template>
  <div class="song-list-wrap">
    <ul>
      <li class="item" @click="selectItem(item, index)" v-for="(item, index) in songs">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="info">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectItem(item, index) {
        this.$emit('select', item, index)
      },
      getDesc(obj) {
        return `${obj.singer} · ${obj.album}`
      },
      getRankCls(index) {
        return index < 3 ? `icon icon${index}` : 'text'
      },
      getRankText(index) {
        return index < 3 ? '' : index + 1
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .song-list-wrap {
    .item {
      display: flex;
      align-items: center;
      height: 64px;
      font-size: $font-size-medium;
      .rank {
        display: flex;
        align-items: center;
        flex: 0 0 25px;
        width: 25px;
        text-align: center;
        margin-right: 30px;
        .icon {
          width: 25px;
          height: 25px;
          background-size: contain;
          &.icon0 {
            @include bg("./first");
          }
          &.icon1 {
            @include bg("./second");
          }
          &.icon2 {
            @include bg("./third");
          }
        }
        .text {
          width: 25px;
          height: 25px;
          line-height: 25px;
          font-size: $font-size-large;
          color: $color-theme;
        }
      }
      .info {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          @include dot;
          color: $color-text;
        }
        .desc {
          @include dot;
          margin-top: 4px;
          color: $color-text-d;
        }
      }
    }
  }
</style>
