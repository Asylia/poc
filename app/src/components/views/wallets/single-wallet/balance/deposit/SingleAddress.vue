<template>
  <div class="flex mb-1 text-sm" :class="{'text-blue-500':props.isCurrent}">
    <div class="w-[48px] pl-0.5 text-left">
      {{ props.address.path }}
    </div>
    <div class="w-[333px] pl-2 text-left">
      {{ props.address.address }}
    </div>
    <div class="w-[28px] pl-2 text-center">
      {{ props.address.balance.n_tx }}
    </div>
    <div class="flex-1 pl-4">
      <BtcSatsValue :satoshi="props.address.balance.total_received" v-slot="{value,currency}">
      <span class="space-x-2">
        <b class="text-sm">{{ value }}</b>
        <span class="text-sm text-gray-500">{{ currency }}</span>
      </span>
      </BtcSatsValue>
    </div>
    <div class="flex-1 pl-4">
      <BtcSatsValue :satoshi="props.address.balance.final_balance" v-slot="{value,currency}">
      <span class="space-x-2">
        <b class="text-sm">{{ value }}</b>
        <span class="text-sm text-gray-500">{{ currency }}</span>
      </span>
      </BtcSatsValue>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  address: {
    type: Object,
    required: true
  },
  isCurrent: {
    type: Boolean,
    default: true
  }
})
</script>