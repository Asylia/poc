<template>
  <DashboardCard>


    <template v-if="walletStore.walletStatus === 'OK'">
      <MakeWithdraw v-model="showWithDrawWindow"/>
      <MakeDeposit v-model="showDepositWindow"/>
    </template>

    <div class="pt-2 relative">

      <!--      v-if="walletStore.walletFunctionEnabled"-->
      <div class="absolute top-[-4px] items-center right-[-8px] flex">
        <Authorization :rights="['CAN_EDIT_WALLET']">
          <div v-if="!isNameEdit"
               @click="editWalletName"
               id="edit-wallet"
               class="flex z-20 items-center justify-center hover:cursor-pointer hover:opacity-75 hover:border-gray-300 w-[24px] border h-[24px] border-transparent rounded-full ">
            <font-awesome-icon :icon="['fas','pencil']"
                               class="text-[12px] text-gray-800  "/>
          </div>
        </Authorization>
      </div>

      <div class="flex items-start space-x-4">
        <img class="inline-block h-[54px] w-[54px] rounded-full"
             src="/icons/bitcoin.svg"
             alt="Image Description"/>

        <div class="-mt-1 w-full">
          <div id="wallet-details-info" v-if="!isNameEdit">
            <h2 class=" text-gray-800 space-x-2  ">
              <!--              <span class="font-semibold text-sm">Wallet:</span>-->
              <span class="font-bold text-gray-800 capitalize text-xl">{{ walletStore.walletConfig.name }}</span>
            </h2>
            <h2 class=" text-gray-800 space-x-2 text-xs">
              <span class="font-semibold">Type:</span>
              <span class="font-light">Multisig 2 of 3, P2WSH</span>
            </h2>
            <h2 class=" text-gray-800 space-x-2 text-xs">
              <span class="font-semibold">ID:</span>
              <span class="font-light">{{ walletStore.walletConfig.uuid }}</span>
            </h2>
          </div>

          <template v-else>
            <div class="w-full">
              <BaseInput
                  size="xs"
                  v-model="newWalletName" id="wallet-name" name="wallet_name"
                  type="text"
                  required
              />


              <div class="w-full flex mt-2 justify-between">

                <BaseButton @click="deleteWallet" :icon="['fas','trash']" color="danger" size="xs"/>

                <div class="flex space-x-2">
                  <BaseButton @click="cancelEditName" color="neutral" :icon="['fas','times']" size="xs" block>
                    Cancel
                  </BaseButton>
                  <BaseButton @click="saveEditName" color="primary" :icon="['fas','check']" size="xs" block>
                    Save
                  </BaseButton>
                </div>

              </div>
            </div>
          </template>

        </div>

      </div>

    </div>

    <div class="p-1.5 border-t mt-4  flex flex-col h-full">

      <div id="wallet-balance-wrapper" class="p-2.5 ">

        <div id="wallet-balance-total"
             class="flex justify-between w-full font-semibold text-xl text-base  text-gray-800 ">
          <span>Total:</span>
          <BtcSatsValue :satoshi="walletBalanceStore.balance.receivedBalance" v-slot="{value,currency,fiat}">
            <div class="space-x-2">
              <span>{{ value }}</span>
              <span class="text-xs text-gray-500">{{ currency }}</span>
            </div>
            <div class="text-right -mt-1 text-gray-500 space-x-2">
              <span class="text-base font-light">
               {{ coinStore.formatFiatCurrency(fiat, false) }}
                <!--                {{ fiat }}-->
              </span>
              <span class="text-xs  text-gray-500">
                {{ coinStore.getSelectedCurrency }}
              </span>
            </div>
          </BtcSatsValue>
        </div>

        <SingleBalance id="wallet-balance-spendable"
                       title="Spendable"
                       :value="walletBalanceStore.balance.spendableBalance"
        />
        <SingleBalance id="wallet-balance-incoming"
                       title="Incoming"
                       :value="walletBalanceStore.balance.balanceInMempool"
        />
        <SingleBalance id="wallet-balance-confirmed"
                       title="Confirmed"
                       :value="walletBalanceStore.balance.confirmedBalance"
        />
        <SingleBalance id="wallet-balance-in-psbt"
                       title="In PSBT"
                       :value="walletBalanceStore.balance.blockedByPsbt"
        />

      </div>

      <div id="wallet-manage-founds" class="w-full   mt-2 flex items-center space-x-4">
        <BaseButton id="deposit-button" :disabled="!walletStore.walletFunctionEnabled" @click="showDepositWindow = true"
                    size="base" block>
          Deposit
        </BaseButton>
        <Authorization :rights="['CAN_CREATE_TRANSACTIONS']">
          <BaseButton id="withdraw-button" :disabled="!walletStore.walletFunctionEnabled"
                      @click="showWithDrawWindow = true" size="base"
                      block>
            Withdraw
          </BaseButton>
        </Authorization>
      </div>

      <!--      <hr class="my-2">-->

      <!--      <BaseButton id="buy-crypto-button"-->
      <!--                  @click="buy"-->
      <!--                  :disabled="!walletStore.walletFunctionEnabled"-->
      <!--                  color="asyl"-->
      <!--                  :loading="buyLoading"-->
      <!--                  size="base" block-->
      <!--      >-->
      <!--        Buy-->
      <!--      </BaseButton>-->

    </div>

  </DashboardCard>
