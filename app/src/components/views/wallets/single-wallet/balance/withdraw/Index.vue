<template>
  <ModalWindow size="md" ref="makeWithdrawModal" id="makeWithdrawModal" v-model="show">

    <template #title>
      <h3 class="font-semibold text-gray-800 dark:text-neutral-200">
        <template v-if="transactionStep === 1">
          New transaction
        </template>
        <template v-else>
          Summary
        </template>
      </h3>
    </template>

    <div class="w-full">
      <template v-if="transactionStep === 1">

        <div class="mt-2 font-bold text-lg">
          Receive address
        </div>

        <BaseInput v-model="state.receiverAddress" id="amount" name="amount"
                   type="text"
                   required
                   class=""
        />

        <div class="mt-4 flex items-center justify-between ">
          <span class="font-bold text-lg">Amount</span>
        </div>

        <BaseInput v-model="amountInputValue" id="amount" name="amount" type="number"
                   :label="showInputValueRatio ? 'Ratio:':''" required>

          <template #top-right v-if="showInputValueRatio">
            {{ convertedAmountInOtherCurrencies }}
          </template>

          <template #addons>
            <div class="absolute inset-y-0 end-0 flex items-center text-gray-500 pe-px">
              <label for="hs-inline-leading-select-currency" class="sr-only">Currency</label>
              <select v-model="selectedFeeOption" id="hs-inline-leading-select-currency"
                      name="hs-inline-leading-select-currency"
                      class="block w-full border-transparent rounded-lg focus:ring-blue-600 focus:border-blue-600 dark:text-neutral-500 dark:bg-neutral-800">
                <option v-for="(op,i) in INPUT_FEE_OPTIONS" :value="op.value">
                  {{ op.text }}
                </option>
              </select>
            </div>
          </template>
        </BaseInput>

        <!--        !notEnoughFundsForSelectedFee.value && !amountTooLow.value && utxoOk.value && state.receiverAddress.length > 0 && Number(state.amount) >= dustLimit-->

        <!-- START DEBUG -->
        <!--                <div class="flex justify-between">-->
        <!--                  <div>state.receiverAddress.length > 0:</div>-->
        <!--                  <div>{{ state.receiverAddress.length > 0 }}</div>-->
        <!--                </div>-->

        <!--        <div class="flex justify-between">-->
        <!--                  <div>Number(state.amount) >= dustLimit</div>-->
        <!--                  <div>{{ Number(state.amount) >= dustLimit }}</div>-->
        <!--                </div>-->

        <!--        <hr>-->

        <!--        <div class="flex justify-between">-->
        <!--                  <div>withDrawAmountInSat:</div>-->
        <!--                  <div>{{ withDrawAmountInSat }}</div>-->
        <!--                </div>-->

        <!--                <div class="flex justify-between">-->
        <!--                  <div>withDrawIsBiggerThanMax:</div>-->
        <!--                  <div>{{ withDrawIsBiggerThanMax }}</div>-->
        <!--                </div>-->

        <!--                <div class="flex justify-between">-->
        <!--                  <div>maximumWithDrawWithSelectedFee:</div>-->
        <!--                  <pre>{{ maximumWithDrawWithSelectedFee }}</pre>-->
        <!--                </div>-->

        <!--                <div class="flex justify-between">-->
        <!--                  <div>notEnoughFundsForSelectedFee:</div>-->
        <!--                  <div>{{ notEnoughFundsForSelectedFee }}</div>-->
        <!--                </div>-->

        <!--                <div class="flex justify-between">-->
        <!--                  <div>utxoOk:</div>-->
        <!--                  <div>{{ utxoOk }}</div>-->
        <!--                </div>-->

        <!--                <div class="flex justify-between">-->
        <!--                  <div>maximumWithDrawForSelectedCurrency:</div>-->
        <!--                  <div>{{ maximumWithDrawForSelectedCurrency }}</div>-->
        <!--                </div>-->

        <!--END DEBUG -->

        <!--  Set min/max -->
        <div class="flex mt-1 w-full justify-between">

          <MinMaxVal :amount="minWithDraw" @set-value="setMinInput">
            Min:
          </MinMaxVal>

          <MinMaxVal :amount="maximumWithDrawWithSelectedFee" class="justify-end flex" @click="setMaxInput">
            Max:
          </MinMaxVal>

        </div>

        <!--  Errors -->
        <NotEnoughFounds v-if="notEnoughFundsForSelectedFee"
                         :currency="selectedFeeOption"
                         :maximumWithDrawForSelectedCurrency="maximumWithDrawForSelectedCurrency"
                         @set-maximum-amount="setMaxInput"
        />

        <MinWithdraw v-else-if="amountTooLow"
                     :minWithdraw="minWithDrawForSelectedCurrency"
                     :currency="selectedFeeOption"
                     @set-min-amount="setMinInput"/>

        <!--  Transaction fee -->
        <div class="mt-2 mt-2 font-bold text-lg">
          Transaction fee
        </div>

        <div class="w-full border px-4 pt-2 pb-4 rounded-xl mt-2 ">

          <div class="flex w-full "
               :class="utxoOk && selectedUtoxos.dust ? 'justify-between':''"
          >

            <div>
              <span class="text-sm font-bold mr-1">{{ state.fee }}</span>
              <span class="text-xs">sat/vB</span>
            </div>

            <div v-if="utxoOk && selectedUtoxos.dust">
              <span class="text-xs  mr-1">With 'dust':</span>
              <span class="text-blue-500  text-sm font-bold">{{
                  Number((selectedUtoxos.finalFee) / selectedUtoxos.estimatedSize).toFixed(2)
                }}  sat/vB</span>
              <!--                    <span v-else class="text-xs font-bold">-</span>-->
              <!--                    <span v-if="utxoOk" class="text-xs font-bold">{{ selectedUtoxos.estimatedSize }}  vB</span>-->
              <!--                    <span v-else class="text-xs font-bold">-</span>-->
            </div>


            <!--                  <div>-->
            <!--                    <span class="text-sm  mr-1">Transaction size:</span>-->
            <!--                    <span v-if="utxoOk" class="text-xs font-bold">{{ selectedUtoxos.estimatedSize }}  vB</span>-->
            <!--                    <span v-else class="text-xs font-bold">-</span>-->
            <!--                  </div>-->

          </div>

          <TransactionFeePicker v-model.number="(state.fee)" :realValues="transactionFees">
            <div v-if="canGoToSummary" class="w-full ">

              <hr class="mt-4 mb-2">

              <div class="flex justify-between">
                <span class="text-base font-bold ">Ratio:</span>
                <div class="font-bold">
                  {{ convertedTransactionPriceInOtherCurrencies }}
                </div>
              </div>

              <div class="flex justify-between">
                <span class="text-base font-bold ">Transaction price:</span>
                <div class="">
                  <span class=" "> {{ selectedUtoxos.fee }} </span>
                  <span class=" "> satoshi </span>
                </div>
              </div>

              <template v-if="selectedUtoxos.dust && showAdvanced">

                <div class="flex justify-between">
                  <span class="text-base  ">Transaction dust:</span>
                  <div class="">
                    <span class=" "> {{ selectedUtoxos.dustSize }} </span>
                    <span class=" "> satoshi </span>
                  </div>
                </div>

                <div class="flex justify-between">
                  <span class=" font-bold  ">Final transaction price</span>
                  <div>
                    <span class=" underline font-bold"> {{ selectedUtoxos.fee + selectedUtoxos.change }} </span>
                    <span class=" "> satoshi </span>
                  </div>
                </div>

                <div class="mt-2 bg-gray-500 text-xs text-white rounded-lg p-4" role="alert">
                  <span class="font-bold">Dust detected.</span>
                  <span>
                  "Dust"  is the refund amount is too small to be accepted by the bitcoin network and is therefore added to the fee
                    <!--                    "Dust" exists in the bitcoin network, which represents an amount smaller than 600 satoshi.-->
                    <!--                    Such transactions are rejected because the amount is too low and help protect the network from-->
                    <!--                    being overwhelmed by many small or unintentional transactions. It doesn't matter whether-->
                    <!--                    it's sending to an address or a refund. Therefore, it is common to add it to the-->
                    <!--                    transaction fee and thereby increase its speed. This "dust" can arise if the exact balance between-->
                    <!--                    the UTXO of received transactions, the valid amount and the expenditure cannot be found.-->
                  </span>
                </div>

              </template>


            </div>
          </TransactionFeePicker>

        </div>


      </template>

      <div v-else>

        <div class="w-full">

          <div class=" font-bold">
            Receiver
          </div>

          <div class="md:flex text-sm border-b justify-between">
            <div class="font-light">
              Receive address:
            </div>
            <div class="text-blue-500">
              {{ state.receiverAddress }}
            </div>
          </div>

          <div class="flex text-sm justify-between">
            <div class="">
              Amount
            </div>
            <div>
              <b>{{ state.amount }}</b> satoshi
            </div>
          </div>

          <template v-if="selectedUtoxos.change !== 0 && !selectedUtoxos.dust">
            <div class=" mt-4 flex items-center space-x-1 font-bold">
              <span>Change information</span>
              <InfoTooltip>
                  <span class="text-center">
                      This found will be send back <br/>
                    to your wallet <br/>
                    on your change address
                  </span>
              </InfoTooltip>
            </div>

            <template v-if="showAdvanced">

              <div class="md:flex text-sm border-b  justify-between">
                <div class="">
                  Change address:
                </div>
                <div class="text-blue-500">
                  {{ walletAddressStore.addresses.newChangeAddress }}
                  <!--                {{ walletState2.address.newReceiveAddress }}-->
                </div>
              </div>

              <div class="flex text-sm justify-between">
                <div class="">
                  Change amount
                </div>
                <div>
                  <b>{{ selectedUtoxos.change }}</b> satoshi
                </div>
              </div>

            </template>

          </template>

          <div class=" mt-4 flex items-center space-x-1 font-bold">
            <span>Transaction fee</span>
          </div>

          <div class="flex border-b text-sm justify-between">
            <div class="">
              Transaction size
            </div>
            <div>
              <b>{{ selectedUtoxos.estimatedSize }}</b> vB
            </div>
          </div>

          <div class="flex border-b text-sm justify-between">
            <div class="">
              Transaction speed
            </div>
            <div>
              <b>{{ selectedUtoxos.feeRate }}</b> s/vB
            </div>
          </div>

          <div class="flex  text-sm justify-between" :class="{'border-b':selectedUtoxos.dust}">
            <div class="">
              Transaction fee
            </div>
            <div>
              <b>{{ selectedUtoxos.fee }}</b> satoshi
            </div>
          </div>

          <template v-if="selectedUtoxos.dust && showAdvanced">

            <div class="flex border-b  justify-between">
              <div class="flex space-x-2 items-center">
                <span>Dust</span>
                <InfoTooltip>
                  <span class="text-center">
                     Too low value to be accpted by bitcoin network
                  </span>
                </InfoTooltip>
              </div>
              <div>
                <b>{{ selectedUtoxos.dustSize }}</b> satoshi
              </div>
            </div>

            <div class="flex border-b text-sm justify-between">
              <div class="">
                Final transaction speed with dus
              </div>
              <div class="">
                <b class="text-blue-500">{{ selectedUtoxos.feeRateWithDust }}</b> s/vB
              </div>
            </div>

            <div class="flex text-sm  justify-between">
              <div class="">
                Final transaction fee
              </div>
              <div class="">
                <b class="text-blue-500">{{ selectedUtoxos.finalFee }}</b> satoshi
              </div>
            </div>

          </template>


        </div>


      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">

        <Toggle v-model="showAdvanced" label="Advanced" id="advanced-mode" reverse/>

        <BaseButton v-if="transactionStep === 1" :disabled="!canGoToSummary" @click="goToSummary">
          Summary
        </BaseButton>

        <div v-else class="flex items-center space-x-2">
          <BaseButton :disabled="creatingTransaction" v-if="transactionStep === 2" color="neutral" @click="goBack">
            Back
          </BaseButton>
          <BaseButton :loading="creatingTransaction" @click="createTransaction">
            Create transaction
          </BaseButton>
        </div>

      </div>
    </template>

  </ModalWindow>
