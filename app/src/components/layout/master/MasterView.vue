<template>

  <div class="flex-1">

    <slot name="modals"/>

    <template v-if="props.contentLoading">
      <slot v-if="hasLoadingSlot" name="loading"/>
      <div v-else class="w-full h-screen flex flex-col items-center justify-center">
        <LoadingIcon :stroke-width="4"/>
      </div>
    </template>

    <transition-group name="zoom">
      <slot v-if="!props.contentLoading"/>
    </transition-group>

  </div>

</template>

<script setup lang="ts">
import {computed, watch, ref, useSlots} from "vue"
import LoadingIcon from "@/components/global/LoadingIcon.vue"

const props = defineProps({
  contentLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['content-loaded'])

const slots = useSlots()

const masterView = ref()

const hasLoadingSlot = computed(() => slots['loading'] !== undefined)

watch(() => props.contentLoading, loaded => emit('content-loaded', !loaded), {immediate: true})

defineExpose({
  masterView
})

</script>
