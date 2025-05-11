<template>
  <div class="w-full mb-4 items-stretch flex border rounded-lg border-blue-500">

    <div class="w-[152px] flex justify-center flex-col items-center bg-blue-500">

      <font-awesome-icon :icon="['fal','desktop']" class="text-4xl text-white"/>
      <span class="text-white mt-4 text-xs">{{ props.session.os.name }} - {{ props.session.os.version }}</span>

    </div>

    <div class="flex-1 relative flex items-center p-3 justify-between">

      <div class="flex-1 text-gray-800">

        <div class="text-sm flex space-x-1">
          <span class="opacity-75">Ip adress:</span>
          <span class="">{{ props.session.ip }} </span>
        </div>

        <div class="text-sm flex space-x-1">
          <span class="opacity-75">Created:</span>
          <span class="">{{ formatDateTimeFromDB(props.session.created_at) }} </span>
        </div>

        <div class="text-sm flex space-x-1">
          <span class="opacity-75">Device:</span>
          <span class="">{{ props.session.device.vendor }} {{ props.session.device.model }}</span>
        </div>

        <div class="text-sm flex space-x-1">
          <span class="opacity-75">Browser:</span>
          <span class="">{{ props.session.browser.name }} {{ props.session.browser.version }}</span>
        </div>


      </div>

    </div>


  </div>
</template>

<script setup>
import {formatDateTimeFromDB} from "@/utils/helpers/DateTime";

const props = defineProps({
  session: {
    type: Object,
    required: true
  }
})

</script>