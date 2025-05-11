<template>
  <ModalWindow :size="showAdvanced ? 'max' : 'md'" id="makeDepositModal" v-model="show">

    <template #title>
      <h3 class="font-semibold text-gray-800 dark:text-neutral-200">
        Make deposit
      </h3>
    </template>

    <div class="flex-col-reverse lg:flex-row flex w-full" :class="{'items-center justify-center':!showAdvanced}">

      <div v-if="showAdvanced" class="flex flex-col grow shrink pr-4 border-r">

        <div class="flex text-sm border-b pb-1 mb-2 mt-1 lg:mt-0 font-bold">
          <div class="w-[48px] text-left">
            Path
          </div>

          <div class="w-[333px] pl-2 text-left">
            Address
          </div>

          <div class="w-[28px] pl-2 text-center">
            TX
          </div>

          <div class="flex-1 pl-4">
            Received
          </div>

          <div class="flex-1 pl-4">
            Balance
          </div>

        </div>

        <SingleAddress v-for="(address) in tableAddressList" :address="address" :key="address.address"
                       :isCurrent="isCurrent(address.address)"
        />

      </div>

      <div class="flex  pb-4 lg:pb-0 lg:border-b-0  flex-col"
           :class="{'pl-2 shrink-0 items-center justify-center grow lg:w-[432px]':showAdvanced,'border-b':showAdvanced}"
      >

        <h1 class="text-center text-gray-800 font-bold text-xl">
          Address
        </h1>

        <div class="text-center flex space-x-1 items-center justify-center mt-1 text-sm">
          <span>
            {{ MAIN_BIP32_PATH }}
          </span>
          <span class="font-bold">
            {{ addressPath }}
          </span>
        </div>

        <div class="flex mt-2 justify-center">
          <CopyText :value="displayAddress">
            <span class="text-lg text-blue-500 font-medium"> {{ displayAddress }}</span>
          </CopyText>
        </div>

        <canvas class="mx-auto" ref="qrCodeCanvas"></canvas>

      </div>


    </div>

    <template #footer>
      <div class="flex  items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700 justify-between">


        <div class="flex items-center">

          <div class="hidden lg:flex">
            <Toggle v-model="showAdvanced" label="Advanced mode" id="advanced-mode"/>
          </div>

          <div v-if="showAdvanced" class="inline-flex border-l pl-2 ml-2 space-x-2 rounded-lg shadow-sm">
            <base-button @click="setTableAddressType(TABLE_ADDRESS_TYPE.RECEIVE)" size="xs"
                         :color="tableAddressType === TABLE_ADDRESS_TYPE.RECEIVE ? 'primary' : 'neutral'">
              Receive
            </base-button>
            <base-button @click="setTableAddressType(TABLE_ADDRESS_TYPE.CHANGE)" size="xs"
                         :color="tableAddressType === TABLE_ADDRESS_TYPE.CHANGE ? 'primary' : 'neutral'">
              Change
            </base-button>
          </div>

        </div>

        <BaseButton @click="show = false">
          Close
        </BaseButton>
      </div>
    </template>

  </ModalWindow>
</template>

<script setup>
import {watch, ref, computed, nextTick, toRaw} from "vue"
import QRCode from 'qrcode'
import BaseButton from "@/components/inputs/BaseButton.vue"
import ModalWindow from "@/components/global/ModalWindow.vue"
import CopyText from "@/components/global/CopyText.vue";
import {MAIN_BIP32_PATH} from "@/content/PublicKeysEnum";
import SingleAddress from "@/components/views/wallets/single-wallet/balance/deposit/SingleAddress.vue";
import Toggle from "@/components/inputs/Toggle.vue";
import {useWalletAddressesStore} from "@/stores/wallet/WalletAddresses";

const show = defineModel()
const walletAddressStore = useWalletAddressesStore()

const TABLE_ADDRESS_TYPE = {
  RECEIVE: 'RECEIVE',
  CHANGE: 'CHANGE'
}

const qrCodeCanvas = ref()
const tableAddressType = ref(TABLE_ADDRESS_TYPE.RECEIVE)

const displayAddress = computed(() => {
  if (tableAddressType.value === TABLE_ADDRESS_TYPE.RECEIVE) return walletAddressStore.addresses.newReceiveAddress
  else return walletAddressStore.addresses.newChangeAddress
})

const addressPath = computed(() => tableAddressType.value === TABLE_ADDRESS_TYPE.RECEIVE ? walletAddressStore.addresses.newReceivePath : walletAddressStore.addresses.newChangePath)

const generateQrCode = () => {
  try {
    QRCode.toCanvas(qrCodeCanvas.value, toRaw(displayAddress.value), (error) => {
      if (error) console.error(error)
    })
  } catch (e) {
    console.error(e)
  }
}
watch(show, async val => {
  await nextTick()
  if (val) {
    generateQrCode()
  }
})

watch(displayAddress, generateQrCode)

const setTableAddressType = type => tableAddressType.value = type

const tableAddressList = computed(() => {
  const setKey = tableAddressType.value === TABLE_ADDRESS_TYPE.RECEIVE ? 'receiveAddressMap' : 'changeAddressMap'
  return Object.keys(walletAddressStore.addresses[setKey]).map(key => {
    return {
      address: key,
      path: walletAddressStore.addresses[setKey][key].path,
      balance: walletAddressStore.addresses[setKey][key].balance
    }
  })
})

const isCurrent = (address) => displayAddress.value === address

const showAdvanced = ref(false)

</script>