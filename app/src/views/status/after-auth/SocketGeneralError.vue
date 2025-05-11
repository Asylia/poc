<template>
  <AuthLayout>

    <font-awesome-icon :icon="['fal','triangle-exclamation']" class="text-4xl text-blue-500"/>

    <div class="text-center mt-4 text-lg font-bold">
      Error
    </div>

    <div>
      <p class="text-center mt-2 text-gray-500 dark:text-neutral-500">
        {{ text}}
      </p>
    </div>

    <hr class="my-4">

    <BaseButton @click="userStore.logOut()" :block="true" :icon="['fal','right-from-bracket']">
      Log out
    </BaseButton>

  </AuthLayout>
</template>

<script setup>
import {computed} from "vue"
import AuthLayout from '@/templates/BeforeAuth.vue'
import BaseButton from "@/components/inputs/BaseButton.vue"
import {useSocketStore, SOCKET_STATUS} from "@/stores/SocketStore"
import {useUserStore} from "@/stores/UserStore"

const socketStore = useSocketStore()
const userStore = useUserStore()

const text = computed(() => {
  if (socketStore.socketStatus === SOCKET_STATUS.AUTH_ERROR) {
    return 'You have ben logged out. Please log out and log in again.'
  }
  return ' We are sorry but som error occurs. Please try to log out and log in again.'
})

</script>