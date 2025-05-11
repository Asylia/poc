<template>
  <div class="flex items-center justify-between gap-x-3">

    <div class="flex items-center space-x-3">
      <img class="inline-block h-[2.375rem] w-[2.375rem] rounded-full"
           :src="src"
           alt="Image Description"
      />

      <div class="grow">
        <span class="block text-sm font-semibold text-gray-800 ">{{ props.data.name }}</span>
        <span class="block text-sm text-gray-500">{{ KeyTypeName }}</span>
      </div>
    </div>

    <slot/>

  </div>
</template>

<script setup>

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

import {getKeyDataByType} from "@/content/PublicKeysEnum"

const {name: KeyTypeName, image: src} = getKeyDataByType(props.data.method)
</script>