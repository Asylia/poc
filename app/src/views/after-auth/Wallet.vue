<template>

  <MasterView :key="route.params.id" :content-loading="walletIsLoading">

    <template #loading>

      <div class="w-full h-full flex flex-col items-center justify-center">

        <div class="flex flex-col items-center justify-center">
          <LoadingIcon class="mx-auto"/>
          <span class="text-gray-500 mt-4">Loading wallet data ...</span>
        </div>
      </div>

    </template>

    <div class="w-full xl:flex items-start  xl:space-x-4">

      <div class="xl:w-[380px] w-full shrink">

        <WalletBalance/>

        <div id="wallet-not-set-up" v-if="!walletStore.walletHasAllKeys" class=" mb-4 mt-4 bg-red-500 text-sm text-white rounded-lg p-4"
             role="alert">
          <span class="font-bold">Alert!</span>
          <span>
              Your wallet has unactive functions until you add all your <b>2</b> sing keys. If secon singer is other person,
              you can invite him to the wallet down bellow.
          </span>
        </div>

        <WalletKeys/>

        <WalletsConnectedUsers/>

      </div>

      <div class="flex-1 grow shrink">
        <TransactionsView/>
        <WalletChart/>
      </div>

    </div>

  </MasterView>

</template>

<script setup>
import LoadingIcon from "@/components/global/LoadingIcon.vue"
import MasterView from "@/components/layout/master/MasterView.vue"
import WalletKeys from "@/components/views/wallets/single-wallet/keys/WalletKeys.vue";
import WalletsConnectedUsers from "@/components/views/wallets/single-wallet/users/WalletConnectedUsers.vue"
import {ref, computed, onBeforeUnmount} from "vue"
import {useRoute} from "vue-router"
import TransactionsView from "@/components/views/wallets/single-wallet/transactions/Index.vue"
import WalletBalance from "@/components/views/wallets/single-wallet/balance/WalletBalance.vue";
import WalletChart from "@/components/views/wallets/single-wallet/chart/WalletChart.vue";

import {useWalletStore} from "@/stores/wallet/Wallet";
import {useWalletTransactionsPsbt} from "@/stores/wallet/WalletTransactionsPsbt";
import {useWalletBalance} from "@/stores/wallet/WalletBalance";
import {useWalletAddressesStore} from "@/stores/wallet/WalletAddresses";
import {useWalletUsersStore} from "@/stores/wallet/WalletUsers";
import {useWalletTransactionsBlockChain} from "@/stores/wallet/WalletTransactionsBlockChain";

const route = useRoute()

const walletStore = useWalletStore()
const walletTransactionsStore = useWalletTransactionsPsbt()
const walletBalanceStore = useWalletBalance()
const walletAddressStore = useWalletAddressesStore()
const walletUsersStore = useWalletUsersStore()
const walletTransactionsBlockChain = useWalletTransactionsBlockChain()

walletStore.walletId = route.params.id
const loading = ref(false)
const walletIsLoading = computed(() => loading.value || walletStore.loading || walletTransactionsStore.loading)

const loadWallet = async () => {

  loading.value = true
  await walletStore.loadWallet()
  walletStore.setRealTimeHooks()
  walletBalanceStore.setRealTimeHooks()
  walletAddressStore.setRealTimeHooks()
  await walletTransactionsStore.loadWalletPsbtList()
  walletTransactionsStore.setRealTimeHooks()
  walletUsersStore.setRealTimeHooks()
  walletTransactionsBlockChain.loadWalletTransactionsHistory()
  loading.value = false
}

onBeforeUnmount(() => {
  walletStore.leaveWallet()
  walletBalanceStore.removeRealTimeHooks()
  walletAddressStore.removeRealTimeHooks()
  walletTransactionsStore.removeRealTimeHooks()
  walletStore.removeRealTimeHooks()
  walletUsersStore.removeRealTimeHooks()

})

walletStore.clearWalletConfig()
loadWallet()

</script>