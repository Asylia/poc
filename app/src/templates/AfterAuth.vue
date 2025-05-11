<template>

  <AppLoading v-if="loading"/>
  <SocketGeneralError v-else-if="hasError"/>
  <template v-else>
    <div v-if="socketStore.showReconnectWarning"
         class="border max-w-[320px] items-center flex z-10 rounded-lg shadow border-blue-500 p-3 bg-white fixed bottom-[54px] right-[12px]">

      <font-awesome-icon :icon="['fal','triangle-exclamation']" class="text-4xl text-red-500"/>

      <div class="pl-4">
        <div class="text-gray-800 font-bold text-base">
          Connection
        </div>
        <p class="text-xs">
          Connection to server lost. Som functions may be limited Trying to reconnect...
        </p>
      </div>

    </div>
    <Preline>

      <div class="w-screen h-screen  bg-gray-100"
           :class="{'': props.contentLoading}">

        <ConfirmAction/>
        <slot name="modals"/>

        <header
            class="lg:hidden lg:ms-[260px] fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">

          <div class="flex justify-between basis-full items-center w-full py-2.5 px-2 sm:px-5" aria-label="Global">


            <router-link v-if="1" :to="{name:ROUTES_NAMES.HOME}"
                         class="text-3xl text-gradient hover:cursor-pointer text-blue-500 font-bold"
                         style=""
            >
              Asylia.<span class="" style="

        ">io</span>
            </router-link>


            <!-- Sidebar Toggle -->
            <button type="button"
                    class="w-8 h-[38px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-1 bg-white text-gray-800  hover:bg-gray-50 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    data-hs-overlay="#hs-pro-sidebar" aria-controls="hs-pro-sidebar" aria-label="Toggle navigation">
              <font-awesome-icon :icon="['fas','bars']" class="text-sm text-blue-500"/>
            </button>
            <!-- End Sidebar Toggle -->

          </div>
        </header>

        <!-- ========== MAIN SIDEBAR ========== -->

        <aside id="hs-pro-sidebar" class="hs-overlay [--auto-close:lg]
  hs-overlay-open:translate-x-0
  -translate-x-full transition-all duration-300 transform
  w-[260px]
  hidden
  fixed inset-y-0  z-[60]
  bg-white
  lg:block lg:translate-x-0 lg:end-auto
     rounded-2xl lg:top-[14px] lg:bottom-[54px] lg:left-[14px]
  dark:bg-neutral-800 dark:border-neutral-700   border
 ">
          <div class="flex flex-col h-full max-h-full py-3">
            <header class="h-[46px] px-8">
              <!-- Logo -->
              <router-link v-if="1" :to="{name:ROUTES_NAMES.HOME}"
                           class="text-3xl text-gradient hover:cursor-pointer text-blue-500 font-bold"
                           style=""
              >
                Asylia.<span class="" style="

        ">io</span>
              </router-link>

              <router-link v-else :to="{name:ROUTES_NAMES.HOME}"
                           class="text-3xl hover:cursor-pointer text-blue-500 font-bold"

              >
                Asylia.<span class="" style="

        ">io</span>
              </router-link>
              <!-- End Logo -->
            </header>

            <!-- Content -->
            <div
                class="h-[calc(100%-35px)] lg:h-[calc(100%-93px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <!-- Nav -->
              <nav class="hs-accordion-group pb-1  h-full justify-between w-full flex flex-col flex-wrap"
                   data-hs-accordion-always-open>

                <ul>

                  <MenuLinkSimple id="main-menu-link-wallets" title="Wallets" :to="ROUTES_NAMES.HOME"
                                  :icon="['fal','wallet']"/>
                  <MenuLinkSimple id="main-menu-link-settings" title="Settings" :to="ROUTES_NAMES.ACCOUNT.GENERAL"
                                  :icon="['fal','cog']"/>

                  <!--                  @click.stop.prevent="buyPremiumAction"-->

                  <li class="px-5 " id="main-menu-link-privacy-mode">
                    <div class="flex py-2 px-3 justify-between items-center ">
                      <div class="flex items-center">
                        <font-awesome-icon :icon="['fal','eye']" class="text-base mr-2"/>
                        <label for="hs-xs-switch" class="text-sm text-gray-800 dark:text-neutral-400">Privacy
                          mode</label>
                      </div>
                      <Toggle v-model="privacyModeActive"/>
                    </div>
                  </li>


                  <li>
                    <hr class="pb-1.5">
                  </li>

                  <MenuLinkSimple id="main-menu-link-release-bolg"
                                  title="What’s New" :tag="APP_VERSION" to="https://www.google.com" :is-external="true"
                                  :icon="['fal','bell']"/>

                  <MenuLinkSimple v-if="showHelp"
                                  @click.stop.prevent="startHelpTour"
                                  id="main-menu-link-help"
                                  title="Help"
                                  :icon="['fal','circle-info']"
                  />

                </ul>


              </nav>


              <!-- End Nav -->
            </div>
            <!-- End Content -->

            <footer class="absolute   bottom-0 inset-x-0 py-2 px-5 border-t border-gray-200 dark:border-neutral-700">

              <div class="flex justify-between items-center gap-x-2">

                <!-- Log out -->
                <div @click="logOut"
                     id="main-menu-link-log-out"
                     class="flex hover:bg-gray-100 rounded-full px-4 border space-x-2 hover:shadow hover:cursor-pointer hover:opacity-75 py-2.5  items-center">
                  <font-awesome-icon :icon="['fal','right-from-bracket']" class="text-base"/>
                  <span class="text-xs">Log out</span>
                </div>

                <ThemePicker id="main-menu-link-theme"/>

              </div>
            </footer>


          </div>
        </aside>

        <!-- ========== END MAIN SIDEBAR ========== -->

        <!-- ========== MAIN CONTENT ========== -->
        <main id="content" role="main"
              class="lg:ps-[288px] pt-[74px] lg:pt-[14px] ml-[14px] lg:ml-0 mr-[14px] bg-gray-150 md:pb-[54px]  lg:h-screen flex flex-col overflow-y-auto ">
          <div
              class=" rounded-2xl flex flex-col w-full md:h-[calc(100vh-184px)] lg:h-screen pb-[14px] lg:pb-0  lg:overflow-y-auto lg:max-h-screen ">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" ref="pageView" @content-loaded="viewContentLoaded"/>
              </transition>
            </router-view>
          </div>

        </main>
        <!-- ========== END MAIN CONTENT ========== -->

        <!-- ========== FOOTER ========== -->
        <footer
            class=" h-[80px] pb-2 border-t pt-2 lg:pt-0 lg:border-t-0 lg:mt-0 md:pb-0 md:h-[40px]  sm:h-[64px] flex items-center w-full relative lg:absolute bottom-0 ">

          <div class="  md:flex w-full px-[16px] justify-between items-center">

            <p class="text-xs mb-4 md:mb-0 pt-2 md:pt-0 md:w-[260px] mt-0.5 text-center md:text-left  lg:text-center text-gray-500 dark:text-neutral-500">
              © 2024 Asylia. All rights reserved.
            </p>

            <!-- List -->
            <ul id="down-links-wrapper" class="mx-auto text-center md:text-right  md:mr-0">
              <li class="inline-block relative pe-5 text-xs text-gray-500 align-middle last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:w-px before:h-3.5 before:bg-gray-400 before:rotate-[18deg] dark:text-neutral-500 dark:before:bg-neutral-600">
                <a class="hover:text-blue-600 focus:outline-none focus:underline dark:hover:text-neutral-200" href="#">
                  FAQ
                </a>
              </li>

              <li class="inline-block relative pe-5 text-xs text-gray-500 align-middle last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:w-px before:h-3.5 before:bg-gray-400 before:rotate-[18deg] dark:text-neutral-500 dark:before:bg-neutral-600">
                <a class="hover:text-blue-600 focus:outline-none focus:underline dark:hover:text-neutral-200" href="#">
                  Website
                </a>
              </li>
              <li class="inline-block relative pe-5 text-xs text-gray-500 align-middle last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:w-px before:h-3.5 before:bg-gray-400 before:rotate-[18deg] dark:text-neutral-500 dark:before:bg-neutral-600">
                <a class="hover:text-blue-600 focus:outline-none focus:underline dark:hover:text-neutral-200" href="#">
                  Terms and Conditions
                </a>
              </li>
              <li class="inline-block relative pe-5 text-xs text-gray-500 align-middle last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:w-px before:h-3.5 before:bg-gray-400 before:rotate-[18deg] dark:text-neutral-500 dark:before:bg-neutral-600">
                <a class="hover:text-blue-600 focus:outline-none focus:underline dark:hover:text-neutral-200" href="#">
                  GDPR
                </a>
              </li>
            </ul>
            <!-- End List -->
          </div>
        </footer>

      </div>
      <!-- End Add Team Account Modal -->
    </Preline>
  </template>
