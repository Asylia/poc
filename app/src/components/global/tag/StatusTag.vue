<template>
  <GeneralTag :icon="['fas','circle-check']" :class="props.active ? 'bg-teal-100' : 'bg-red-100'" class="text-teal-800">
    {{ props.active ? 'Active' : 'Inactive' }}
  </GeneralTag>
</template>

<script setup>
import GeneralTag from "@/components/global/tag/GeneralTag.vue";

const props = defineProps({
  active: {
    type: Boolean,
    required: true,
    default: false
  }
})
</script>