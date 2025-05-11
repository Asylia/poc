<template>
  <div @click="selectType" class="flex-1 relative border  rounded-lg p-5"
       :class="[
           props.value === props.modelValue ? 'bg-blue-100' : 'hover:bg-gray-200',
           props.comingSoon ? ' hover:cursor-not-allowed' : 'hover:cursor-pointer'
           ]"
  >
    <img :src="props.image" class="max-h-[60px] w-auto mx-auto" :class="{'opacity-50':props.comingSoon}"/>
    <div class="text-center mt-4 mx-auto font-bold" :class="{'opacity-50':props.comingSoon}">
      {{ props.title }}
    </div>
    <span v-if="props.comingSoon"
          class="absolute px-2 p-1 text-white text-xs rounded-lg bg-blue-500 top-[8px] right-[8px]">
      Coming soon
    </span>
  </div>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  comingSoon: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const selectType = () => {
  if (props.comingSoon) return
  emit('update:modelValue', props.value)
}
</script>