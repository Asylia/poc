<template>
  <slot v-if="IS_ADMIN"/>
</template>

<script setup>
import {useUserStore} from "@/stores/UserStore"

const userStore = useUserStore()

const IS_ADMIN = userStore.userData.id === import.meta.env.VITE_SERVICE_ACCOUNT_ID

</script>