</template>

<script setup>
import {watch, reactive, ref, computed, inject, toRaw} from "vue"
import InfoTooltip from "@/components/global/InfoTooltip.vue";
import BaseButton from "@/components/inputs/BaseButton.vue"
import ModalWindow from "@/components/global/ModalWindow.vue"
import BaseInput from "@/components/inputs/BaseInput.vue"
import TransactionFeePicker from "@/components/inputs/TransactionFeePicker/Index.vue"
import * as bitcoin from "bitcoinjs-lib"
import BigNumber from "bignumber.js"
import {useRoute} from "vue-router"
import {Supabase} from "@/utils/plugins/Supabase";
import {tableName} from "@/utils/helpers/supabse-db/Index";
import {createP2SHTOP2WSHWallet, pubKeysToBip32Derivation} from "@/comps/Wallet";
import {getCurrentFeePerByte} from "@/services/block-chain/Transactions"
import {
  dustLimit,
  estimateMaxSpendable,
  selectUTXOsForPayment,
} from "@/comps/Transaction"
import {PSBT_STATUS_ENUM} from "@/comps/Psbt"
import {useStorage} from "@vueuse/core"
import {useWalletStore} from "@/stores/wallet/Wallet"
import {useWalletAddressesStore} from "@/stores/wallet/WalletAddresses"
import {useWalletBalance} from "@/stores/wallet/WalletBalance"
import {useCoinStore} from "@/stores/CoinStore";
import Toggle from "@/components/inputs/Toggle.vue";
import NotEnoughFounds from "@/components/views/wallets/single-wallet/balance/withdraw/errors/NotEnoughFounds.vue";
import MinMaxVal from "@/components/views/wallets/single-wallet/balance/withdraw/MinMaxVal.vue";
import MinWithdraw from "@/components/views/wallets/single-wallet/balance/withdraw/errors/MinWithdraw.vue";