</template>

<script setup>
import {inject, ref} from "vue"
import DashboardCard from "@/components/global/DashboardCard.vue"
import BaseButton from "@/components/inputs/BaseButton.vue"
import MakeDeposit from "@/components/views/wallets/single-wallet/balance/deposit/Index.vue"
import MakeWithdraw from "@/components/views/wallets/single-wallet/balance/withdraw/Index.vue"
import SingleBalance from "@/components/views/wallets/single-wallet/balance/SingleBalance.vue"
import BaseInput from "@/components/inputs/BaseInput.vue"
import ApiService from "@/services/ApiService"
import {useCoinStore} from "@/stores/CoinStore"
import {useWalletBalance} from "@/stores/wallet/WalletBalance"
import {useWalletStore} from "@/stores/wallet/Wallet"
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore"
import {tableName} from "@/utils/helpers/supabse-db/Index";
import {useRouter} from "vue-router";
import ROUTES_NAMES from "@/router/RouteNames";
import {loadMoonPay} from '@moonpay/moonpay-js';
import {useUserStore} from "@/stores/UserStore";
import {useWalletAddressesStore} from "@/stores/wallet/WalletAddresses";
import Authorization from "@/components/views/wallets/Authorization.vue";

const Supabase = inject('SUPABASE')

const router = useRouter()

const coinStore = useCoinStore()
const layoutStore = useLayoutStore()
const walletBalanceStore = useWalletBalance()
const walletStore = useWalletStore()
const userStore = useUserStore()
const walletAddressStore = useWalletAddressesStore()

const showDepositWindow = ref(false)
const showWithDrawWindow = ref(false)

/*
 * Edit wallet name
 */
const isNameEdit = ref(false)
const newWalletName = ref('')

const editWalletName = () => {
  newWalletName.value = walletStore.walletConfig.name
  isNameEdit.value = true
}

const cancelEditName = () => isNameEdit.value = false

const saveEditName = async () => {

  const {error} = await ApiService('POST', 'v1/wallet/update-name', {
    name: newWalletName.value,
    walletId: walletStore.walletId
  })

  isNameEdit.value = false

  if (error) {
    return layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error while updating wallet name, try again later.'
    })
  } else {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.SUCCESS,
      text: 'Wallet name updated'
    })
  }

  isNameEdit.value = false

}

const deleteWallet = () => layoutStore.confirmAction({
  title: 'Are you sure ?',
  text: `Thi action is <b>inversiable</b>. If you want to create same wallet again you will need to create new one with exactly same configuration (meaning using by same keys and same multisig setup) or by a <b> upload wallet configuration file </b> exported from this wallet`,
  onConfirm: async () => {

    const {error: errorDeleteWalletUsers} = await Supabase.from(tableName('WalletUsers')).delete().eq('walletId', walletStore.walletId)
    const {error: errorDeleteWalletPsbt} = await Supabase.from(tableName('UserWalletsPsbt')).delete().eq('walletId', walletStore.walletId)
    const {error: errorDeleteWallet} = await Supabase.from(tableName('UserWallets')).delete().eq('id', walletStore.walletId)

    if (errorDeleteWallet || errorDeleteWalletUsers || errorDeleteWalletPsbt) {
      return layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error while deleting wallet, try again later.'
      })
    } else {
      layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.SUCCESS,
        text: 'Wallet deleted'
      })
    }

    await router.push({name: ROUTES_NAMES.HOME})

  },
  onCancel: () => {
  }
})

const buyLoading = ref(false)
const buy = async () => {
  buyLoading.value = true
  const moonPay = await loadMoonPay();
  const moonPaySdk = moonPay({
    flow: 'buy',
    environment: 'sandbox',
    variant: 'overlay',
    params: {
      apiKey: '',
      theme: 'dark',
      baseCurrencyCode: 'czk',
      baseCurrencyAmount: '1000',
      defaultCurrencyCode: 'btc',
      currencyCode: 'btc',
      walletAddress: walletAddressStore.addresses.newReceiveAddress,
      colorCode: '#2563eb',
      email: userStore.userData.email,
      externalCustomerId: userStore.userData.id,
      // language: 'en', //  ISO 639-1
    }
  });
  moonPaySdk.show()
  buyLoading.value = false
}

</script>