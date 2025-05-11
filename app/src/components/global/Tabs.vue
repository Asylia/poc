<template>

  <div class="w-full">
    <div class="border-b border-gray-200 dark:border-neutral-700">
      <nav :id="props.headId" class="flex space-x-2" aria-label="Tabs" role="tablist">
        <button v-for="(tab) in tabsHead"
                :key="tab.id"
                type="button"
                class="py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap  hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none  "
                :id="tab.id"
                :class="[props.modelValue === tab.id ?  'font-semibold border-blue-600 text-blue-500 active':'text-gray-500' ]"
                role="tab"
                @click="setActiveTab(tab.id)"
        >
          <font-awesome-icon v-if="!!tab.icon" :icon="tab.icon" class="text-sm"/>
          <span>{{ tab.title }}</span>
        </button>
      </nav>
    </div>

    <div class="mt-3">
      <div id="tabs-with-underline-1" role="tabpanel">
        <component :is="tabComponent"/>
      </div>
    </div>
  </div>

</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  tabsHead: {
    type: Array,
    default: () => []
  },
  tabsSlots: {
    type: Object,
    default: () => []
  },
  headId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const setActiveTab = tab => emit('update:modelValue', tab)

const tabComponent = computed(() => props.tabsSlots[props.modelValue])

</script>