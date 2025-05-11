<template>

  <div class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
    <span class="sr-only">Loading...</span>
  </div>

</template>

<script setup>

const props = defineProps({
  width: {
    required: false,
    type: String,
    default: '200px'
  },
  height: {
    required: false,
    type: String,
    default: '200px'
  },
  strokeWidth: {
    required: false,
    type: Number,
    default: 8
  }
})

</script>