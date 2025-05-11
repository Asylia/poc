<template>
  <button @click.stop.prevent="buttonClick"
          :disabled="isDisabled"
          :class="[
              { 'w-full': props.block },
              sizeClasses,
              colorClasses
              ]"
          class="inline-flex justify-center items-center gap-x-2 font-semibold rounded-lg border border-transparent   disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
    <span v-if="props.loading"
          class="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full"
          role="status" aria-label="loading"></span>
    <slot/>
    <font-awesome-icon v-if="props.icon.length === 2 && !props.loading" :icon="props.icon" class="text-sm"/>
  </button>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  icon: {
    type: Array,
    required: false,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'base',
    validator: val => ['xs', 'sm', 'base', 'lg', 'xl'].includes(val)
  },
  color: {
    type: String,
    default: 'primary',
    validator: val => ['primary', 'danger', 'success', 'neutral', 'asyl'].includes(val)
  }
})

const emit = defineEmits(['click'])

const sizeClassesEnum = {
  'xs': 'py-1 px-2 text-xs',
  'sm': 'py-1.5 px-3 text-sm',
  'base': 'py-2 px-3.5 text-sm',
  'lg': 'py-2.5 px-4 px-5 text-base',
  'xl': 'py-3 px-5 text-base'
}

const colorClassesEnum = {
  'primary': 'text-white hover:bg-blue-700 bg-blue-600',
  'danger': 'text-white hover:bg-red-700 bg-red-600',
  'success': 'bg-bg-green-600 text-white hover:bg-bg-green-700 ',
  'neutral': 'bg-gray-500 hover:bg-gray-700 text-white  ',
  'asyl': ' bg-blue-600 bg-asyl-hover text-white  '
}

const sizeClasses = sizeClassesEnum[props.size]
const colorClasses = computed(() => colorClassesEnum[props.color])

const buttonClick = () => {
  emit('click')
}

const isDisabled = computed(() => props.disabled || props.loading)

</script>