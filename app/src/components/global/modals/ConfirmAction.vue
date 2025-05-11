<template>

  <teleport to="body">
    <div ref="modalEl"
         id="global-confirm-window"
         class="  size-full fixed top-0 start-0 z-[90] overflow-x-hidden overflow-y-auto pointer-events-none [--close-when-click-inside:true] bg-neutral-900/90"
         :class="{
    'hidden': !isOpened,
      }"
    >
      <div
          class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-md sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
        <!--    <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-md sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">-->
        <div
            class="relative w-full max-h-full overflow-hidden flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] dark:bg-neutral-800 dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)]">
          <!-- Close Button -->
          <div class="absolute top-2 end-4 z-10">
            <button @click="close()"
                    class="w-8 h-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
            >
              <span class="sr-only">Close</span>
              <font-awesome-icon :icon="['fal','xmark']" class="text-sm"/>
            </button>
          </div>
          <!-- End Close Button -->

          <!-- Body -->
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-800 dark:text-neutral-200">
              {{ layoutStore.confirmState.title }}
            </h3>
            <p class="mt-1 text-gray-500 dark:text-neutral-500" v-html="layoutStore.confirmState.text"></p>

            <!-- Button Group -->
            <div class="mt-4 flex justify-end gap-x-3">

              <button type="button"
                      @click="rejectAction"
                      class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              >
                Cancel
              </button>
              <button type="button"
                      @click="confirmAction"
                      class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none">
                Yes, I’m sure
              </button>
            </div>
            <!-- End Button Group -->
          </div>
          <!-- End Body -->
        </div>
      </div>
    </div>
  </teleport>

</template>

<script setup>

import BaseButton from "@/components/inputs/BaseButton.vue"
import {onMounted, watch, ref, nextTick} from "vue"
import {useLayoutStore} from "@/stores/LayoutStore";

const layoutStore = useLayoutStore()

const isOpened = ref(false)
watch(() => layoutStore.confirmState.isOpen, (v) => {
  if (v) {
    open()
  } else {
    close()
  }
}, {deep: true})

const open = () => {
  isOpened.value = true
}

const close = () => {
  isOpened.value = false
}

const confirmAction = () => {
  layoutStore.confirmState.isOpen = false
  layoutStore.confirmState.onConfirm()
}

const rejectAction = () => {
  layoutStore.confirmState.isOpen = false
  layoutStore.confirmState.onCancel()
}

</script>