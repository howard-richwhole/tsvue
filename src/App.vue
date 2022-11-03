<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { get, check } from '@/api/user'

setInterval(() => {
  setTimeout(get, _.random(1, 5) * 1000)
  setTimeout(check, _.random(1, 5) * 1000)
}, 3000)
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
