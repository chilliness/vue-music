<template>
  <div class="scroll-wrap" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 3
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default() {
          return []
        }
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initScroll()
      })
    },
    methods: {
      initScroll() {
        if (!this.$refs.scroll) {
          return
        }

        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scroll, {
            probeType: this.probeType,
            click: this.click
          })

          if (this.listenScroll) {
            let _this = this
            this.scroll.on('scroll', (pos) => {
              _this.$emit('scroll', pos)
            })
          }

          if (this.pullup) {
            this.scroll.on('scrollEnd', () => {
              if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                this.$emit('scrollToEnd')
              }
            })
          }

          if (this.beforeScroll) {
            this.scroll.on('beforeScrollStart', () => {
              this.$emit('beforeScroll')
            })
          }
        } else {
          this.refresh()
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data: {
        handler() {
          this.$nextTick(() => {
            this.refresh()
          })
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss"></style>
