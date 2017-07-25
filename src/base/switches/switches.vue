<template>
  <ul class="switches-wrap">
    <li class="item" :class="{active: currentIndex == index}" v-for="(item, index) in switches"
        @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      switches: {
        type: Array,
        default() {
          return []
        }
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .switches-wrap {
    display: flex;
    align-items: center;
    width: 240px;
    margin: 0 auto;
    border: 1px solid $color-highlight-background;
    .item {
      flex: 1;
      text-align: center;
      padding: 8px;
      font-size: $font-size-medium;
      color: $color-text-d;
      &.active {
        color: $color-text;
        background: $color-highlight-background;
      }
    }
  }
</style>
