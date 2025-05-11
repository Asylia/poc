<template>
  <div class="w-ful">
    <div class="w-full space-x-10 flex items-cente justify-between">
      <span class="text-base font-bold">BIP32 PATH:</span>
      <span class="text-xs">
      {{ props.path }}
    </span>
    </div>
    <div class="w-full  flex items-cstart justify-between">
      <span class="font-bold text-base">XPUB:</span>
      <span class="pl-20 text-xs" style="overflow-wrap: anywhere;">
      {{ props.xpub }}
    </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  path: {
    type: String,
    required: true
  },
  xpub: {
    type: String,
    required: true
  }
})
</script>