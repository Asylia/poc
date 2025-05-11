<template>

  <tr>

    <ModalWindow size="lg" id="single-t" v-model="s">

      <template #title>

        <div class="max-w-ull">
          <h3 class="font-semibold text-gray-800 dark:text-neutral-200">
            Transaction details
          </h3>
          <div class="flex text-pretty  items-center space-x-0.5 text-xs">
            <div class="font-bold text-pretty ">ID:</div>
            <div class="text-pretty ">{{ props.psbt.id }}</div>
          </div>
        </div>
      </template>

      <div class="w-full text-gray-800">

        <div class="font-semibold ">Transaction hash:</div>
        <div @click="openTxInMempool(transactionData.id)"
             class="font-light text-blue-500 hover:cursor-pointer text-pretty break-words hover:underline">
          {{ transactionData.id }}
        </div>

        <div class="text-sm opacity-75">
          When you broadcast transaction, it will be visible on the blockchain under this hash
        </div>

        <hr class="mt-4 mb-3">

        <div class="font-semibold text-gradient  ">Details</div>

        <div class="flex mt-1 items-center justify-between">
          <div class=" ">Created:</div>
          <div class="font-light">
            {{ formatDateTimeFromDB(props.psbt.createdAt) }}
          </div>
        </div>

        <div class="md:flex mt-1 items-end justify-between">
          <div class=" ">Receiver:</div>
          <div @click="openAddressInMempool(props.psbt.receiver)"
               class="font-light md:text-base text-blue-500 hover:cursor-pointer hover:underline">{{
              props.psbt.receiver
            }}
          </div>
        </div>

        <div class="flex mt-1 items-start justify-between">
          <div class=" ">Amount:</div>
          <div class=" ">
            <BtcSatsValue :satoshi="props.psbt.amount" v-slot="{value,currency,fiat}">
              <div class="flex flex-col justify-end items-end">
                <div class="space-x-2">
                  <b>{{ value }}</b>
                  <span class="text-xs ">{{ currency }}</span>
                </div>
                <div class="space-x-2">
                  <b>{{ fiat }}</b>
                  <span class="text-xs ">{{ coinStore.getSelectedCurrency }}</span>
                </div>
              </div>
            </BtcSatsValue>
          </div>
        </div>


        <div class="flex mt-1 items-start justify-between">
          <div class=" ">Fee:</div>
          <div class="">
            <BtcSatsValue :satoshi="props.psbt.fee" v-slot="{value,currency,fiat}">
              <div class="flex flex-col justify-end items-end">
                <div class="space-x-2">
                  <b>{{ value }}</b>
                  <span class="text-xs ">{{ currency }}</span>
                </div>
                <div class="space-x-2">
                  <b>{{ fiat }}</b>
                  <span class="text-xs ">{{ coinStore.getSelectedCurrency }}</span>
                </div>
              </div>
            </BtcSatsValue>
          </div>
        </div>

        <div class="flex mt-1 items-center justify-between">
          <div class=" ">Speed:</div>
          <div class="flex space-x-1 ">
            <span class="font-bold">{{ transactionData.speed }} </span>
            <span class="opacity-75">s/vB</span>
          </div>
        </div>

        <div class="flex mt-1 items-center justify-between">
          <div class=" ">Size:</div>
          <div class="flex space-x-1 ">
            <span class="font-bold">{{ props.psbt.estimatedSize }}</span>
            <span class="opacity-75">vB</span>
          </div>
        </div>

        <div class="flex mt-1 items-center justify-between">
          <div class=" ">Missing signatures to broadcast:</div>
          <div class="font-semibold text-lg text-gradient">
            <template v-if="hasAllSignatures">
              Fully signed
            </template>
            <template v-else>
              {{ 2 - singedXfpList.length }}
            </template>
          </div>
        </div>

        <template v-if="transactionData.change.hasChange && showAdvanced">

          <div class="font-semibold text-gradient mt-1 ">Change</div>

          <div class="md:flex mt-1 items-center justify-between">
            <div class=" ">Change address:</div>
            <div @click="openAddressInMempool(transactionData.change.address)"
                 class="font-light text-blue-500 hover:cursor-pointer hover:underline">
              {{ transactionData.change.address }}
            </div>
          </div>

          <div class="flex mt-1 items-center justify-between">
            <div class=" ">Change value:</div>
            <div class="">
              <BtcSatsValue :satoshi="transactionData.change.value" v-slot="{value,currency}">
              <span class="space-x-2">
                <b>{{ value }}</b>
                <span class="text-xs ">{{ currency }}</span>
              </span>
              </BtcSatsValue>
            </div>
          </div>
        </template>


        <div class="font-semibold text-gradient mt-4 ">Sign transaction</div>


        <div class="mt-2">
          <SingleSignedKey v-for="(key,i) in walletStore.walletConfig.extendedPublicKeys"
                           :device="key"
                           :singedXfpList="singedXfpList"
                           :key="i"
                           :currentlySigningXfp="currentlySigningXfp"
                           :isLast="i === walletStore.walletConfig.extendedPublicKeys.length - 1"
                           :isLocked="hasAllSignatures"
                           @makeSign="makeSign(key)"
          />
        </div>


        <hr class="my-4">

        <div class="flex mt-1 items-center justify-between">
          <div class=" ">
            Export:
          </div>
          <div class="flex space-x-2">
            <div class="border-r pr-2">
              <BaseButton size="sm" :icon="['fal','copy']" @click="copyTransaction">
                Copy
              </BaseButton>
            </div>
            <BaseButton size="sm" :icon="['fal','file-export']" @click="exportTransactionAsHex">
              Hex
            </BaseButton>
            <BaseButton size="sm" :icon="['fal','file-export']" @click="exportTransactionAsBase64">
              Base64
            </BaseButton>
          </div>
        </div>

      </div>

      <template #footer>
        <div class="flex  items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700 justify-between">
          
          <div class="flex space-x-2 items-center">

            <Toggle v-model="showAdvanced" label="Advanced" id="advanced-mode" reverse/>

            <Authorization :rights="['CAN_DELETE_TRANSACTIONS']">
              <span class="opacity-20">|</span>
              <div @click="cancelPsbt" class="flex items-center space-x-2 hover:cursor-pointer hover:opacity-75">
                <font-awesome-icon :icon="['fal','trash']" :class="props.size"
                                   class=" text-xs text-red-500 "
                />
                <span class="text-red-500 text-xs">Delete</span>
              </div>
            </Authorization>

          </div>

          <BaseButton :icon="['fad','satellite-dish']" @click="brodcastTransaction" :loading="broadCasting"
                      :disabled="!hasAllSignatures">
            Broadcast transaction
          </BaseButton>

        </div>
      </template>

    </ModalWindow>

    <td @click="s = true" class="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
      {{ props.psbt.receiver }}
    </td>
    <td @click="s = true" style="width: 121px"
        class="px-2 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
      <BtcSatsValue :satoshi="props.psbt.amount" v-slot="{value,currency}">
      <span class="space-x-2">
        <b>{{ value }}</b>
        <span class="text-xs text-gray-500">{{ currency }}</span>
      </span>
      </BtcSatsValue>
    </td>

    <!--    <td style="width: 121px" class="px-2 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">-->
    <!--      <BtcSatsValue :satoshi="props.psbt.fee" v-slot="{value,currency}">-->
    <!--      <span class="space-x-2">-->
    <!--        <b>{{ value }}</b>-->
    <!--        <span class="text-xs text-gray-500">{{ currency }}</span>-->
    <!--      </span>-->
    <!--      </BtcSatsValue>-->
    <!--    </td>-->

    <td @click="s = true" class="px-2 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
      {{ formatDateFromDB(props.psbt.createdAt) }}
    </td>
    <td @click="s = true" class="px-2 py-4 whitespace-nowrap text-end text-sm font-medium">
      <div class="py-2 px-2 hover:cursor-pointer ">
        <font-awesome-icon :icon="['fal',   'angle-down' ]"
                           class=" text-xl text-blue-500 "
        />
      </div>
    </td>
  </tr>

