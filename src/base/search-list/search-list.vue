<template>
  <div class="search-list-wrap">
    <ul>
      <li class="item" v-for="item in searches" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <i class="icon-delete" @click.stop="deleteItem(item)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      searches: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteItem(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable.scss";

  .search-list-wrap {
    .item {
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      .text {
        flex: 1;
        font-size: 14px;
        color: $color-text-l;
      }
      .icon-delete {
        margin-right: -10px;
        padding: 10px;
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
</style>
