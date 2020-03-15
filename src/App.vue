<template>
  <v-app id="app">
    <AppBar />
    <div class="app__container">
      <router-view/>
      <BottomNavigation />
    </div>
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
  background-color: #272727;
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
}
.app__container {
  background-color: white;
  margin-top: 48px !important;
}
</style>
