<template>
  <div class="flex items-center" @click="radioChecked">
    <div class="flex">
      <input :id="props.id" :name="props.name" v-model="state"
             type="checkbox"
             class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
    </div>
    <div v-if="hasLabel" class="ms-3">
      <label :for="props.name" class="text-sm dark:text-white">
        <slot name="label"/>
      </label>
    </div>
  </div>
</template>

<script setup>
import {useSlots, ref, computed} from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const state = defineModel()

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()
const hasLabel = computed(() => !!slots.label)

const radioChecked = () => state.value = !state.value

</script>