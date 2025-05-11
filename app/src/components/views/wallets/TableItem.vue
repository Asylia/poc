<template>
  <tr>

    <td class="h-px w-px whitespace-nowrap">
      <div class="ps-6 text-center lg:ps-3 xl:ps-0 pe-6 py-3">
        <span>{{ props.index + 1 }}</span>
      </div>
    </td>

    <td class="h-px w-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="text-sm text-gray-800">
          {{ props.data.name }}
        </span>
      </div>
    </td>

    <td class="h-px w-px whitespace-nowrap">
      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
        <div class="flex items-center gap-x-3">
          <img class="inline-block h-[2.375rem] w-[2.375rem] rounded-full"
               src="/icons/bitcoin.svg"
               alt="Image Description"/>

          <div class="grow">
            <BtcSatsValue :satoshi="props.data.balance.receivedBalance" v-slot="{value,currency,fiat}">
            <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">
             {{ value }}
            </span>
              <span class="block text-sm text-gray-500">
             {{ currency }}
            </span>
            </BtcSatsValue>
          </div>
        </div>
      </div>
    </td>

    <td class="h-px w-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="text-sm text-gray-500">
         P2SH-P2WSH
        </span>
      </div>
    </td>

    <td class="h-px w-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="text-sm text-gray-500">
        <b>{{ props.data.requiredSigners }}</b> of <b>3</b>
        </span>
      </div>
    </td>

    <td class="h-px w-px whitespace-nowrap">
      <div class="px-6  py-3">
        <span class="text-xs  font-bold text-gray-500">
          {{ created }}
        </span>
      </div>
    </td>
    <td class="h-px w-px whitespace-nowrap">
      <div class="px-6 py-1.5">
        <a class="inline-flex hover:cursor-pointer items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
           @click="openWallet"
        >
          View
        </a>
      </div>
    </td>
  </tr>
</template>

<script setup>
import {useRouter} from "vue-router"
import {KEY_TYPES, KEY_TYPES_DATA} from "@/content/PublicKeysEnum"
import {formatDateFromDB} from "@/utils/helpers/DateTime"
import ROUTES_NAMES from "@/router/RouteNames";
import {reactive, ref} from "vue";
import {tableName} from "@/utils/helpers/supabse-db/Index";
import {getWalletDataByAddress} from "@/services/block-chain/Wallet";
import {calculateWalletBalance, satoshiToBTC} from "@/services/block-chain/Coin";

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-wallet'])
const router = useRouter()

// const created = props.data
const created = formatDateFromDB(props.data.createdAt)

const walletData = reactive({
  balance: false
})
const loading = ref(false)

/*
 * TODO
 */
const getWalletData = async address => {

  loading.value = true
  const {data, error} = await getWalletDataByAddress(address)
  loading.value = false

  if (error) {
    console.error('Chyba pri získavaní UTXOs:', error);
    return
  }

  const balanceInSatoshi = calculateWalletBalance(data)
  walletData.balance = satoshiToBTC(balanceInSatoshi)

}

// getWalletData(props.data.Address)

const openWallet = () => emit('open-wallet', props.data.id)


</script>