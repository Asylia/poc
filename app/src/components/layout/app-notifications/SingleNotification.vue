<template>
  <div class="max-w-xs m-4 bg-white border border-gray-200 rounded-xl shadow-lg "
       role="alert">

    <div class="flex p-4">
      <div class="flex-shrink-0">
        <font-awesome-icon :icon="['fas','circle-info']"
                           class="text-sm"
                           :class="NOTIFICATION_COLORS[props.notification.type]"
        />
      </div>
      <div class="ms-3">
        <p class="text-sm text-gray-700 dark:text-gray-400">
          {{ props.notification.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore";

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
})

const layoutStore = useLayoutStore()

const NOTIFICATION_COLORS = {
  [NOTIFICATIONS_TYPES.SUCCESS]: 'text-teal-500',
  [NOTIFICATIONS_TYPES.ERROR]: 'text-red-500',
  [NOTIFICATIONS_TYPES.INFO]: 'text-blue-500',
}

onMounted(() => setTimeout(() => layoutStore.removeAppNotification(props.notification.id), 3500))

</script>