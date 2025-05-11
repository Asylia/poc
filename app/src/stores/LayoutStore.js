import {ref, reactive, computed} from 'vue'
import {defineStore} from 'pinia'
import {Supabase} from '@/utils/plugins/Supabase.js'
import router from '@/router'
import ROUTE_NAMES from "@/router/RouteNames"

export const NOTIFICATIONS_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
}

export const useLayoutStore = defineStore('LayoutStore', () => {

    // mdoals
    const openedModalsIdList = ref([])
    const addIdToModalList = id => openedModalsIdList.value.push(id)
    const removeIdFromModalList = id => openedModalsIdList.value = openedModalsIdList.value.filter(modalId => modalId !== id)

    const appNotifications = ref([])
    const addAppNotification = ({type, text}) => appNotifications.value.push({
        id: new Date().getTime(),
        type,
        text
    })

    const removeAppNotification = id => appNotifications.value = appNotifications.value.filter(notification => notification.id !== id)


    const confirmState = reactive({
        title: '',
        text: '',
        onConfirm: () => {
        },
        onCancel: () => {
        },
        isOpen: false
    })
    const confirmAction = async ({title, text, onConfirm, onCancel}) => {
        confirmState.title = title
        confirmState.text = text
        confirmState.onConfirm = onConfirm
        confirmState.onCancel = onCancel
        confirmState.isOpen = true
    }

    return {
        confirmState,
        appNotifications,
        removeAppNotification,
        addAppNotification,
        confirmAction,
        addIdToModalList,
        removeIdFromModalList,
    }

})