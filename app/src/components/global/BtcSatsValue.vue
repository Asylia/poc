<template>
  <div @click.stop.prevent="swapCurrency" class=" hover:cursor-pointer hover:opacity-90">
    <slot :value="value" :currency="selectedCurrency" :fiat="valueInFiat"/>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import BigNumber from "bignumber.js"
import {useCoinStore} from "@/stores/CoinStore"
import {useStorage} from "@vueuse/core"
import {PRIVACY_MODE_ACTIVE_KEY} from "@/content/Global"

const props = defineProps({
  satoshi: {
    type: [Number, String],
    required: true
  }
})

const coinStore = useCoinStore()

const CURRENCY_ENUM = {
  BTC: 'BTC',
  SAT: 'SAT'
}
const BTC_TO_SAT = 100_000_000
const selectedCurrency = ref(CURRENCY_ENUM.BTC)

const privacyModeActive = useStorage(PRIVACY_MODE_ACTIVE_KEY, false)

const formatOutputValue = (value, type) => {
  if (!privacyModeActive.value) return value
  else {
    if (type === 1) return '*'.repeat(10)
    else return '*'.repeat(8)
  }
}

const value = computed(() => {
  const valInSats = new BigNumber(props.satoshi.toString())
  if (selectedCurrency.value === CURRENCY_ENUM.BTC) {
    const valInSats = new BigNumber(props.satoshi.toString())
    const result = valInSats.dividedBy(BTC_TO_SAT).toFixed(8).toString()
    return formatOutputValue(result, 1)
  } else {
    const val = Number(valInSats.toFixed(0))
    const result = val.toLocaleString('cs-CZ')
    return formatOutputValue(result, 1)
  }
})

const valueInFiat = computed(() => {
  const value = coinStore.convertSatsToFiat(props.satoshi)
  return formatOutputValue(value, 2)
})

const swapCurrency = () => selectedCurrency.value = selectedCurrency.value === CURRENCY_ENUM.BTC ? CURRENCY_ENUM.SAT : CURRENCY_ENUM.BTC

</script>