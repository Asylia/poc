<template>
  <div class="inline-flex rounded-lg space-x-0.5 shadow-sm">
    <BaseButton v-for="(button,i) in props.buttons"
                :key="i"
                :icon="button?.icon"
                :size="props.size"
                :color="props.modelValue === button.value ? 'primary' : 'neutral'"
                @click="buttonClicked(button.value)"
    >
      {{ button.text }}
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/inputs/BaseButton.vue"

/*
 * {
 *  text
 *  value
 * }
 */
const props = defineProps({
  buttons: {
    type: Array,
    required: true
  },
  size: {
    type: String,
  },
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const buttonClicked = value => emit('update:modelValue', value)

</script>