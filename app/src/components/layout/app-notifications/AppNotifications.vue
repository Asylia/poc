<template>
  <teleport to="body">
    <div class="absolute top-0 end-0" style="z-index: 1000">
      <SingleNotification v-for="notification in layoutStore.appNotifications" :notification :key="notification.id"/>
    </div>
  </teleport>
</template>

<script setup>
import SingleNotification from "@/components/layout/app-notifications/SingleNotification.vue"
import {NOTIFICATIONS_TYPES, useLayoutStore} from "@/stores/LayoutStore"

const layoutStore = useLayoutStore()

</script>