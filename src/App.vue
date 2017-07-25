<template>
  <div id="app">
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import tab from './components/header-bar/header-bar.vue'
  import player from './components/player/player.vue'

  export default {
    components: {
      tab,
      player
    }
  }
</script>

<style></style>
