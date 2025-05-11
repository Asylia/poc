<template>

  <DashboardCard id="wallet-users-box">
    <div class="w-full">

      <ModalWindow id="wallet-invite-user-modal" v-model="show">

        <template #title>
          <h3 class="font-semibold font-bold text-gray-800 dark:text-neutral-200">
            Invite user to wallet
          </h3>
        </template>

        <BaseInput v-model="inviteUserEmail" id="invite_email" name="invite_email" type="email" required>
          <template #label>
            <span class="font-bold text-base">Email</span>
          </template>
        </BaseInput>

        <div class="">
          <div class="font-bold text-gray-800">
            User rights
          </div>

          <RightsTable v-model="inviteUserRights"/>

        </div>

        <template #footer>
          <div class="flex  items-center  py-4 px-4 border-t ">
            <BaseButton :disabled="!canInvite" :block="true" :loading="inviteLoading" @click="inviteUser">
              Invite
            </BaseButton>
          </div>
        </template>

      </ModalWindow>

      <div class="flex items-center justify-between">
        <h4 class="font-semibold text-lg text-gray-800">
          Wallet Users
        </h4>

        <Authorization :rights="['CAN_INVITE_USERS']">
          <BaseButton id="invite-user-button-open-modal" @click="showAdd" :disabled="walletUsersStore.users.length >= 5"
                      size="sm">
            Invite
          </BaseButton>
        </Authorization>
      </div>

      <hr class="mt-2">

      <div class="w-full mt-2">
        <TransitionGroup name="list" tag="div">
          <SingleUser v-for="(user,i) in walletUsersStore.users"
                      :wallet-id="walletStore.walletId"
                      :user="user"
                      :key="`${user.id}`"
                      :index="i"
          />
        </TransitionGroup>
      </div>

    </div>
  </DashboardCard>

</template>

<script setup>
import {ref, reactive, computed} from 'vue'
import BaseButton from "@/components/inputs/BaseButton.vue"
import ModalWindow from "@/components/global/ModalWindow.vue"
import BaseInput from "@/components/inputs/BaseInput.vue"
import SingleUser from './SingleUser.vue'
import RightsTable from './RightsTable.vue'
import DashboardCard from "@/components/global/DashboardCard.vue"
import ApiService from "@/services/ApiService"
import {NOTIFICATIONS_TYPES, useLayoutStore} from "@/stores/LayoutStore"
import {useWalletUsersStore} from "@/stores/wallet/WalletUsers";
import {useWalletStore} from "@/stores/wallet/Wallet";
import Authorization from "@/components/views/wallets/Authorization.vue";

const walletUsersStore = useWalletUsersStore()
const walletStore = useWalletStore()
const layoutStore = useLayoutStore()

const show = ref(false)
const inviteUserEmail = ref('')
const inviteUserRights = ref({})
const loading = ref(false)
const inviteLoading = ref(false)
const canInvite = computed(() => inviteUserEmail.value.length > 0 && inviteUserEmail.value.includes('@'))


const showAdd = () => {
  show.value = true
}
const closeAdd = () => {
  inviteUserEmail.value = ''
  show.value = false
}

const inviteUser = async () => {

  inviteLoading.value = true
  loading.value = true

  const rights = Object.keys(inviteUserRights.value).filter(key => inviteUserRights.value[key] === true)

  const {data, error} = await ApiService('POST', 'v1/wallet/invite-user', {
    walletId: walletStore.walletId,
    email: inviteUserEmail.value,
    rights
  })

  if (error || data.status === 1) {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error inviting user'
    })
    alert('error')
    inviteLoading.value = false
    return
  }

  inviteLoading.value = false

  closeAdd()

}

</script>