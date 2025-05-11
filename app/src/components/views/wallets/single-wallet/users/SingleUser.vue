<template>

  <div class="flex hover:cursor-pointer text-sm bg-base-100 py-1 items-center justify-between edit-wallet-user">

    <ModalWindow id="wallet-invite-user-modal" v-model="edit">

      <template #title>
        <h3 class="font-semibold  text-gray-800 dark:text-neutral-200">
          {{ props.user.email }}
        </h3>
      </template>

      <RightsTable v-model="userRights" :default="false"/>

      <template #footer>
        <div class="flex  items-center justify-end space-x-2 py-4 px-4 border-t ">
          <BaseButton :loading="deleteLoading" :disabled="saveLoading" @click="deleteUser" color="danger">
            Delete
          </BaseButton>
          <BaseButton :loading="saveLoading" :disabled="deleteLoading" @click="saveUser">
            Save
          </BaseButton>
        </div>
      </template>

    </ModalWindow>

    <span>{{ props.user.email }}</span>
    <GeneralTag :disabled="!canDelete" @click="edit = true" :loading="saveLoading || deleteLoading"
                :icon="['fal', 'cog']"
                class="bg-blue-100 text-blue-800"
                :id="`edit-wallet-user-${props.index}`"
    >
      Edit
    </GeneralTag>
  </div>
</template>

<script setup>
import {computed, inject, ref} from 'vue'
import GeneralTag from "@/components/global/tag/GeneralTag.vue"
import {tableName} from "@/utils/helpers/supabse-db/Index";
import {NOTIFICATIONS_TYPES, useLayoutStore} from "@/stores/LayoutStore";
import ApiService from "@/services/ApiService";
import {useUserStore} from "@/stores/UserStore";
import {useWalletUsersStore} from "@/stores/wallet/WalletUsers";
import ModalWindow from "@/components/global/ModalWindow.vue";
import BaseButton from "@/components/inputs/BaseButton.vue"
import RightsTable from "@/components/views/wallets/single-wallet/users/RightsTable.vue"

const props = defineProps({
  walletId: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update-wallet-users'])

const Supabase = inject('SUPABASE')
const edit = ref(false)
const deleteLoading = ref(false)
const saveLoading = ref(false)
const userRights = ref({})

props.user.rights.forEach((right) => {
  userRights.value[right] = true
})

const newUserRights = computed(() => Object.keys(userRights.value).filter(key => userRights.value[key]))
const hasChanges = computed(() => newUserRights.value.length !== props.user.rights.length || newUserRights.value.some(right => !props.user.rights.includes(right)))

const layoutStore = useLayoutStore()
const userStore = useUserStore()
const walletUsersStore = useWalletUsersStore()

const canDelete = computed(() => {

  return walletUsersStore.users.length >= 2 && props.user.rights.includes('CAN_MANAGE_USERS_PERMISSIONS')
  // return walletUsersStore.users.length >= 2 && props.user.id !== userStore.userData?.id

})

const deleteUser = () => layoutStore.confirmAction({
  title: 'Are you sure ?',
  text: `User with email <b>${props.user.email}</b> will be removed from wallet and will not have access to it anymore.`,
  onConfirm: async () => await deleteUserAction(),
  onCancel: () => {
  }
})

const deleteUserAction = async () => {

  deleteLoading.value = true

  const {data, error} = await Supabase
      .from(tableName('WalletUsers'))
      .delete()
      .eq('walletId', props.walletId)
      .eq('userId', props.user.id)

  deleteLoading.value = false

  if (error) {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error remove user'
    })
    return
  }

  await ApiService('POST', 'v1/wallet/reload-users', {
    walletId: props.walletId,
  })

  edit.value = false

}

const saveUser = async () => {

  saveLoading.value = true

  const {data, error} = await Supabase
      .from(tableName('WalletUsers'))
      .update({
        rights: newUserRights.value
      })
      .eq('walletId', props.walletId)
      .eq('userId', props.user.id)

  saveLoading.value = false

  if (error) {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error update user rights'
    })
    return
  }

  await ApiService('POST', 'v1/wallet/reload-users', {
    walletId: props.walletId,
  })

  edit.value = false

}
</script>