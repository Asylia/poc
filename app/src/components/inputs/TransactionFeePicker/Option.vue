<template>
  <div class="flex-1 border text-center flex flex-col py-2 rounded-2xl hover:cursor-pointer hover:shadow-lg"
       :class="{'bg-blue-600  text-white': props.isSelected}"
  >
    <span class="text-xs">{{ props.title }}</span>
    <span class="text-sm">
      <b>{{ props.value }}</b>
      <span class="text-xs">
        sat/byte
      </span>
    </span>
  </div>
</template>

<script setup>

const props = defineProps({
  isSelected: {
    required: true,
    type: Boolean
  },
  title: {
    required: true,
    type: String
  },
  value: {
    required: true,
    // type: [String, Number]
  },
})

</script>