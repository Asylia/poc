<template>
  <DashboardCard>

    <AddNewKeyModal @key-added="keyAdded" v-model="showAddNewKey"/>

    <div class="flex items-center justify-between">
      <div class="font-semibold text-lg text-gray-800">
        Wallet keys
      </div>

      <BaseButton id="add-key-button-open-modal" v-if="!walletStore.walletHasAllKeys" @click="showAddNewKey = true"
                  size="sm">
        Add new key
      </BaseButton>

      <template v-else>
        <Authorization :rights="['CAN_EXPORT_WALLET']">
          <BaseButton id="export-wallet-config-button" @click="exportWalletConfiguration" :loading="loadingExport"
                      size="sm">
            Export
          </BaseButton>
        </Authorization>
      </template>


    </div>

    <div id="wallet-keys-list" class="w-full border-t pt-1 mt-2">

      <div v-for="(key,i) in  walletStore.walletConfig.extendedPublicKeys"
           class="flex py-1 items-center  justify-between  "
           :class="{'border-b': i !== walletStore.walletConfig.extendedPublicKeys.length - 1}"
      >
        <SignKey :data="key" :key="i"/>
        <!--        <template v-if="key.method === 'ledger'">-->
        <!--          <div v-if="!ledgerIsInstalled(key,i)">-->
        <!--            <BaseButton @click="installLedger(key)" color="primary" size="xs">-->
        <!--              Install-->
        <!--            </BaseButton>-->
        <!--          </div>-->
        <!--        </template>-->
      </div>

    </div>

  </DashboardCard>
</template>

<script setup>
import {computed, inject, ref, toRaw} from "vue";
import DashboardCard from "@/components/global/DashboardCard.vue"
import BaseButton from "@/components/inputs/BaseButton.vue";
import SignKey from "@/components/views/wallets/single-wallet/SignKey.vue"
import AddNewKeyModal from "@/components/views/keys/list/add-key/AddNewKeyModal.vue";
import {Supabase} from "@/utils/plugins/Supabase";
import {tableName} from "@/utils/helpers/supabse-db/Index";
import {useWalletStore} from "@/stores/wallet/Wallet";
import {NOTIFICATIONS_TYPES, useLayoutStore} from "@/stores/LayoutStore";
import {BIP32Factory} from "bip32";
import * as ecc from "tiny-secp256k1";
import LedgerInteraction from "@/services/hw-wallet/Ledger";
import ApiService from "@/services/ApiService"
import JSZip from "jszip";
import {sleep} from "@/utils/helpers/general";
import Authorization from "@/components/views/wallets/Authorization.vue";
import {useUserStore} from "@/stores/UserStore";

const layoutStore = useLayoutStore()
const bip32 = BIP32Factory(ecc)
const walletStore = useWalletStore()
const showAddNewKey = ref(false)


const loadingExport = ref(false)
const exportWalletConfiguration = async () => {
  loadingExport.value = true
  await sleep(1500)

  try {
    const parseName = name => name.split(' ').join('-')

    const walletConf = JSON.parse(JSON.stringify(walletStore.walletConfig))
    delete walletConf['uuid']

    // Inicializácia JSZip
    const zip = new JSZip();

    // Pridanie prvého súboru (caravan)
    const caravanDataStr = JSON.stringify(walletConf);
    zip.file('Asylia ' + parseName(walletConf.name) + ".json", caravanDataStr);

    // Pridanie druhého súboru (descriptor)
    let descriptorStart = `sh(wsh(sortedmulti(${walletConf.quorum.requiredSigners},`;

    const deviceDescriptors = walletConf.extendedPublicKeys.map(key => {
      const formattedPath = key.bip32Path.replace(/m\/48'\/0'\/1'/g, "48h/0h/1h");
      return `[${key.xfp}/${formattedPath}]${key.xpub}/<0;1>/*`;
    });

    const descriptor = `${descriptorStart}${deviceDescriptors.join(',')})))`;

    zip.file('Asylia ' + parseName(walletConf.name) + '.txt', descriptor);

    // Generovanie zip súboru a stiahnutie
    zip.generateAsync({type: "blob"})
        .then(function (content) {
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Asylia ' + parseName(walletConf.name) + '.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          loadingExport.value = false
        })
        .catch(() => loadingExport.value = false)
  } catch (e) {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error while exporting wallet configuration'
    })
    loadingExport.value = false
  }
}

const userStore = useUserStore()
const keyAdded = async key => {

  walletStore.loading = true

  const {error: saveError} = await ApiService('POST', 'v1/wallet/add-wallet-key', {
    key,
    walletId: walletStore.walletId
  })

  if (saveError) {
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

  // await walletStore.loadWallet(true)

}


const sortedKeys = computed(() => {

  const walletKeysList = [...walletStore.walletConfig.extendedPublicKeys]

  function getPublicKeyFromXpub(xpub) {
    const node = bip32.fromBase58(xpub);
    // const child = node.derivePath('0/0')
    // return child.publicKey.toString('hex')
    return node.publicKey.toString('hex');
  }

  const walletKeys = walletKeysList.map(key => ({
    ...key,
    publicKey: getPublicKeyFromXpub(key.xpub)
  }));

  // sort keys by public key
  walletKeys.sort((a, b) => {
    if (a.publicKey < b.publicKey) return -1;
    if (a.publicKey > b.publicKey) return 1;
    // if (a.xfp < b.xfp) return -1;
    // if (a.xfp > b.xfp) return 1;
    return 0;
  });


  return walletKeys

})

const ledgerIsInstalled = (key, i) => {

  if (key.method !== 'ledger') return false

  let ledgerOrder = 0
  for (let j = 0; j < sortedKeys.value.length; j++) {
    if (sortedKeys.value[j].method === 'ledger') {
      ledgerOrder++
    }
    if (j === i) {
      break
    }
  }

  const ledgerOrderIndex = ledgerOrder - 1

  return walletStore.walletConfig.ledgerPolicyHmacs[ledgerOrderIndex] !== undefined

}

const installLedger = async key => {

  try {
    const {data, error} = await LedgerInteraction.installWallet(walletStore.walletConfig.name, sortedKeys.value)

    if (error) {
      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Ledger wallet not installed'
      })
      return
    }

    const {error: saveError} = await ApiService('POST', 'v1/wallet/add-wallet-ledger-policy', {
      policy: data,
      walletId: walletStore.walletId
    })

    if (saveError) {
      return layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error while updating ledger policy, try again later.'
      })
    }
    // cabdfd25aa6a65f83474b8b53e7851e019b0ed899e33536754c96eb51c6ca81f

    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.SUCCESS,
      text: 'Ledger wallet installed'
    })

  } catch (e) {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Ledger wallet not installed'
    })
  }

}


</script>