<template>
  <div class="mt-2 bg-red-500 text-sm text-white rounded-lg p-4" role="alert">
    <span class="font-bold">Minimum withdraw </span>
    <span @click="setMinInput" class="hover:cursor-pointer hover:opacity-75  hover:underline">
      <span>is <b>{{ props.minWithdraw }}</b></span>
      <template v-if="props.currency === 'fiat'"> {{ coinStore.getSelectedCurrency }}</template>
      <template v-else-if="props.currency === 'sat'">satoshi</template>
      <template v-else>btc</template>
    </span>
  </div>
</template>

<script setup>
import {useCoinStore} from "@/stores/CoinStore"

const props = defineProps({
  minWithdraw: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['set-min-amount'])

const coinStore = useCoinStore()

const setMinInput = () => emit('set-min-amount')

</script>