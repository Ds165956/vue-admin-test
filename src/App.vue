<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  data () {
    return {
      num: 6
    }
  },
  methods: {
    handleChange (value) {
      console.log(value)
    }
  }
}
</script>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