const emit = defineEmits(['reload-pstb-list'])

const route = useRoute()
const walletId = route.params.id

const walletStore = useWalletStore()
const walletAddressStore = useWalletAddressesStore()
const walletBalanceStore = useWalletBalance()
const coinStore = useCoinStore()

const network = bitcoin.networks.bitcoin
const show = defineModel()
const transactionStep = ref(1)
const creatingTransaction = ref(false)
const showAdvanced = ref(false)


const INPUT_FEE_OPTIONS = [
  {
    text: coinStore.getSelectedCurrency,
    value: 'fiat'
  },
  {
    text: 'BTC',
    value: 'btc'
  },
  {
    text: 'SAT',
    value: 'sat'
  },
]

const selectedFeeOption = ref(INPUT_FEE_OPTIONS[0].value)
const amountInputValue = ref('')

const state = reactive({
  receiverAddress: '',
  amount: '',
  fee: 5,
})

watch(() => amountInputValue.value, val => {
  if (selectedFeeOption.value === 'btc') {
    state.amount = val
  } else {
    const fiatInSats = coinStore.convertFiatToSats(val)
    state.amount = fiatInSats
  }
})

watch(() => selectedFeeOption.value, () => {
  state.amount = ''
  amountInputValue.value = ''
})

const transactionFees = reactive({
  "minimumFee": 2,
  "economyFee": 5,
  "hourFee": 12,
  "halfHourFee": 16,
  "fastestFee": 24,
})

