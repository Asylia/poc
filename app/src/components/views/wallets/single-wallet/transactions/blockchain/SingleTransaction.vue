<template>
  <tr>
    <td @click="openTransaction"
        ref="hashElement"
        class="px-2 hover:cursor-pointer hover:underline hover:opacity-80 text-blue-500 py-4 whitespace-nowrap text-sm font-medium ">
      {{ transactionHash }}
    </td>
    <td style="width: 90px"
        class="px-2 py-4 space-x-2   text-center whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
      <span>
         {{ props.transaction.isReceive ? 'Receive' : 'Send' }}
      </span>
      <font-awesome-icon :icon="['fas', props.transaction.isReceive ? 'down-left':  'up-right']"
                         class="text-xs"
                         :class="!props.transaction.isReceive ? 'text-red-500' :'text-green-500' "/>

    </td>
    <td style="width: 148px" class=" py-4   flex justify-center  text-sm text-gray-800 ">
      <BtcSatsValue class="w-full flex space-x-2 justify-center "
                    :satoshi="Math.abs(props.transaction.result)"
                    v-slot="{value,currency}"
      >
        <div>{{ value }}</div>
        <div class="font-bold">{{ currency }}</div>
      </BtcSatsValue>
    </td>
    <td style="width: 121px" class="px-2 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
      {{ props.transaction.isConfirmed ? 'Confirmed' : 'Unconfirmed' }}
    </td>
    <td style="width: 98px"
        class="px-2 py-4 flex justify-end whitespace-nowrap text-sm text-gray-800 ">
      {{ formatDateTimeFromUnix(props.transaction.time) }}
    </td>
  </tr>
</template>

<script setup>
import {ref, computed, watch, nextTick} from "vue"
import {formatDateTimeFromDB, formatDateTimeFromUnix} from "@/utils/helpers/DateTime"

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})


// open transaction in new window
const openTransaction = () => window.open(`https://mempool.space/tx/${props.transaction.hash}`, '_blank')


/*
 * Fit hash to el width
 */
const transactionHash = ref('')

// const shortTransactionHas = input => {
//   if (input.length >= 36) return input.slice(0, 4) + '...' + input.slice(-12);
//   return input;
// }

const shortTransactionHash = (input, maxChars) => {
  if (input.length <= maxChars) return input;
  const startLength = Math.floor((maxChars - 3) / 2);
  const endLength = Math.ceil((maxChars - 3) / 2);
  return input.slice(0, startLength) + '...' + input.slice(-endLength);
}


const hashElement = ref(null)
watch(() => hashElement.value, () => {
  nextTick(() => {
    window.addEventListener('resize', () => {
      fitHash()
    })
    fitHash()
  })
})

const fitHash = () => {
  const el = hashElement.value
  if (!el) return
  const width = el.offsetWidth
  const canFitMaxChars = Math.floor(width / 6.5)
  transactionHash.value = shortTransactionHash(props.transaction.hash, canFitMaxChars);
}
</script>