</template>

<script setup>
import {ref, watch, nextTick, computed, inject, toRaw, reactive, onBeforeUnmount} from 'vue'
import SingleSignedKey from "@/components/views/wallets/single-wallet/transactions/psbt/SigleSignedKey.vue"
import BaseButton from "@/components/inputs/BaseButton.vue"
import {KEY_TYPES} from "@/content/PublicKeysEnum";
import {tableName} from "@/utils/helpers/supabse-db/Index";
import {Supabase} from "@/utils/plugins/Supabase"
import {sleep} from "@/utils/helpers/general"
import TrezorInteraction from "@/services/hw-wallet/Trezor"
import LedgerInteraction from "@/services/hw-wallet/Ledger"
import {createP2SHTOP2WSHWallet} from '@/comps/Wallet'
import {findPublicKeyForSignature} from '@/comps/Signatures'
import {PSBT_STATUS_ENUM} from "@/comps/Psbt"
import * as bitcoin from "bitcoinjs-lib"
import {PsbtV2} from '@caravan/psbt'
import {useStorage} from '@vueuse/core'
import {NOTIFICATIONS_TYPES, useLayoutStore} from "@/stores/LayoutStore";
import {formatDateFromDB, formatDateTimeFromDB} from "@/utils/helpers/DateTime";

