<template>

  <div>

    <div class="flex  items-center mb-2" :class="showLabel ? 'justify-between':'justify-start'">
      <label v-if="showLabel" :for="props.id" class="block text-sm dark:text-white">
        {{ label }}
        <slot name="label"/>
      </label>
      <span class="text-xs">
        <slot name="top-right"/>
      </span>
    </div>

    <div class="relative">
      <input :type :id :name :required :placeholder :aria-describedby="describedby" v-model="value"
             :class="sizeClass[props.size]"
             class=" block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
      >
      <slot name="addons"/>
      <!--  input error alert -->
      <!--      <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">-->
      <!--        <svg class="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"-->
      <!--             aria-hidden="true">-->
      <!--          <path-->
      <!--              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>-->
      <!--        </svg>-->
      <!--      </div>-->
    </div>
    <!--    <p class="hidden text-xs text-red-600 mt-2" id="email-error">-->
    <!--      Please include a valid email address so we-->
    <!--      can get back to you-->
    <!--    </p>-->
  </div>
</template>

<script setup>

import {useSlots, computed} from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
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
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  },
  size: {
    type: String,
    required: false,
    default: 'md'
  }
  // icon: {
  //   type: Array,
  //   required: false,
  //   default: () => []
  // }
})

const slots = useSlots()
const {type, placeholder, required, id, name} = props
const describedby = `${name}-error`

const value = defineModel({equired: true})

const hasToRight = computed(() => !!slots['top-right'])
const hasLabel = computed(() => !!slots['label'])
const showLabel = computed(() => props.label !== '' || hasLabel)

const sizeClass = {
  xs: 'py-1 px-2',
  sm: 'py-2 px-3',
  md: 'py-3 px-4',
  lg: 'py-4 px-5',
}

</script>