</template>

<script setup>
import {computed, ref, nextTick, onMounted, useSlots, watch} from "vue";
import MenuLinkSimple from "@/components/layout/master/MenuLinkSimple2.vue";
import ThemePicker from "@/components/layout/master/ThemePicker.vue";
import ConfirmAction from "@/components/global/modals/ConfirmAction.vue";
import AppLoading from "@/views/status/after-auth/AppLoading.vue";
import SocketGeneralError from "@/views/status/after-auth/SocketGeneralError.vue";
import Toggle from "@/components/inputs/Toggle.vue";
import {useUserStore} from "@/stores/UserStore";
import ROUTES_NAMES from "@/router/RouteNames";
import {useLayoutStore} from "@/stores/LayoutStore";
import {PRIVACY_MODE_ACTIVE_KEY} from "@/content/Global";
import {useSocketStore, SOCKET_STATUS} from "@/stores/SocketStore";
import {useCoinStore} from "@/stores/CoinStore"
import {useStorage} from '@vueuse/core'
import {useRoute, useRouter} from 'vue-router'
import ApiService from "@/services/ApiService"
import startHomeHelpTour from "@/content/help/HomeHelp";
import startSettingsHelpTour from "@/content/help/SettingsHelp";
import startWalletHelpTour from "@/content/help/wallet";

