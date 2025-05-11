import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {useWalletStore} from "@/stores/wallet/Wallet"
import {Supabase} from "@/utils/plugins/Supabase"
import {tableName} from "@/utils/helpers/supabse-db/Index"

export const useWalletTransactionsPsbt = defineStore('WalletTransactions', () => {

    const walletStore = useWalletStore()

    const loading = ref(false)
    const _walletPsbtList = ref([])
    const walletPsbtList = computed(() => _walletPsbtList.value)

    const loadWalletPsbtList = async () => {

        loading.value = true
        const {data: psbtDataList, error: psbtDataListError} = await Supabase
            .from(tableName('UserWalletsPsbt'))
            .select()
            .eq('walletId', walletStore.walletId)
            .neq('status', 'BROADCASTED')

        if (psbtDataListError) {
            alert('error loading pbt')
            return false
        }

        _walletPsbtList.value = psbtDataList
        loading.value = false

    }

    let realTimeHook = null
    const setRealTimeHooks = () => {

        const map = walletPsbtList.value.map(item => item.id)
        const idList = map.join(',')


        realTimeHook = Supabase.channel('psbt-wallet-changes')
        if (map.length !== 0) {

            realTimeHook.on(
                'postgres_changes',
                {
                    schema: 'public',
                    event: 'UPDATE',
                    table: 'v1_Asylia_UserWalletsPsbt',
                    filter: `id=in.(${idList})`,
                },
                (payload) => {
                    for (let i = 0; i < walletPsbtList.value.length; i++) {
                        if (walletPsbtList.value[i].id === payload.new.id) {
                            if (payload.new.status === 'BROADCASTED') {
                                walletPsbtList.value.splice(i, 1)
                                reHookRealTime()
                                break
                            }
                            if (payload.new.psbtV1Base64) {
                                walletPsbtList.value[i] = payload.new
                                break
                            }
                        }
                    }
                }
            )

            realTimeHook.on(
                'postgres_changes',
                {
                    schema: 'public',
                    event: 'DELETE',
                    table: 'v1_Asylia_UserWalletsPsbt',
                    filter: `walletId=eq.${walletStore.walletId}`,
                },
                (payload) => {
                    _walletPsbtList.value = walletPsbtList.value.filter(item => item.id !== payload.old.id)
                    reHookRealTime()
                }
            )

        }

        realTimeHook.on(
            'postgres_changes',
            {
                schema: 'public',
                event: 'INSERT',
                table: 'v1_Asylia_UserWalletsPsbt',
                filter: `walletId=eq.${walletStore.walletId}`,
            },
            (payload) => {
                _walletPsbtList.value.unshift(payload.new)
                reHookRealTime()
            }
        )

        realTimeHook.subscribe()

    }

    const removeRealTimeHooks = () => {
        try {
            realTimeHook?.unsubscribe()
        } catch (e) {
        }
    }
    const reHookRealTime = () => {
        removeRealTimeHooks()
        setRealTimeHooks()
    }

    return {
        loadWalletPsbtList,
        setRealTimeHooks,
        removeRealTimeHooks,
        walletPsbtList,
        loading
    }

})