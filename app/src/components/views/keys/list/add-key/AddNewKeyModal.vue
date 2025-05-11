<template>

  <ModalWindow id="add-new-key-modal" v-model="show">

    <template #title>
      <h3 class="font-semibold text-gray-800 dark:text-neutral-200">
        Add new sign key
      </h3>
    </template>

    <div class="space-y-5">

      <div>

        <BaseInput v-model="addNewKeyState.name" id="new-key-name" name="new-key-name" label="Key name"
                   placeholder="My trezor / ledger 1"
                   type="text"
        />

      </div>

    </div>

    <div class="mt-4">

      <label class="block text-sm mb-2 dark:text-white">
        Device Type
      </label>

      <div class="w-full flex space-x-4">

        <KeyOption :title="KEY_TYPES_DATA[KEY_TYPES.TREZOR].name"
                   :image="KEY_TYPES_DATA[KEY_TYPES.TREZOR].image"
                   v-model="addNewKeyState.type"
                   :value="KEY_TYPES.TREZOR"
        />

        <KeyOption :title="KEY_TYPES_DATA[KEY_TYPES.LEDGER].name"
                   :image="KEY_TYPES_DATA[KEY_TYPES.LEDGER].image"
                   v-model="addNewKeyState.type"
                   :value="KEY_TYPES.LEDGER"
                   :coming-soon="false"
        />

      </div>

      <hr class="mt-5">

      <template v-if="[KEY_TYPES.LEDGER,KEY_TYPES.TREZOR,KEY_TYPES.COLD_CARD].includes(addNewKeyState.type)">

        <div class="w-full mt-4">

          <div v-if="hasExportedPublicKey" class="w-full">

            <div class="w-ful">
              <div class="w-full space-x-10 flex items-cente justify-between">
                <span class="text-base font-bold">BIP32 PATH:</span>
                <span class="text-xs">
      {{ addNewKeyState.key.path }}
    </span>
              </div>
              <div class="w-full  flex items-cstart justify-between">
                <span class="font-bold text-base">XPUB:</span>
                <span class="pl-20 text-xs" style="overflow-wrap: anywhere;">
      {{ addNewKeyState.key.xpub }}
    </span>
              </div>
            </div>

            <BaseButton @click="clearState" color="danger" class="mt-2" :icon="['fal','trash']" :block="true">
              Remove
            </BaseButton>

          </div>

          <BaseButton v-else @click="connectToDevice" :loading="exportInProcess" :disabled="!hasSelectedType"
                      :block="true">
            Connect to device
          </BaseButton>

        </div>

      </template>

    </div>

    <template #footer>
      <div class="flex  items-center justify-end py-3 px-4 border-t ">
        <BaseButton @click="saveNewKey" :loading="saveing" :disabled="!canSave">
          Save
        </BaseButton>
      </div>
    </template>

  </ModalWindow>

</template>

<script setup>
import {ref, watch, reactive, computed} from "vue"
import ModalWindow from "@/components/global/ModalWindow.vue"
import BaseButton from "@/components/inputs/BaseButton.vue"
import BaseInput from "@/components/inputs/BaseInput.vue"
import KeyOption from "@/components/views/keys/list/add-key/KeyOption.vue"
import DisplayExportedXpub from "@/components/views/keys/list/add-key/DisplayExportedXpub.vue"
import {tableName} from '@/utils/helpers/supabse-db/Index'
import {Supabase} from '@/utils/plugins/Supabase'
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore"
import {useUserStore} from "@/stores/UserStore"
import TrezorInteraction from '@//services/hw-wallet/Trezor'
import LedgerInteraction from '@//services/hw-wallet/Ledger'

import {
  KEY_TYPES,
  MAIN_BIP32_PATH,
  KEY_TYPES_DATA,
} from "@/content/PublicKeysEnum"
import createState from "@/comps/CreateState";
import ApiService from "@/services/ApiService";
import {useWalletStore} from "@/stores/wallet/Wallet";

const emit = defineEmits(['reload-keys', 'key-added'])

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const show = defineModel()

const emptyExportedPublicKey = {
  xpub: '',
  path: MAIN_BIP32_PATH,
  childNum: null,
  chainCode: null,
  publicKey: null,
  fingerprint: null,
  depth: null,
  caravanXfp: null,
}
// addNewKeyState.key.xpub.length !== 0 && addNewKeyState.key.xfp.length !== 0 && exportInProcess.value === false

const EMPTY_STATE = {
  type: KEY_TYPES.TREZOR,
  name: '',
  key: {
    path: '',
    xpub: '',
    xfp: ''
  },
}
const addNewKeyState = reactive({...EMPTY_STATE})

const saveing = ref(false)
const exportInProcess = ref(false)
const hasSelectedType = computed(() => addNewKeyState.type.length > 0)
const hasExportedPublicKey = computed(() => addNewKeyState.key.xpub.length !== 0 && addNewKeyState.key.xfp.length !== 0 && exportInProcess.value === false)
// const exportedPublicKeyValid = computed(() => addNewKeyState.exportedPublicKey.xpub.length > 0 && !exportInProcess.value)
const canSave = computed(() => addNewKeyState.name.length > 0 && hasSelectedType.value && hasExportedPublicKey.value)

const connectToDevice = async () => {
  exportInProcess.value = true

  try {
    const {
      data,
      error
    } = addNewKeyState.type === KEY_TYPES.TREZOR ? await TrezorInteraction.exportPublicKey(MAIN_BIP32_PATH) : await LedgerInteraction.getBitcoinPublicKey(MAIN_BIP32_PATH)

    if (error) {
      exportInProcess.value = false
      alert(error)
      console.error('Error:', error);
      return
    }

    Object.assign(addNewKeyState.key, data.key)

  } catch (e) {
    alert('Error: ' + e?.error)
  } finally {
    exportInProcess.value = false

  }

}

const walletStore = useWalletStore()

const saveNewKey = async () => {
  saveing.value = true

  const deviceData = {
    name: addNewKeyState.name,
    method: addNewKeyState.type,
    userId: userStore.userData.id,
    path: addNewKeyState.key.path,
    xpub: addNewKeyState.key.xpub,
    xfp: addNewKeyState.key.xfp,
    hmacs: [],
  }

  const key = {
    name: deviceData.name,
    method: deviceData.method,
    bip32Path: deviceData.path,
    xpub: deviceData.xpub,
    xfp: deviceData.xfp,
  }

  const {error: saveError} = await ApiService('POST', 'v1/wallet/add-wallet-key', {
    key,
    walletId: walletStore.walletId
  })

  if (saveError) {
    saveing.value = false
    return layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error while adding key, try again later.'
    })
  } else {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.SUCCESS,
      text: 'Key added'
    })
  }

  saveing.value = false
  show.value = false

}

const clearState = () => {
  addNewKeyState.key.path = ''
  addNewKeyState.key.xfp = ''
  addNewKeyState.key.xpub = ''
}
watch(() => show.value, clearState)

</script>