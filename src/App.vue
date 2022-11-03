<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { login } from '@/api/user'

login({ password: 123456 })
  .then(data => {
    console.log('0', data)
  })
  .catch(data => {
    console.log('1', data)
  })
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
