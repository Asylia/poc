<template>

  <MasterView :content-loading="loading">

    <template #loading>

      <div class="w-full h-full flex flex-col items-center justify-center">

        <div class="flex flex-col items-center justify-center">
          <LoadingIcon class="mx-auto"/>
          <span class="text-gray-500 mt-4">Loading your wallets</span>
          <span class="text-gray-500 text-xs mt-4">Please take a while</span>
        </div>
      </div>

    </template>

    <template #modals>
      <CreateNewWallet v-model="showCreateNewWallet" @open-import-wallet="openImportWallet" @open-wallet="openWallet"/>
      <ImportNewWallet v-model="showImportNewWallet" @open-wallet="openWallet"/>
    </template>

    <div id="wallets-list-gird" class="grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3 xl:gap-4">

      <WalletCard v-for="wallet in myWalletsList" :key="wallet.id" :wallet="wallet" class="wallet-item"/>

      <div @click="showCreateNewWallet = true"
           class="relative magic-card h-[131px]  border-l-4 border-l-blue-500 hover:shadow-md hover:cursor-pointer  overflow-hidden p-4  bg-white border border-gray-200 rounded-xl shadow-sm  ">

        <div id="create-new-wallet" class="  h-full flex flex-col items-center space-x-2 justify-center ">
          <div class="text-2xl font-bold text-blue-500">Create new wallet</div>
          <font-awesome-icon :icon="['fas','circle-plus']" class="text-xl mt-1 text-blue-500 font-bold"/>
        </div>

      </div>
    </div>

  </MasterView>


</template>


<script setup>
import {ref, watch, nextTick} from "vue"
import MasterView from "@/components/layout/master/MasterView.vue"
import CreateNewWallet from "@/components/views/wallets/CreateNewWallet.vue"
import ImportNewWallet from "@/components/views/wallets/ImportNewWallet.vue"
import {useUserStore} from "@/stores/UserStore"
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore"
import {useRouter} from "vue-router"
import ROUTES_NAMES from "@/router/RouteNames"
import WalletCard from "@/components/views/home/WalletCard.vue"
import {Sortable} from '@shopify/draggable'

const router = useRouter()
const userStore = useUserStore()
const layoutStore = useLayoutStore()

const loading = ref(false)
const showCreateNewWallet = ref(false)
const showImportNewWallet = ref(false)
const myWalletsList = ref([])

import ApiService from "@/services/ApiService";
import LoadingIcon from "@/components/global/LoadingIcon.vue";
import {Supabase} from "@/utils/plugins/Supabase";
import {tableName} from "@/utils/helpers/supabse-db/Index";

const loadMyWallets = async () => {

  loading.value = true
  const {data, error} = await ApiService('GET', 'v1/wallet/wallet-list',)

  loading.value = false
  if (error) {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error while loading wallets'
    })
    return
  }

  myWalletsList.value = data.data

}

loadMyWallets()

const openWallet = id => router.push({
  name: ROUTES_NAMES.WALLETS.VIEW_WALLET,
  params: {
    id
  }
})

let originalOrder = myWalletsList.value.map(wallet => wallet.id)

watch(loading, async loading => {

  if (loading) return

  await nextTick()

  try {
    const sortable = new Sortable(document.querySelector('.grid'), {
      draggable: '.wallet-item',
      mirror: {
        appendTo: 'body',
        constrainDimensions: true
      },
      delay: 200
    });

    sortable.on('drag:start', (event) => {
      event.source.style.zIndex = '1000'
      event.source.classList.add('dragging');
    })

    sortable.on('drag:stop', async (event) => {
      const draggedElement = event.source;
      draggedElement.style.zIndex = '';
      draggedElement.classList.remove('dragging');
      const newOrder = sortable.getDraggableElementsForContainer(document.querySelector('.grid')).map(element => element.getAttribute('id'))

      if (newOrder.join('') === originalOrder.join('')) return

      const mappedOrder = newOrder.map((id, index) => ({
        walletId: id,
        order: index
      }))

      let hasError = null
      for (let wallet of mappedOrder) {
        Supabase.from(tableName('WalletUsers')).update({
          order: wallet.order
        }).match({
          walletId: wallet.walletId,
          userId: userStore.userData.id
        }).then(response => {
          if (response.error) hasError = true
        })
      }

      if (hasError) {
        layoutStore.addAppNotification({
          type: NOTIFICATIONS_TYPES.ERROR,
          text: 'Error while updating wallets order'
        })
      } else {
        originalOrder = mappedOrder
        layoutStore.addAppNotification({
          type: NOTIFICATIONS_TYPES.SUCCESS,
          text: 'Wallets order updated'
        })
      }
    });

    // Handle click event propagation issue
    document.querySelectorAll('.wallet-item').forEach(item => {
      item.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    });

  } catch (e) {
  }

})

const openImportWallet = () => {
  showCreateNewWallet.value = false
  showImportNewWallet.value = true
}

defineExpose({
  myWalletsList
})

</script>

<style scoped lang="scss">

.wallet-item.dragging {
  opacity: 0.8;
  transform: rotate(2deg);
  z-index: 1000 !important;
}
</style>