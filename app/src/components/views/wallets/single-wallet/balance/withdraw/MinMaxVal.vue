<template>
  <div class="flex-1">
    <div class="w-auto text-right flex items-start text-sm">

      <span @click="emit('set-value')"
            class=" hover:cursor-pointer hover:opacity-75 font-bold mr-4  hover:underline">
        <slot/>
      </span>

      <BtcSatsValue :satoshi="props.amount.sat" v-slot="{value,currency,fiat}">
        <div class="space-x-2">
          <span>{{ value }}</span>
          <span class="text-xs text-gray-500">{{ currency }}</span>
        </div>
        <div class="text-right -mt-1 text-gray-500 space-x-2">
          <span class="text-base font-light">{{ coinStore.formatFiatCurrency(props.amount.fiat, false) }}</span>
          <span class="text-xs  text-gray-500">{{ coinStore.getSelectedCurrency }}</span>
        </div>
      </BtcSatsValue>

    </div>
  </div>
</template>

<script setup>

import {useCoinStore} from "@/stores/CoinStore"

const props = defineProps({
  amount: {
    type: Object,
    required: true
  }
})

const coinStore = useCoinStore()

const emit = defineEmits(['set-value'])

</script>