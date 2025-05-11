<template>

  <div class="flex items-center justify-center "
       :class="{'space-x-2':label !== '', 'flex-row-reverse space-x-reverse':props.reverse}"
  >
    <label v-if="label !== ''" :for="props.id" class="text-gray-800 hover:cursor-pointer hover:opacity-75 text-sm">
      {{ label }}
    </label>

    <input type="checkbox"
           :id="props.id"
           v-model="value"
           class="relative w-[35px] h-[21px] bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ring-0 focus:ring-0 focus:outline-none disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 before:inline-block before:size-4 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200">

  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  reverse: {
    type: Boolean,
    default: false
  }
})

const value = defineModel()

</script>