<template>
  <slot v-if="hasRights"/>
</template>

<script setup>
import {computed} from "vue"
import {useWalletUsersStore} from "@/stores/wallet/WalletUsers"
import {useUserStore} from "@/stores/UserStore"

const pros = defineProps({
  rights: {
    type: Array,
    required: false,
    default: () => ['ALL']
  }
})

const userStore = useUserStore()
const walletUsersStore = useWalletUsersStore()

const currentWalletUserRights = computed(() => {
  const loggedInUserId = userStore.userData.id
  const walletUsers = walletUsersStore.users.find(user => user.id === loggedInUserId)
  return walletUsers?.rights ?? []
})

const hasRights = computed(() => {
  if (pros.rights.includes('ALL')) return true
  return pros.rights.every(right => currentWalletUserRights.value.includes(right))
})

</script>