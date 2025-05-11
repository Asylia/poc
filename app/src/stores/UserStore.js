import {ref, reactive, computed} from 'vue'
import {defineStore} from 'pinia'
import {Supabase} from '@/utils/plugins/Supabase.js'
import router from '@/router'
import ROUTE_NAMES from "@/router/RouteNames"
import {useCoinStore} from "@/stores/CoinStore";
import ApiService from "@/services/ApiService";
import {useSocketStore} from "@/stores/SocketStore";

export const useUserStore = defineStore('userStore', () => {

    // store
    const socketStore = useSocketStore()
    const coinStore = useCoinStore()

    /*
     * User
     */
    const _user = reactive({})
    const userData = computed(() => getUserData())
    const setUser = data => Object.assign(_user, data)
    const clearUser = () => Object.assign(_user, {})
    const getUserData = () => Object.assign({}, _user)
    const hasUser = computed(() => Object.keys(_user).length !== 0)

    /*
     * User Profile
     */
    const _userProfile = reactive({})
    const setUserProfile = data => Object.assign(_userProfile, data)
    const getUserProfile = () => Object.assign({}, _userProfile)

    /*
     * Subscription
     */
    const _userSubscription = reactive({})
    const setUserSubscription = data => Object.assign(_userSubscription, data)
    const getUserSubscription = () => Object.assign({}, _userSubscription)
    const userSubscription = computed(() => getUserSubscription())

    const loadUserSubscription = async () => {

        // todo realtime to user
        const {data, error} = await Supabase
            .from('users_subscriptions')
            .select('*')
            .eq('user_id', userData.value.id)
            .single()

        // todo: handle error
        if (error || !data) {
            alert('error load user subscription')
            return
        }

        setUserSubscription(data)
        await setSubscriptionRealTime()

    }

    let subscriptionRealTimeHook = null
    const setSubscriptionRealTime = async () => {
        subscriptionRealTimeHook = Supabase.channel('user-subscription-realtime')
        subscriptionRealTimeHook.on('postgres_changes', {
                schema: 'public',
                event: 'UPDATE',
                table: 'users_subscriptions',
                filter: `user_id=eq.${userData.value.id}`,
            }, (payload) => {
                setUserSubscription(payload.new)
            }
        )
        subscriptionRealTimeHook.subscribe()
    }

    const removeSubscriptionRealTime = () => {
        try {
            subscriptionRealTimeHook?.unsubscribe()
        } catch (e) {
            console.error('removeRealTimeHooks() psbt', e)
        }
    }

    const loadUserProfile = async () => {

        const {data, error} = await ApiService('GET', 'v1/user/profile')

        // todo: handle error
        if (error || !data) {
            alert('error user profile')
            return
        }

        setUserProfile(data.profile)
        coinStore.setCurrency(data.profile.currency)

    }

    const getAccessToken = async () => {
        const {data: userData, error} = await Supabase.auth.getSession()

        if (error) {
            return {
                error: true,
                data: null
            }
        }

        const access_token = userData?.session?.access_token

        return {
            error: false,
            data: access_token
        }
    }

    const loadUser = async () => {

        const {data: userData, error: userError} = await Supabase.auth.getUser()

        if (userError) {
            alert('userError')
            return
        }

        setUser(userData)
        await loadUserProfile()
        await loadUserSubscription()

    }

    // const logOut = async (socpe = 'global') => {
    const logOut = async (scope = 'local') => {
        removeSubscriptionRealTime()
        const {data, error} = await Supabase.auth.signOut({
            scope,
        })
        socketStore.destroySocket()
        if (['local', 'global'].includes(scope)) {
            window.location.reload()
        }
        return error
    }

    return {
        userData,
        hasUser,
        _userProfile,
        userSubscription,
        setUser,
        clearUser,
        loadUser,
        logOut,
        getUserData,
        getUserProfile,
        setUserProfile,
        loadUserProfile,
        getAccessToken,
        loadUserSubscription
    }

})