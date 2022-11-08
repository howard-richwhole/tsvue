<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { get, check, reset } from '@/api/user'
reset()
console.log(
  setInterval(() => {
    setTimeout(() => {
      get().then(res => {
        console.log('get', res)
      })
    }, _.random(1, 5) * 1000)
    setTimeout(() => {
      check().then(res => {
        console.log('check', res)
      })
    }, _.random(1, 5) * 1000)
  }, 1000),
)
</script>

<template lang="pug">
router-view
</template>

<style lang="sass" scoped>
.logo
  height: 6em
  padding: 1.5em
  will-change: filter
</style>
