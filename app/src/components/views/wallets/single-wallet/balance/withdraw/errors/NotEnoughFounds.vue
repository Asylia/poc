<template>
  <div class="mt-2 bg-red-500 text-sm text-white rounded-lg p-4" role="alert">
    <span class="font-bold">No enough founds</span>
    <span> You can withdraw </span>
    <span @click="setMaxInput" class="hover:cursor-pointer hover:opacity-75  hover:underline">
      <span>max. <b>{{ props.maximumWithDrawForSelectedCurrency }}</b></span>
      <template v-if="props.currency === 'fiat'"> {{ coinStore.getSelectedCurrency }}</template>
      <template v-else-if="props.currency === 'sat'">satoshi with selected fee</template>
      <template v-else>btc with selected fee</template>
    </span>
  </div>
</template>

<script setup>
import {useCoinStore} from "@/stores/CoinStore"

const props = defineProps({
  maximumWithDrawForSelectedCurrency: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['set-maximum-amount'])

const coinStore = useCoinStore()

const setMaxInput = () => emit('set-maximum-amount')

</script>