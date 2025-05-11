<template>

  <DashboardCard id="wallet-transactions-wrapper">

    <h4 class="text-xl font-semibold text-gray-800 dark:text-neutral-200">
      Transactions
    </h4>

    <Tabs head-id="transactions-head-filter" :tabsHead="tabsHead" v-model="activeTab" :tabs-slots="tabsSlots"/>

  </DashboardCard>

</template>

<script setup>
import {ref} from 'vue'
import DashboardCard from "@/components/global/DashboardCard.vue"
import Tabs from "@/components/global/Tabs.vue"
import TransactionsBlockchain
  from "@/components/views/wallets/single-wallet/transactions/blockchain/TransactionsBlockchain.vue"
import TransactionsPsbt from "@/components/views/wallets/single-wallet/transactions/psbt/TransactionsPsbt.vue"

const props = defineProps({
  walletId: {
    type: String,
    default: ''
  },
  enabled: {
    type: Boolean,
    default: true
  }
})

const tabsHead = [
  {
    id: 'psbt-tab',
    title: 'PSBT',
  },
  {
    id: 'blockchain-tab',
    title: 'Blockchain',
  }
]

const tabsSlots = {
  'psbt-tab': TransactionsPsbt,
  'blockchain-tab': TransactionsBlockchain
}

const activeTab = ref('psbt-tab')


</script>