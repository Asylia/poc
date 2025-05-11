<template>
  <ModalWindow ref="createNewWalletModal" id="createNewWalletModal" v-model="show">

    <template #title>
      <h3 class="font-semibold text-gray-800 dark:text-neutral-200">
        Create new wallet
      </h3>
    </template>

    <div class="">

      <BaseInput v-model="newWalletState.name" id="wallet-name" name="wallet-name" label="Wallet name"
                 placeholder="wallet 1"
                 type="text"
      />

      <div class="bg-gray-500 mt-2 text-sm text-white rounded-lg p-4 dark:bg-blue-500" role="alert">
        You are creating <b>2</b> of <b>3</b> sing wallet. Sing keys will be added to your wallet later.
      </div>

      <div
          class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
        Or
      </div>

      <BaseButton @click="$emit('open-import-wallet')" class="" :icon="['fas','cloud-arrow-up']" block>
        Upload wallet configuration
      </BaseButton>

    </div>

    <template #footer>
      <div class="flex  items-center justify-end py-3 px-4 border-t ">
        <BaseButton @click="createNewWalletAction" :loading="loading" :disabled="!canCreateNewWallet">
          Save
        </BaseButton>
      </div>
    </template>

  </ModalWindow>
</template>

<script setup>
import {ref, watch, computed} from "vue"
import BaseButton from "@/components/inputs/BaseButton.vue"
import BaseInput from "@/components/inputs/BaseInput.vue"
import ModalWindow from "@/components/global/ModalWindow.vue"
import {useUserStore} from "@/stores/UserStore"
import {Supabase} from "@/utils/plugins/Supabase"
import {tableName} from "@/utils/helpers/supabse-db/Index";
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore"
import createState from "@/comps/CreateState"
import {WALLET_USER_RIGHTS_FLAT} from "@/content/Authorization";

const emit = defineEmits(['open-wallet', 'open-import-wallet'])

const show = defineModel()
const userStore = useUserStore()
const layoutStore = useLayoutStore()

const {state: newWalletState, clearState} = createState({
  name: '',
  signDevicesIds: [],
  signKeys: 3,
  requiredSignKeys: 2,
})

const showCreateNewWallet = ref(false)
const loading = ref(false)
const createNewWalletModal = ref()
const canCreateNewWallet = computed(() => newWalletState.name.length > 0)

const handleWalletCreationError = () => {
  showCreateNewWallet.value = false
  loading.value = false
  layoutStore.addAppNotification({
    type: NOTIFICATIONS_TYPES.ERROR,
    text: 'Error while creating new wallet'
  })
}


const createNewWalletAction = async () => {

  const newWalletData = {
    name: newWalletState.name,
    requiredSigners: 2,
    totalSigners: 3,
    extendedPublicKeys: [],
    // userIdList: [userStore.userData.id],
  }

  loading.value = true


  const {data, error} = await Supabase.from(tableName('UserWallets')).insert(newWalletData).select().single()

  if (error) return handleWalletCreationError()

  const WalletId = data.id

  const {error: walletUserError} = await Supabase.from(tableName('WalletUsers')).insert({
    walletId: WalletId,
    userId: userStore.userData.id,
    rights: WALLET_USER_RIGHTS_FLAT,
  }).select().single()

  if (walletUserError) {
    return handleWalletCreationError()
  }

  layoutStore.addAppNotification({
    type: NOTIFICATIONS_TYPES.SUCCESS,
    text: 'New wallet created'
  })

  showCreateNewWallet.value = false

  createNewWalletModal.value.close(() => {
    loading.value = false
    emit('open-wallet', WalletId)
  })

}

watch(show, clearState)

</script>