import "driver.js/dist/driver.css";

const userStore = useUserStore()
const socketStore = useSocketStore()
const coinStore = useCoinStore()
const route = useRoute()

const props = defineProps({
  contentLoading: {
    type: Boolean,
    default: false
  }
})

socketStore.initSocket()
coinStore.init()

const pageView = ref()
const loading = computed(() => socketStore.isConnecting)
const hasError = computed(() => (socketStore.socketIsDisconnectedError))
const hasSubscription = computed(() => userStore.userSubscription.subscription_is_active)

const APP_VERSION = `v${window.APP_VERSION_CODE}`
const layoutStore = useLayoutStore()

// log out action
const logOut = () => layoutStore.confirmAction({
  title: 'Are you sure ?',
  text: `You wil be logged out from this browser.`,
  onConfirm: async () => userStore.logOut(),
  onCancel: () => {
  }
})

watch(() => userStore.userData?.id, id => {
  if (id) {
    userStore.loadUserSubscription()
  }
}, {immediate: true})

// privacy mode
const privacyModeActive = useStorage(PRIVACY_MODE_ACTIVE_KEY, false)

const availableViewsForHelp = [
  ROUTES_NAMES.HOME,
  ROUTES_NAMES.ACCOUNT.GENERAL,
  ROUTES_NAMES.WALLETS.VIEW_WALLET
]

const _showHelp = ref(false)
const showHelp = computed(() => availableViewsForHelp.includes(route.name) && _showHelp.value)
const viewContentLoaded = loaded => _showHelp.value = loaded

const startHelpTour = () => {

  if (route.name === ROUTES_NAMES.HOME) {
    const walletListLength = pageView?.value?.myWalletsList?.value ?? 0
    startHomeHelpTour(walletListLength, hasSubscription.value)
  }

  if (route.name === ROUTES_NAMES.ACCOUNT.GENERAL) return startSettingsHelpTour()

  if (route.name === ROUTES_NAMES.WALLETS.VIEW_WALLET) return startWalletHelpTour()

}

</script>


<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>