const loadfees = async () => {
  const {data: feeData, error: feeError} = await getCurrentFeePerByte()
  if (feeError) {
    alert('Error while loading transaction fees')
    return
  }

  Object.assign(transactionFees, feeData)
  state.fee = transactionFees.economyFee

}

loadfees()


const goToSummary = () => transactionStep.value = 2
const goBack = () => transactionStep.value = 1

const selectedUtoxos = computed(() => {
  const g = JSON.parse(JSON.stringify((walletBalanceStore.availableUtxo)))
  return selectUTXOsForPayment(toRaw(g), withDrawAmountInSat.value, state.fee, state.receiverAddress)
})
const maximumAmountWithSelectedFee = computed(() => estimateMaxSpendable(walletBalanceStore.availableUtxo, state.fee, state.receiverAddress))

const withDrawAmountInSat = computed(() => {
  if (selectedFeeOption.value === 'sat') return amountInputValue.value
  if (selectedFeeOption.value === 'btc') return coinStore.btcToSats(amountInputValue.value)
  else return coinStore.convertFiatToSats(amountInputValue.value)
})

const convertInputValIntoCurrencies = (value, currency) => {
  let sat, btc, fiat
  if (currency === 'sat') {
    sat = value
    btc = coinStore.satsToBtc(value)
    fiat = coinStore.convertSatsToFiat(value, false, 2)
  } else if (currency === 'btc') {
    sat = coinStore.btcToSats(value)
    btc = value
    fiat = coinStore.convertSatsToFiat(sat, false, 2)
  } else {
    sat = coinStore.convertFiatToSats(value)
    btc = coinStore.satsToBtc(sat)
    fiat = value
  }
  return {
    sat,
    btc,
    fiat
  }
}

