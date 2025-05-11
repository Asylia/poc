<template>
  <div class="w-full">

    <div v-if="walletTransactionsBlockChain.loading" class="w-full flex items-center justify-center">
      <div
          class="animate-spin  inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
          role="status" aria-label="loading">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-else-if="walletTransactionsBlockChain.walletTransactions.length === 0" class="text-center ">
      This wallet has no transactions
    </div>

    <div class="flex max-h-full  flex-col">
      <transition name="modal">
        <div v-if="walletTransactionsBlockChain.walletTransactions.length !== 0" class="-m-1.5 overflow-x-auto">
          <div class="p-1.5 w-full  inline-block align-middle">
            <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
              <tr>
                <th scope="col"
                    class="px-2 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                  Transaction hash
                </th>
                <th scope="col" style="width: 90px"
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Direction
                </th>
                <th scope="col" style="width: 148px"
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <!--              <th scope="col" style="width: 148px"-->
                <!--                  class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">-->
                <!--                Fee-->
                <!--              </th>-->
                <th scope="col" style="width: 121px"
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th scope="col" style="width: 98px"
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
              </thead>

              <tbody class="divide-y   divide-gray-200 overflow-y-auto dark:divide-gray-700">


              <SingleTransaction v-for="(transaction,i) in walletTransactionsBlockChain.transactionsForSelectedPage"
                                 :key="`${i}-${transaction.hash}`"
                                 :transaction="transaction"
              />

              </tbody>

            </table>
          </div>
          <div v-if="walletTransactionsBlockChain.paginationLength > 1 && !walletTransactionsBlockChain.loading"
               class="pb-2 px-4">
            <nav class="flex items-center justify-end space-x-1">
              <button @click="walletTransactionsBlockChain.goToFirstPage"
                      type="button"
                      class="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">
                <span aria-hidden="true">«</span>
                <span class="sr-only">Previous</span>
              </button>

              <button v-for="(page,i) in walletTransactionsBlockChain.paginationLength"
                      :key="i"
                      @click="walletTransactionsBlockChain.currentPage = i + 1"
                      type="button"
                      class="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white"
                      :class="{'bg-blue-500 text-white': walletTransactionsBlockChain.currentPage === i + 1}"
                      aria-current="page">
                {{ i + 1 }}
              </button>

              <!--            <button type="button"-->
              <!--                    class="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"-->
              <!--                    aria-current="page">-->
              <!--              1 . {{ totalTransactionsCounter }} . {{ paginationLength }}-->
              <!--            </button>-->
              <!--            <button type="button"-->
              <!--                    class="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">-->
              <!--              2-->
              <!--            </button>-->
              <!--            <button type="button"-->
              <!--                    class="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">-->
              <!--              3-->
              <!--            </button>-->
              <button @click="walletTransactionsBlockChain.goToLasPage"
                      type="button"
                      class="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">
                <span class="sr-only">Next</span>
                <span aria-hidden="true">»</span>
              </button>
            </nav>
          </div>
        </div>
      </transition>
    </div>

  </div>
</template>

<script setup>
import SingleTransaction from "./SingleTransaction.vue"
import {useWalletTransactionsBlockChain} from "@/stores/wallet/WalletTransactionsBlockChain"

const walletTransactionsBlockChain = useWalletTransactionsBlockChain()
</script>