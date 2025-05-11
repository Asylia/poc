<template>
  <AuthLayout>

    <div class="flex items-center justify-center">
      <LoadingIcon class="w-10 h-10 text-blue-500 animate-spin"/>
    </div>

    <div class="text-center mt-4 text-lg font-bold">
      {{ text.title }}
    </div>

    <div>
      <p class="text-center mt-2 text-gray-500 dark:text-neutral-500">
        {{ text.text }}
      </p>
    </div>

  </AuthLayout>
</template>

<script setup>
import {computed} from "vue"
import AuthLayout from '@/templates/BeforeAuth.vue'
import LoadingIcon from "@/components/global/LoadingIcon.vue"
import {useSocketStore, SOCKET_STATUS} from "@/stores/SocketStore"

const socketStore = useSocketStore()


const text = computed(() => {
  if (socketStore.socketStatus === SOCKET_STATUS.CONNECTING) return {
    title: 'Connecting...',
    text: 'Trying to connect to server.'
  }
  else if (socketStore.socketStatus === SOCKET_STATUS.RECONNECTING) return {
    title: 'Reconnecting ...',
    text: 'Opsss :/ some how we lost connection with server. Trying to reconnect.'
  }
  else return {title: 'Loading..', text: 'Loading app. Please wait.'}
})

</script>