<template>
  <div class="flex justify-between w-full text-base  text-gray-800 ">
    <span class="text-gray-500">{{ props.title }}</span>
    <BtcSatsValue :satoshi="props.value" v-slot="{value,currency}">
      <span class="space-x-2">
        <b>{{ value }}</b>
        <span class="text-xs text-gray-500">{{ currency }}</span>
      </span>
    </BtcSatsValue>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})
</script>