import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {useWalletStore} from "@/stores/wallet/Wallet"
import {Supabase} from "@/utils/plugins/Supabase"
import {tableName} from "@/utils/helpers/supabse-db/Index"
import ApiService from "@/services/ApiService"
import {parseISO, fromUnixTime, format, addMonths} from 'date-fns';

const TRANSACTIONS_PER_PAGE = 10

export const useWalletTransactionsBlockChain = defineStore('useWalletTransactionsBlockChain', () => {

    const walletStore = useWalletStore()

    const loading = ref(false)
    const walletTransactions = ref([])
    const currentPage = ref(1)

    const loadWalletTransactionsHistory = async () => {

        loading.value = true
        const {data, error} = await ApiService('GET', 'v1/wallet/wallet-transactions', {
            walletId: walletStore.walletId,
            n: TRANSACTIONS_PER_PAGE,
            offset: (currentPage.value - 1) * TRANSACTIONS_PER_PAGE
        })

        loading.value = false

        if (error) {
            alert('Error loading wallet transactions')
            return
        }

        walletTransactions.value = data.transactions

    }

    const transactionsForSelectedPage = computed(() => {
        return walletTransactions.value.slice((currentPage.value - 1) * TRANSACTIONS_PER_PAGE, currentPage.value * TRANSACTIONS_PER_PAGE)
    })

    const paginationLength = computed(() => Math.ceil(walletTransactions.value.length / TRANSACTIONS_PER_PAGE))

    const goToLasPage = () => currentPage.value = paginationLength.value
    const goToFirstPage = () => currentPage.value = 1

    return {
        loading,
        transactionsForSelectedPage,
        paginationLength,
        currentPage,
        walletTransactions,
        goToLasPage,
        goToFirstPage,
        loadWalletTransactionsHistory,
    }

})