import ModalWindow from "@/components/global/ModalWindow.vue";
import {useWalletStore} from "@/stores/wallet/Wallet";
import ApiService from "@/services/ApiService";
import {BIP32Factory} from "bip32";
import * as ecc from "tiny-secp256k1";
import {useCoinStore} from "@/stores/CoinStore";
import Toggle from "@/components/inputs/Toggle.vue";
import Authorization from "@/components/views/wallets/Authorization.vue";

const s = ref(false)

const props = defineProps({
  psbt: {
    type: Object,
    required: true
  }
})

const bip32 = BIP32Factory(ecc)
const layoutStore = useLayoutStore()
const walletStore = useWalletStore()
const coinStore = useCoinStore()

const network = bitcoin.networks.bitcoin

const openedTransactionsList = useStorage('openedTransactionsList', [])
const broadCasting = ref(false)
const currentlySigningXfp = ref(null)
const singedXfpList = ref([])

const hasAllSignatures = computed(() => singedXfpList.value.length === 2)

const psbt = bitcoin.Psbt.fromBase64(props.psbt.psbtV1Base64, {network})
const psbtv2 = PsbtV2.FromV0(psbt.toBuffer(), true)

const getSingedXfpList = () => {

  const psbt = bitcoin.Psbt.fromBase64(props.psbt.psbtV1Base64, {network})
  const input0 = psbt.data.inputs[0]
  const partialSings = input0?.partialSig ?? []
  if (partialSings.length === 0) return []

  return partialSings.map(sig => {
    const bip32Derivation = input0.bip32Derivation.find(d => d.pubkey.toString('hex') === sig.pubkey.toString('hex'))
    if (bip32Derivation) return bip32Derivation.masterFingerprint.toString('hex')
    return null
  }).filter(item => item !== null)

}

const showAdvanced = ref(false)
const iAmSigning = ref(false)

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

const setCurrentXfp = async xfp => {
  currentlySigningXfp.value = xfp

  const {error} = await Supabase
      .from(tableName('UserWalletsPsbt'))
      .update({
        currentlySigningXfp: xfp
      })
      .eq('id', props.psbt.id)

  if (error) {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error during setting current xfp.'
    })
  }

}

