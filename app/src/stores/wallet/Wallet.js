import {ref, reactive, toRaw, computed} from 'vue'
import {defineStore} from 'pinia'
import ApiService from "@/services/ApiService";
import {useSocketStore} from "@/stores/SocketStore";
import {NOTIFICATIONS_TYPES, useLayoutStore} from "@/stores/LayoutStore";
import ROUTE_NAMES from "@/router/RouteNames";
import {useWalletBalance} from "@/stores/wallet/WalletBalance";
import {useWalletAddressesStore} from "@/stores/wallet/WalletAddresses";
import {useWalletUsersStore} from "@/stores/wallet/WalletUsers";
import {useRouter} from "vue-router";

export const useWalletStore = defineStore('WalletStore', () => {

    const router = useRouter()
    const walletBalanceStore = useWalletBalance()
    const walletAddressesStore = useWalletAddressesStore()
    const walletUsersStore = useWalletUsersStore()
    const socketStore = useSocketStore()
    const layoutStore = useLayoutStore()

    const isConnectedToSocket = ref(false)
    const loading = ref(false)
    const _walletId = ref(null)
    const walletId = computed({
        get: () => _walletId.value,
        set: value => _walletId.value = value
    })

    const _walletConfig = reactive({})
    const setWalletConfig = data => Object.assign(_walletConfig, data)
    const walletConfig = computed(() => Object.assign({}, (_walletConfig)))
    const clearWalletConfig = () => {
        Object.keys(toRaw(_walletConfig)).forEach(key => delete _walletConfig[key])
    }

    const walletStatus = ref('')
    const walletHasAllKeys = computed(() => walletConfig.value?.extendedPublicKeys?.length === walletConfig.value?.quorum?.totalSigners)
    const walletFunctionEnabled = computed(() => walletHasAllKeys.value && walletStatus.value === 'OK')

    const setWalletData = data => {
        walletBalanceStore.setBalance(data.balance)
        walletBalanceStore.setConfirmedUtxo(data.utxos)
        setWalletConfig(data.config)
        walletAddressesStore.setWalletAddresses(data.address)
        walletStatus.value = data.status
        walletUsersStore.setUsers(data.walletUsers)
    }

    const loadWallet = async (rebuild = false) => {

        loading.value = true
        const {data, error} = await ApiService('GET', 'v1/wallet', {walletId: walletId.value, rebuild})

        if (data === null || error) {
            layoutStore.addAppNotification({
                type: NOTIFICATIONS_TYPES.ERROR,
                text: 'Wallet not found'
            })
            return await router.push({
                name: ROUTE_NAMES.HOME
            })
        }

        setWalletData(data)
        loading.value = false

    }

    const setRealTimeHooks = () => {

        socketStore.addHook({
            id: `wallet-${walletId.value}`,
            onConnect: socket => {

                socket.on('update-config', (data) => {
                    setWalletConfig(data)
                })

                socket.on('wallet-connected', (debug) => {
                    isConnectedToSocket.value = true
                })

                socket.on('update-wallet-full-data', data => {
                    setWalletData(data)
                })

                // send join to wallet room
                socket.emit('joinToWallet', {id: walletId.value})

            },
            onDisconnect: socket => {
                socket.off('update-config')
                socket.off('wallet-connected')
                socket.off('update-wallet-full-data')
                isConnectedToSocket.value = false
            }
        })

    }

    const leaveWallet = () => socketStore.getSocket()?.emit('leaveWallet', {id: walletId.value})
    const removeRealTimeHooks = () => socketStore.removeHook(`wallet-${walletId.value}`)

    return {
        walletId,
        loadWallet,
        removeRealTimeHooks,
        setRealTimeHooks,
        leaveWallet,
        clearWalletConfig,
        walletConfig,
        walletFunctionEnabled,
        walletHasAllKeys,
        isConnectedToSocket,
        loading,
        walletStatus
    }

})