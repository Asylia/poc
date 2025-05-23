<template>

  <div>
    <PrelineWrapper>
      <div class="flex  items-center mb-2" :class="hasToRight ? 'justify-between':'justify-start'">
        <label v-if="label !== ''" :for="props.id" class="block text-sm dark:text-white">
          {{ label }}
        </label>
        <slot name="top-right"/>
      </div>

      <!-- Select -->
      <select :id="props.id" value="USD" :data-hs-select="o" class="hidden">
        <option v-for="option in props.options" :value="option.val">{{ option.title }}</option>
      </select>
    </PrelineWrapper>
  </div>

</template>

<script setup>

import {useSlots, onMounted, nextTick, computed} from "vue";
import PrelineWrapper from "@/components/global/PrelineWrapper.vue"
import {HSSelect} from "preline";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  options: {
    type: Array,
    required: true
  }
})

const slots = useSlots()
const {type, placeholder, required, id, name, label} = props
const describedby = `${name}-error`

const value = defineModel({equired: true})

const hasToRight = computed(() => !!slots['top-right'])

const o = `
{
"value":"${value.value}",
  "placeholder": "Select option...",
  "toggleTag": "<button type=\\"button\\"></button>",
  "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 px-4 pe-9 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400",
  "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
  "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
  "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"flex-shrink-0 size-3.5 text-blue-600 dark:text-blue-500\\" xmlns=\\"http:.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>",
  "extraMarkup": "<div class=\\"absolute top-1/2 end-3 -translate-y-1/2\\"><svg class=\\"flex-shrink-0 size-3.5 text-gray-500 dark:text-neutral-500\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"m7 15 5 5 5-5\\"/><path d=\\"m7 9 5-5 5 5\\"/></svg></div>"
}

`

onMounted(() => {
  nextTick(() => {
    const select = HSSelect.getInstance('#' + props.id);
    select.on('change', val => value.value = val);
  })
})

</script>