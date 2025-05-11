<template>
  <GeneralTag :icon="icon" :loading="props.loading" :class="colorClass" class="cursor-pointer">
    {{ tagText }}
  </GeneralTag>
</template>

<script setup>
import GeneralTag from "@/components/global/tag/GeneralTag.vue"
import {computed} from "vue"

const props = defineProps({
  singed: {
    type: Boolean,
    required: false,
    default: false
  },
  locked: {
    type: Boolean,
    required: false,
    default: false
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  }
})

const icon = computed(() => {
  if (props.singed) return ['fas', 'check']
  if (props.locked) return ['fas', 'lock']
  return ['fas', 'pen']
})

const tagText = computed(() => {
  if (props.singed) return 'Singed'
  if (props.locked) return 'Locked'
  if (props.loading) return 'Loading'
  return 'Sign'
})

const colorClass = computed(() => {

  if (props.singed) return 'bg-teal-100 text-teal-800 hover:cursor-not-allowed'
  if (props.locked) return 'bg-gray-100 text-gray-800 hover:cursor-not-allowed'
  let classes = 'bg-blue-100 text-blue-800 hover:cursor-pointer hover:shadow'
  classes += props.loading ? ' hover:cursor-not-allowed' : ' hover:cursor-pointer'
  return classes

})

</script>