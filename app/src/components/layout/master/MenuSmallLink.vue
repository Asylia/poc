<template>
  <a class="flex hover:cursor-pointer items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
    <font-awesome-icon :icon="props.icon" class="text-sm"/>
    {{ props.title }}
  </a>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: Array,
    required: true
  }
})
</script>