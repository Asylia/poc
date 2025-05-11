<template>
  <div class="w-full">

    <transition-group name="modal">

      <div key="psbt-transactions" class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
          <div class="p-1.5 min-w-full inline-block align-middle">
            <div class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                <tr>
                  <th scope="col" class="px-2 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    To
                  </th>
                  <th scope="col" style="width: 121px"
                      class="px-2 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <!--                  <th scope="col" style="width: 121px"-->
                  <!--                      class="px-2 py-3 text-start text-xs font-medium text-gray-500 uppercase">-->
                  <!--                    Fee-->
                  <!--                  </th>-->
                  <th scope="col" class="px-2 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                  <th scope="col" class="px-2 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">

                <tr v-if="walletTransactionsStore.loading">
                  <td colspan="4">
                    <div class="w-full py-4 flex items-center justify-center">
                      <div
                          class="animate-spin  inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                          role="status" aria-label="loading">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr v-else-if="walletTransactionsStore.walletPsbtList.length === 0">
                  <td colspan="4">
                    <div class="text-center py-4 text-gray-800 ">
                      You dont have any PSBT transactions
                    </div>
                  </td>
                </tr>

                <SingleTransaction v-for="(psbt,i) in walletTransactionsStore.walletPsbtList"
                                   :key="`psbt-${i}-${psbt.id}`"
                                   :psbt="psbt"
                />

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </transition-group>

  </div>
</template>

<script setup>
import SingleTransaction from "./SingleTransaction.vue"
import {useWalletTransactionsPsbt} from "@/stores/wallet/WalletTransactionsPsbt";

const walletTransactionsStore = useWalletTransactionsPsbt()

</script>