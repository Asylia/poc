<template>
  <div class="w-full">
    <label v-if="props.label !== ''" :for="props.id" class="block text-sm font-medium mb-2 dark:text-white">
      {{ props.label }}
    </label>
    <textarea
        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
        rows="3" :placeholder="props.placeholder" :id="props.id" v-model="value"
        :aria-describedby="props.id"></textarea>
  </div>
</template>

<script setup>

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  },
})

const value = defineModel({required: true})

</script>