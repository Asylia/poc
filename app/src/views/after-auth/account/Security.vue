<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center">
      <LoadingIcon class="text-center mx-auto mt-4" :stroke-width="4"/>
    </div>

    <template v-else>

      <div class="text-gray-800 mb-2 font-bold text-lg">
        Logged in devices:
      </div>

      <DeviceCard v-for="session in sessions" :key="session.id" :session="session"/>

      <template v-if="sessions.length > 1">

        <hr class="my-4">

        <BaseButton @click="logOutOthers" color="danger" :block="true">
          Log out others
        </BaseButton>

      </template>

    </template>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import ApiService from "@/services/ApiService"
import UaParser from 'ua-parser-js'
import BaseButton from "@/components/inputs/BaseButton.vue"
import DeviceCard from "@/components/views/account/security/DeviceCard.vue";
import {useLayoutStore} from "@/stores/LayoutStore";
import LoadingIcon from "@/components/global/LoadingIcon.vue";
import {useUserStore} from "@/stores/UserStore";

const layoutStore = useLayoutStore()
const userStore = useUserStore()

const sessions = ref([])
const loading = ref(false)

const loadUserSessions = async () => {

  loading.value = true

  const {data, error} = await ApiService('GET', 'v1/user/sessions')


  loading.value = false
  if (error || data.status === 1) {
    alert('error')
    return
  }

  const mappedSessions = data.sessions.map(session => {
    const parser = new UaParser(session.user_agent)
    session.browser = parser.getBrowser()
    session.os = parser.getOS()
    session.device = parser.getDevice()
    session.isMobile = parser.getDevice().type === 'mobile'
    const currentUserAgent = navigator.userAgent;
    session.isCurrentUserAgent = session.user_agent === currentUserAgent;
    return session
  })

  sessions.value = mappedSessions

}

loadUserSessions()

const logOutOthers = () => layoutStore.confirmAction({
  title: 'Are you sure ?',
  text: `All other devices will be logged out. This device will remain logged in.`,
  onConfirm: async () => {
    const error = await userStore.logOut('others')
    if (error) {
      layoutStore.addAppNotification({
        type: 'error',
        title: 'Auht',
        text: 'Other devices not logged out'
      })
    } else {
      layoutStore.addAppNotification({
        type: 'success',
        title: 'Auht',
        text: 'Other devices logged out successfully'
      })
    }
    await loadUserSessions()
  },
  onCancel: () => {
  }
})

</script>