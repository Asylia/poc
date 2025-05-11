import {ref, reactive, computed} from 'vue'
import {defineStore} from 'pinia'
import {useSocketStore} from "@/stores/SocketStore"
import * as bitcoin from "bitcoinjs-lib"
import {useWalletStore} from "@/stores/wallet/Wallet"
import {useWalletTransactionsPsbt} from "@/stores/wallet/WalletTransactionsPsbt"

const network = bitcoin.networks.bitcoin

export const useWalletBalance = defineStore('WalletBalance', () => {

    const walletStore = useWalletStore()
    const walletTransactionsStore = useWalletTransactionsPsbt()
    const socketStore = useSocketStore()

    const confirmedUtxo = ref([])
    const setConfirmedUtxo = data => confirmedUtxo.value = data

    const state = reactive({
        receivedBalance: 0,
        balanceInMempool: 0,
        confirmedBalance: 0
    })
    const setBalance = data => Object.assign(state, data)

    const inputsBlockedByPsbt = computed(() => {
        const data = []
        for (const singlePsbt of walletTransactionsStore.walletPsbtList) {
            const psbt = bitcoin.Psbt.fromBase64(singlePsbt.psbtV1Base64, {network})
            for (let i = 0; i < psbt.inputCount; i++) {
                const txInput = psbt.txInputs[i]
                const dataInput = psbt.data.inputs[i]
                data.push({
                    hash: txInput.hash.toString('hex'),
                    value: dataInput.witnessUtxo.value,
                })
            }
        }
        return data
    })

    // const availableUtxo = computed(() => confirmedUtxo.value.filter(utxo => !inputsBlockedByPsbt.value.find(item => item.hash === utxo.tx_hash)))
    const availableUtxo = computed(() => {
        const a = confirmedUtxo.value.filter(utxo => !inputsBlockedByPsbt.value.find(item => item.hash === utxo.tx_hash))
        return a
    })

    const blockedByPsbt = computed(() => inputsBlockedByPsbt.value.reduce((acc, item) => acc + item.value, 0))
    const spendableBalance = computed(() => state.confirmedBalance - blockedByPsbt.value)

    const setRealTimeHooks = () => {

        socketStore.addHook({
            id: `wallet-${walletStore.walletId}-wallet-utxos-balance`,
            onConnect: socket => {
                socket.on('update-utxos', (data) => {
                    setConfirmedUtxo(data)
                })
                socket.on('update-balance', (data) => {
                    setBalance(data)
                })
            },
            onDisconnect: socket => {
                socket.off('update-utxos')
                socket.off('update-balance')
            }
        })

    }

    const removeRealTimeHooks = () => {
        socketStore.removeHook(`wallet-${walletStore.walletId}-wallet-utxos-balance`)
    }

    const balance = computed(() => {
        return {
            ...state,
            spendableBalance: spendableBalance.value,
            blockedByPsbt: blockedByPsbt.value
        }
    })

    return {
        balance,
        availableUtxo,
        setRealTimeHooks,
        removeRealTimeHooks,
        setBalance,
        setConfirmedUtxo
    }

})