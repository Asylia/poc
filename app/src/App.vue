<template>
  <AppNotifications/>
  <Offline v-if="isOffline"/>
  <router-view v-else/>
</template>

<script setup>
import {ref} from "vue"
import AppNotifications from "@/components/layout/app-notifications/AppNotifications.vue"
import Offline from "@/views/status/global/Offline.vue"

/*
 * Online / offline detection
 */
const isOffline = ref(false)
window.addEventListener('online', () => isOffline.value = false)
window.addEventListener('offline', () => isOffline.value = true)

</script>
