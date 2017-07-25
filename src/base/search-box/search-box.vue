<template>
  <div class="sarch-box-wrap">
    <i class="icon icon-search"></i>
    <input class="search" type="text" :placeholder="placeholder" v-model="query" ref="search">
    <i class="icon icon-dismiss" v-show="query" @click="query = ''"></i>
  </div>
</template>

<script>
  import {debounce} from '../../common/js/until'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    created() {
      this.$watch('query', debounce((val) => {
        this.$emit('query', val)
      }, 200))
    },
    methods: {
      setQuery(query) {
        this.query = query
      },
      blur() {
        this.$refs.search.blur()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .sarch-box-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 0 6px;
    border-radius: 6px;
    background: $color-highlight-background;
    box-sizing: border-box;
    .icon {
      color: $color-background;
    }
    .icon-search {
      font-size: 24px;
    }
    .search {
      flex: 1;
      display: flex;
      align-items: center;
      height: 18px;
      margin: 0 5px;
      font-size: $font-size-medium;
      color: $color-text;
      background: $color-highlight-background;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
    }
  }
</style>