const showInputValueRatio = computed(() => amountInputValue.value !== 0 && amountInputValue.value !== '')

const convertedAmountInOtherCurrencies = computed(() => {
  const converted = convertInputValIntoCurrencies(amountInputValue.value, selectedFeeOption.value)
  return `${converted.fiat} ${coinStore.getSelectedCurrency} = ${converted.btc} BTC = ${converted.sat} SAT`
})

const convertedTransactionPriceInOtherCurrencies = computed(() => {
  const converted = convertInputValIntoCurrencies(selectedUtoxos.value.fee, 'sat')
  return `${converted.fiat} ${coinStore.getSelectedCurrency} = ${converted.btc} BTC = ${converted.sat} SAT`
})

const maximumWithDrawWithSelectedFee = computed(() => {
  const sat = maximumAmountWithSelectedFee.value.amount
  const fiat = coinStore.convertSatsToFiat(sat, true)
  const btc = coinStore.satsToBtc(sat)
  return {
    sat,
    fiat,
    btc
  }
})

const minWithDraw = computed(() => {
  const sat = 600
  const fiat = coinStore.convertSatsToFiat(sat, false, 2)
  const btc = coinStore.satsToBtc(sat)
  return {
    sat,
    fiat,
    btc
  }
})

const maximumWithDrawForSelectedCurrency = computed(() => maximumWithDrawWithSelectedFee.value[selectedFeeOption.value])
const minWithDrawForSelectedCurrency = computed(() => minWithDraw.value[selectedFeeOption.value])

const withDrawIsBiggerThanMax = computed(() => {
  const amount = withDrawAmountInSat.value === '' ? 0 : Number(withDrawAmountInSat.value)
  return amount > maximumAmountWithSelectedFee.value.amount
})

const amountTooLow = computed(() => {
  if (amountInputValue.value === 0 || amountInputValue.value === '') return false
  return Number(amountInputValue.value) < minWithDrawForSelectedCurrency.value
})

const setMaxInput = () => {
  state.amount = maximumWithDrawWithSelectedFee.value.sat
  amountInputValue.value = maximumWithDrawWithSelectedFee.value[selectedFeeOption.value]
}

const setMinInput = () => {
  state.amount = dustLimit
  amountInputValue.value = minWithDraw.value[selectedFeeOption.value]
}

const utxoOk = computed(() => !selectedUtoxos.value.error)

