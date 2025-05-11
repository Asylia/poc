<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" :id="props.id"
           ref="modalEl"

           class="  size-full     fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none bg-neutral-900/50"
      >
        <div :class="sizeClass"
             class="hs-overlay-open:mt-7  mt-0    sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
          <div
              class="w-full max-h-full overflow-hidden flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">

            <div class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
              <slot name="title"/>

              <button @click="close()"
                      class="w-8 h-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
              >
                <span class="sr-only">Close</span>
                <font-awesome-icon :icon="['fal','xmark']" class="text-sm"/>
              </button>
            </div>

            <div class="p-4 overflow-y-auto">
              <div class="space-y-4">
                <slot/>
              </div>
            </div>

            <slot v-if="hasFooter" name="footer"/>

          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import {useSlots, ref, watch, computed, nextTick, onMounted, onBeforeUnmount} from "vue"

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'sm'
  }
})

const show = defineModel()
const _show = ref(false)

const sizeClass = computed(() => {
  return {
    'sm': 'sm:max-w-md',
    'md': 'sm:max-w-lg',
    'lg': 'sm:max-w-2xl',
    'xl': 'sm:max-w-4xl',
    'max': 'sm:max-w-6xl',
  }[props.size]
})

watch(() => props.size, () => {
  show.value = false

  nextTick(() => {
    show.value = true
  });
});

watch(() => show.value, (value) => {
  setTimeout(() => _show.value = value, 500)
}, {immediate: true})

const openButtonEl = ref(null)
const closeButtonEl = ref(null)

watch(show, async (value) => {
  // window.HSStaticMethods.autoInit();
  await nextTick()
  if (value) {
    // setTimeout(() => {
    // openButtonEl.value.click()
    // }, 3000)
    // openButtonEl.value.click()
  } else {
  }
}, {flush: 'post'})

const open = () => {
  show.value = true
}

const close = async (callback = null) => {
  if (callback !== null) callback()
  show.value = false
}

onBeforeUnmount(async () => {
  await close()
})

const slots = useSlots()
const hasFooter = computed(() => !!slots.footer)

onMounted(() => {
  if (show.value) nextTick(() => {
    setTimeout(() => {
      openButtonEl.value.click()
    }, 300)
  })
})

const modalEl = ref()

defineExpose({
  [props.id]: modalEl,
  close,
  open
})

</script>