const makeSign = async device => {
  iAmSigning.value = true
  await setCurrentXfp(device.xfp)
  const psbt = bitcoin.Psbt.fromBase64(props.psbt.psbtV1Base64, {network})
  const transactionHex = psbt.__CACHE.__TX.toBuffer().toString('hex')
  const transaction = bitcoin.Transaction.fromHex(transactionHex)

  if (device.method === KEY_TYPES.TREZOR) {

    const {publicKeys: publicKeys00} = createP2SHTOP2WSHWallet({
      m: walletStore.walletConfig.quorum.requiredSigners,
      exportedPublicKeys: walletStore.walletConfig.extendedPublicKeys,
      derivePath: '0/0'
    })

    const {data, error} = await TrezorInteraction.signPSBTTransaction({
      psbt,
      derivedPublicKeys: publicKeys00,
      m: walletStore.walletConfig.quorum.requiredSigners
    })

    if (error) {
      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error during signing.'
      })
      // todo
      await setCurrentXfp(null)
      return
    }

    for (let i = 0; i < data.signatures.length; i++) {

      const psbtInput = psbt.data.inputs[i]

      const hashForWitnessV0 = transaction.hashForWitnessV0(i, psbtInput.witnessScript, psbtInput.witnessUtxo.value, bitcoin.Transaction.SIGHASH_ALL)
      const mappedInputBip32Derivation = psbtInput.bip32Derivation.map(d => d.pubkey)
      const singedByPublicKey = findPublicKeyForSignature(data.signatures[i], hashForWitnessV0, mappedInputBip32Derivation)
      const signatureIsValid = singedByPublicKey !== -1

      // todo
      if (!signatureIsValid) {
        layoutStore.addAppNotification({
          type: NOTIFICATIONS_TYPES.ERROR,
          text: 'Invalid signature.'
        })
        return
      }

      psbt.updateInput(i, {
        partialSig: [
          {
            pubkey: singedByPublicKey,
            signature: Buffer.from(data.signatures[i], 'hex')
          }
        ]
      })

    }


    const {
      error: updatePsbtError,
    } = await Supabase.from(tableName('UserWalletsPsbt'))
        .update({psbtV1Base64: psbt.toBase64()})
        .eq('id', props.psbt.id)

    if (updatePsbtError) {
      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error during save signature.'
      })
      await setCurrentXfp(null)
      return
    }

    await setCurrentXfp(null)

    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.SUCCESS,
      text: 'Signature added successfully.'
    })


  }

  if (device.method === KEY_TYPES.LEDGER) {

    const psbtv2 = PsbtV2.FromV0(psbt.toBuffer(), true)

    const {
      data,
      error
    } = await LedgerInteraction.signPsbtTransaction(psbtv2, walletStore.walletConfig.name, sortedKeys.value)

    if (error) {
      // todo
      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error during signing.'
      })
      await setCurrentXfp(null)
      return
    }

    if (data.length !== psbt.data.inputs.length) {
      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error during signing.'
      })
      await setCurrentXfp(null)
      return
    }

    data.forEach((signature, i) => {

      const psbtInput = psbt.data.inputs[i]
      const hashForWitnessV0 = transaction.hashForWitnessV0(i, psbtInput.witnessScript, psbtInput.witnessUtxo.value, bitcoin.Transaction.SIGHASH_ALL)
      const mappedInputBip32Derivation = psbtInput.bip32Derivation.map(d => d.pubkey)
      const singedByPublicKey = findPublicKeyForSignature(signature.signature, hashForWitnessV0, mappedInputBip32Derivation)
      const signatureIsValid = singedByPublicKey !== -1

      // todo
      if (!signatureIsValid) {
        layoutStore.addAppNotification({
          type: NOTIFICATIONS_TYPES.ERROR,
          text: 'Invalid signature.'
        })
        return
      }

      psbt.updateInput(i, {
        partialSig: [{
          pubkey: signature.pubkey,
          signature: Buffer.from(signature.signature, 'hex')
        }],
      })

    })

    const {
      error: updatePsbtError,
    } = await Supabase.from(tableName('UserWalletsPsbt'))
        .update({psbtV1Base64: psbt.toBase64()})
        .eq('id', props.psbt.id)

    if (updatePsbtError) {
      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error during save signature.'
      })
      await setCurrentXfp(null)
      return
    }

    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.SUCCESS,
      text: 'Signature added successfully.'
    })

    await setCurrentXfp(null)

  }

}

const brodcastTransaction = async () => {

  broadCasting.value = true


  const psbt = bitcoin.Psbt.fromBase64(props.psbt.psbtV1Base64, {network})
  psbt.finalizeAllInputs()

  const transaction = psbt.extractTransaction();
  const transactionHash = transaction.getId();
  const finalTxHex = transaction.toHex();

  // const url = 'https://blockstream.info/api/tx';
  const url = 'https://api.blockcypher.com/v1/btc/main/txs/push';

  const data = {
    tx: finalTxHex
  };
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(async response => {
    if (response.status === 201) {

      // alert('Transakcia bola úspešne odoslaná: ' + transactionHash)

      await sleep(2000)

      await ApiService('POST', 'v1/wallet/reload-balance', {
        walletId: walletStore.walletId
      })

      const {error: psbtDataListError} = await Supabase
          .from(tableName('UserWalletsPsbt'))
          .update({
            status: PSBT_STATUS_ENUM.BROADCASTED
          })
          .eq('id', props.psbt.id)

      if (psbtDataListError) {
        layoutStore.addAppNotification({
          type: NOTIFICATIONS_TYPES.ERROR,
          text: 'Error during updating transaction status.'
        })
        broadCasting.value = false
        return
        // todo
      }

      broadCasting.value = false

      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.SUCCESS,
        text: 'Transaction broadcasted successfully.'
      })

    }

  }).catch((error) => {
    // console.error('Chyba pri odosielaní transakcie:', error);
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error during broadcasting transaction.'
    })
  })
}

