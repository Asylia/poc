import {reactive, computed} from 'vue'
import {defineStore} from 'pinia'
import {useSocketStore} from "@/stores/SocketStore";
import {useWalletStore} from "@/stores/wallet/Wallet";

export const useWalletAddressesStore = defineStore('WalletAddressesStore', () => {

    const socketStore = useSocketStore()
    const walletStore = useWalletStore()

    const state = reactive({
        newReceivePath: "0/0",
        newChangePath: "0/0",
        newReceiveAddress: '',
        newChangeAddress: '',
        receiveAddressMap: [],
        changeAddressMap: [],
    })

    const setWalletAddresses = data => Object.assign(state, data)

    const addresses = computed(() => Object.assign({}, state))

    const setRealTimeHooks = () => {

        socketStore.addHook({
            id: `wallet-${walletStore.walletId}-wallet-address`,
            onConnect: socket => {
                socket.on('update-address', (data) => {
                    setWalletAddresses(data)
                })
            },
            onDisconnect: socket => {
                socket.off('update-address')
            }
        })

    }

    const removeRealTimeHooks = () => socketStore.removeHook(`wallet-${walletStore.walletId}-wallet-address`)

    return {
        setWalletAddresses,
        setRealTimeHooks,
        removeRealTimeHooks,
        addresses
    }

})