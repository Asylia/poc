<template>
  <div class="flex items-center space-x-2">
    <slot/>
    <font-awesome-icon @click="copyToClipboard" :icon="['fas','copy']" :class="props.size"
                       class="hover:cursor-pointer text-sm hover:opacity-75"/>
  </div>
</template>

<script setup>
import {useLayoutStore} from "@/stores/LayoutStore";

const props = defineProps({
  size: {
    type: String,
    default: 'text-base',
  },
  value: {
    type: String,
    required: true,
  },
})


const layoutStore = useLayoutStore()

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.value)
  layoutStore.addAppNotification({
    type: 'info',
    text: 'Copied to clipboard'
  })
}

</script>