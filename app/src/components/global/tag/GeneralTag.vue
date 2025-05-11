<template>
<span @click.stop.prevent="tagClicked"
      class="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium  rounded-full"
      :class="props.disabled ? 'opacity-50 hover:cursor-not-allowed' : ''"
>
  <slot/>
  <font-awesome-icon v-if="hasIcon" :icon="iconContent" :spin="props.loading" class="text-xs"/>
</span>
</template>

<script setup>
import {computed} from "vue"

const props = defineProps({
  icon: {
    type: Array,
    required: false,
    default: () => []
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['click'])

const tagClicked = () => {
  if (props.disabled) return
  emit('click')
}

const hasIcon = computed(() => props.icon.length > 0)
const iconContent = computed(() => props.loading ? ['fas', 'spinner-third'] : props.icon)
</script>