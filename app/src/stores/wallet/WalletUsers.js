import {ref, reactive, computed} from 'vue'
import {useRouter} from 'vue-router'
import {defineStore} from 'pinia'
import {useSocketStore} from "@/stores/SocketStore"
import {useWalletStore} from "@/stores/wallet/Wallet"
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore";
import ROUTE_NAMES from '@/router/RouteNames'
import {useUserStore} from "@/stores/UserStore";

export const useWalletUsersStore = defineStore('WalletUsersStore', () => {

    const walletStore = useWalletStore()
    const socketStore = useSocketStore()
    const layoutStore = useLayoutStore()
    const userStore = useUserStore()

    const router = useRouter()

    const _users = ref([])
    const users = computed(() => _users.value)

    const setUsers = (users) => _users.value = users

    const setRealTimeHooks = () => {

        socketStore.addHook({
            id: `wallet-${walletStore.walletId}-users`,
            onConnect: socket => {
                socket.on('update-walletUsers', users => {

                    const iAmInAllowedList = users.find(user => user.id === userStore.userData?.id)
                    if (!iAmInAllowedList) {
                        layoutStore.addAppNotification({
                            type: NOTIFICATIONS_TYPES.ERROR,
                            text: 'You were removed from the wallet'
                        })
                        return router.push({
                            name: ROUTE_NAMES.HOME
                        })
                    }

                    setUsers(users)

                    layoutStore.addAppNotification({
                        type: NOTIFICATIONS_TYPES.INFO,
                        text: 'Wallet users updated'
                    })

                })
            },
            onDisconnect: socket => {
                socket.off('update-walletUsers')
            }
        })

    }

    const removeRealTimeHooks = () => {
        socketStore.removeHook(`wallet-${walletStore.walletId}-users`)
    }

    return {
        setRealTimeHooks,
        removeRealTimeHooks,
        setUsers,
        users
    }

})