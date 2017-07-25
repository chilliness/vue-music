<template>
  <transition name="fade">
    <div class="confirm-wrap" v-show="showFlag" @click.stop>
      <div class="confirm">
        <p class="title">{{title}}</p>
        <div class="operate">
          <span class="btn btn-cancel" @click="cancel">{{btnCancel}}</span>
          <span class="btn btn-ok" @click="confirm">{{btnOk}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      btnCancel: {
        type: String,
        default: '取消'
      },
      btnOk: {
        type: String,
        default: '确定'
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      toggleDisplay() {
        this.showFlag = !this.showFlag
      },
      cancel() {
        this.toggleDisplay()
        this.$emit('cancel')
      },
      confirm() {
        this.toggleDisplay()
        this.$emit('confirm')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .confirm-wrap {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background: $color-background-d;
    &.fade-enter-active {
      transition: all .3s;
    }
    &.fade-enter {
      opacity: 0;
      transform: scale(1.2);
    }
    .confirm {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 270px;
      border-radius: 13px;
      transform: translate3d(-50%, -50%, 0);
      background: $color-highlight-background;
      .title {
        line-height: 22px;
        text-align: center;
        padding: 19px 15px;
        font-size: $font-size-large;
        color: $color-text-l;
      }
      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text-d;
        .btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid $color-background-d;
        }
        .btn-cancel {
          border-right: 1px solid $color-background-d;
        }
      }
    }
  }
</style>