const transactionData = reactive({
  id: '',
  change: {
    hasChange: false,
    address: '',
    value: 0
  }
})

watch(() => props.psbt, () => {
// watch(() => props.psbt.psbtV1Base64, () => {
  singedXfpList.value = getSingedXfpList()
  // bitcoinPsbt.value =
  const psbt = bitcoin.Psbt.fromBase64(props.psbt.psbtV1Base64, {network})
  const transactionHex = psbt.__CACHE.__TX.toBuffer().toString('hex')
  const t = bitcoin.Transaction.fromHex(transactionHex)
  transactionData.id = t.getId()

  // walletState.address
  const inputsSum = psbt.data.inputs.reduce((acc, item) => acc + item.witnessUtxo.value, 0)
  const changeValue = inputsSum - props.psbt.amount - props.psbt.fee

  transactionData.speed = Number(props.psbt.fee / props.psbt.estimatedSize).toFixed(2)

  if (psbt.txOutputs.length > 1) {
    for (const output of psbt.txOutputs) {
      if (output.value === changeValue) {
        transactionData.change.hasChange = true
        transactionData.change.address = output.address
        transactionData.change.value = changeValue
        break
      }
    }
  }


}, {deep: true, immediate: true})

const psbtIsInOpenedList = () => openedTransactionsList.value.includes(props.psbt.id)

watch(() => s.value, v => {
  if (!v) {
    openedTransactionsList.value = openedTransactionsList.value.filter(id => id !== props.psbt.id)
  } else {
    if (!psbtIsInOpenedList()) {
      openedTransactionsList.value.push(props.psbt.id)
    }
  }
})

if (psbtIsInOpenedList()) setTimeout(() => {
  s.value = true
}, 500)

const cancelPsbt = () => {

  layoutStore.confirmAction({
    title: 'Are you sure ?',
    text: 'This is invertible action. You will have to create new transaction.',
    onConfirm: async () => {
      const {error} = await Supabase.from(tableName('UserWalletsPsbt')).delete().eq('id', props.psbt.id)
      s.value = false

      if (error) return layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error during deleting transaction.'
      })

      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.SUCCESS,
        text: 'Transaction deleted.'
      })

    },
    onCancel: () => {
    },
  })

}

const copyTransaction = () => {
  const psbt = bitcoin.Psbt.fromBase64(props.psbt.psbtV1Base64, {network})
  const transactionHex = psbt.toHex()
  navigator.clipboard.writeText(transactionHex)
  layoutStore.addAppNotification({
    type: NOTIFICATIONS_TYPES.SUCCESS,
    text: 'Transaction copied to clipboard in HEX format.'
  })

}
// export transaction as .txt in hex format
const exportTransactionAsHex = () => {
  const psbt = bitcoin.Psbt.fromBase64(props.psbt.psbtV1Base64, {network})
  const transactionHex = psbt.toHex()
  const blob = new Blob([transactionHex], {type: 'text/plain'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transaction.txt'
  a.click()
  URL.revokeObjectURL(url)
  layoutStore.addAppNotification({
    type: NOTIFICATIONS_TYPES.SUCCESS,
    text: 'Transaction exported as transaction.txt file in HEX format.'
  })
}

const exportTransactionAsBase64 = () => {
  // const psbt = bitcoin.Psbt.fromBase64(props.psbt.psbtV1Base64, {network})
  const transactionBase64 = props.psbt.psbtV1Base64
  const blob = new Blob([transactionBase64], {type: 'text/plain'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transaction.txt'
  a.click()
  URL.revokeObjectURL(url)
  layoutStore.addAppNotification({
    type: NOTIFICATIONS_TYPES.SUCCESS,
    text: 'Transaction exported as transaction.txt file in Base64 format.'
  })
}

const openAddressInMempool = address => window.open('https://mempool.space/address/' + address, '_blank')
const openTxInMempool = tx => window.open('https://mempool.space/tx/' + tx, '_blank')

</script>