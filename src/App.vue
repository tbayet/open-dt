<template>
  <v-app id="app">
    <AppBar />
    <v-container class="app__container">
      <router-view/>
    </v-container>
    <BottomNavigation />
  </v-app>
</template>

<script>
import AppBar from './layout/AppBar'
import BottomNavigation from './layout/BottomNavigation'

export default {
  components: {
    AppBar,
    BottomNavigation,
  },
}
</script>

<style>
#app {
  height: 100vh;
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-y: auto;
  margin: 0px;
  padding-top: 48px !important;
  height: calc(100vh - 56px) !important;
}
.app__container {
  height: 100%;
}
.page {
  min-height: 100%;
}
</style>
