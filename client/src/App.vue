<template>
  <div id="app">
    <!-- Initial page content -->
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Collaborative Editor"/>

    <!-- User authentication component -->
    <UserAuth />

    <!-- Router view to render components based on route -->
    <router-view></router-view>
  </div>
</template>

<!--
  <template>
  <div id="app">
  <router-view></router-view>
  </div>
  </template>
-->

<script>
  import HelloWorld from './components/HelloWorld.vue'
  import UserAuth from './components/UserAuth.vue'

  export default {
    name: 'App',
    components: {
      HelloWorld,
      UserAuth
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