const notEnoughFundsForSelectedFee = computed(() => {

  return withDrawIsBiggerThanMax.value || !utxoOk.value
})

const makeWithdrawModal = ref()

const canGoToSummary = computed(() => !notEnoughFundsForSelectedFee.value && !amountTooLow.value && utxoOk.value && state.receiverAddress.length > 0 && Number(withDrawAmountInSat.value) >= dustLimit)
// const canGoToSummary = computed(() => !notEnoughFundsForSelectedFee.value && !amountTooLow.value && utxoOk.value && state.receiverAddress.length > 0 && Number(state.amount) >= dustLimit)
const openedTransactionsList = useStorage('openedTransactionsList', [])

const createTransaction = async () => {

  if (creatingTransaction.value) return

  creatingTransaction.value = true
  // init psbt
  const psbt = new bitcoin.Psbt({network: network,});
  psbt.setVersion(2)
  psbt.setLocktime(0)

  const inputs = selectedUtoxos.value.selectedUTXOs ?? []

  if (inputs.length === 0) {
    alert('No UTXO selected')
    creatingTransaction.value = false
    return
  }

  // add inputs
  for (let i = 0; i < inputs.length; i++) {

    const utxo = inputs[i]
    const addressPath = utxo.addressPath

    const {p2ms, p2wsh, p2sh, bip32Derivation} = createP2SHTOP2WSHWallet({
      m: walletStore.walletConfig.quorum.requiredSigners,
      exportedPublicKeys: walletStore.walletConfig.extendedPublicKeys,
      derivePath: addressPath
    })

    const inputData = {
      bip32Derivation: bip32Derivation,
      sequence: 0xffffffff - 2, // - 2 turns on RBF
      hash: utxo.tx_hash_big_endian,
      index: utxo.tx_output_n,
      witnessUtxo: {
        script: p2sh.output,
        value: new BigNumber(utxo.value).toNumber(),
      },
      witnessScript: p2ms.output,
      redeemScript: p2wsh.output,
      sighashType: bitcoin.Transaction.SIGHASH_ALL,
    }

    psbt.addInput(inputData)
  }

  if (selectedUtoxos.value.outsCount === 2) {
    psbt.addOutput({
      address: walletAddressStore.addresses.newChangeAddress,
      value: selectedUtoxos.value.change
    })

    const changePath = walletAddressStore.addresses.newChangePath
    const {
      p2sh: p2shChange,
      p2ms: p2msChange,
      bip32Derivation: bip32DerivationChange
    } = createP2SHTOP2WSHWallet({
      m: walletStore.walletConfig.quorum.requiredSigners,
      exportedPublicKeys: walletStore.walletConfig.extendedPublicKeys,
      derivePath: changePath
    })

    psbt.updateOutput(0, {
      bip32Derivation: bip32DerivationChange,
      witnessScript: p2msChange.output,
      redeemScript: p2shChange.redeem.output,
    })

  }

  psbt.addOutput({
    address: state.receiverAddress,
    value: new BigNumber(state.amount).toNumber(),
  })

  const transactionData = {
    walletId: walletId,
    status: PSBT_STATUS_ENUM.CREATED,
    psbtV1Base64: psbt.toBase64(),
    receiver: state.receiverAddress,
    amount: withDrawAmountInSat.value.toString(),
    // amount: state.amount.toString(),
    fee: selectedUtoxos.value.finalFee.toString(),
    estimatedSize: selectedUtoxos.value.estimatedSize
  }

  const {
    error: error,
    data: newTransaction
  } = await Supabase.from(tableName('UserWalletsPsbt')).insert(transactionData).select().single()

  if (error) {
    alert('Error while creating transaction')
    creatingTransaction.value = false
    return
  }

  openedTransactionsList.value.push(newTransaction.id)

  makeWithdrawModal.value.close(() => {
    show.value = false
    state.amount = ''
    state.receiverAddress = ''
    transactionStep.value = 1
    creatingTransaction.value = false
    emit('reload-pstb-list')
  })


}

</script>