<template>
  <slot/>
</template>

<script setup>
import {onMounted, nextTick} from "vue"

onMounted(() => {
  nextTick(() => {
    try {
      window.HSStaticMethods.autoInit()
    } catch (e) {
      // todo
    }
  })
})
</script>