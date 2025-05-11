<template>
  <div class="relative mb-4   bg-white  border border-gray-200 rounded-xl  ">

    <WalletNotSetUpOverlay v-if="!enabled"/>

    <div class="flex flex-col py-2.5 px-4">
      <slot/>
    </div>

  </div>
</template>

<script setup>

import WalletNotSetUpOverlay from "@/components/global/WalletNotSetUpOverlay.vue"

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true
  }
})
</script>