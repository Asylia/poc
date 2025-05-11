<template>
  <ModalWindow id="createNewWalletModal" v-model="show">
    <template #title>
      <h3 class="font-semibold text-gray-800 dark:text-neutral-200">
        Import wallet
      </h3>
    </template>

    <div class="">
      <div class="mt-0 text-center font-bold text-gray-800">
        <div> Upload your wallet configuration file</div>
        <div class="text-xs text-gray-400">Asylia-config.json</div>
      </div>

      <label class="flex items-center justify-center mt-3 w-full">
        <span class="sr-only">Choose profile photo</span>
        <input @change="fileUploaded($event)" type="file" class="block w-auto text-sm text-gray-500
        file:me-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-600 file:text-white
        hover:file:bg-blue-700
        file:disabled:opacity-50 file:disabled:pointer-events-none
        dark:text-neutral-500
        dark:file:bg-blue-500
        dark:hover:file:bg-blue-400
      ">
      </label>
    </div>

    <template #footer>
      <div class="flex  items-center justify-end py-3 px-4 border-t ">
        <BaseButton :loading="loading">
          Upload
        </BaseButton>
      </div>
    </template>
  </ModalWindow>
</template>

<script setup>
import {ref} from "vue"
import BaseButton from "@/components/inputs/BaseButton.vue"
import ModalWindow from "@/components/global/ModalWindow.vue"
import {useUserStore} from "@/stores/UserStore"
import {Supabase} from "@/utils/plugins/Supabase"
import {tableName} from "@/utils/helpers/supabse-db/Index"
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore"
import {ASYLIA_SAFE_KEY_1} from "@/content/PublicKeysEnum"
import {WALLET_USER_RIGHTS_FLAT} from "@/content/Authorization";

const emit = defineEmits(['open-wallet'])

const show = defineModel()
const userStore = useUserStore()
const layoutStore = useLayoutStore()

const loading = ref(false)

const fileUploaded = (e) => {
  loading.value = true

  const file = e.target.files[0]
  const fileExt = file.name.split('.').pop()

  if (fileExt !== 'json') {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Invalid file type'
    })
    loading.value = false
    e.target.value = ''
    return
  }

  const processCaravanConfig = async (config) => {
    try {
      let publicKeys = config.extendedPublicKeys
      publicKeys = publicKeys.filter((key) => key.xpub !== ASYLIA_SAFE_KEY_1.xpub)

      const newWalletData = {
        name: config.name,
        requiredSigners: config.quorum.requiredSigners,
        totalSigners: config.quorum.totalSigners,
        extendedPublicKeys: publicKeys
      }

      const {data, error} = await Supabase.from(tableName('UserWallets')).insert(newWalletData).select().single()

      if (error) {
        layoutStore.addAppNotification({
          type: NOTIFICATIONS_TYPES.ERROR,
          text: 'Error while creating new wallet'
        })
        loading.value = false
        return
      }

      const WalletId = data.id

      const {error: walletUserError} = await Supabase.from(tableName('WalletUsers')).insert({
        walletId: WalletId,
        userId: userStore.userData.id,
        rights: WALLET_USER_RIGHTS_FLAT,
      }).select().single()

      if (walletUserError) {
        layoutStore.addAppNotification({
          type: NOTIFICATIONS_TYPES.ERROR,
          text: 'Error while creating new wallet'
        })
        loading.value = false
        return
      }

      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.SUCCESS,
        text: 'New wallet created'
      })

      loading.value = false
      show.value = false
      emit('open-wallet', WalletId)

    } catch (e) {
      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error while processing wallet configuration file'
      })
      loading.value = false
    }
  }

  const reader = new FileReader()
  reader.onload = async (event) => {
    const text = event.target.result
    const data = JSON.parse(text)
    await processCaravanConfig(data)
  }

  reader.onerror = () => {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error while reading file'
    })
    loading.value = false
  }

  reader.onloadend = () => {
    loading.value = false
  }

  reader.readAsText(file)
}
</script>