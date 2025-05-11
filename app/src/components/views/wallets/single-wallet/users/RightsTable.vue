<template>
  <div class="">
    <div v-for="(right,i) in WALLET_USER_RIGHTS"
         :key="`${i}`"
         class="flex py-1 hover:cursor-pointer justify-between items-center"
         @click.stop.prevent="inviteUserRights[right.key] = !inviteUserRights[right.key]"
         :class="{'border-b': i !== WALLET_USER_RIGHTS.length - 1}"
    >
      <span class="hover:cursor-pointer text-sm text-gray-800 hover:opacity-50">{{ right.title }}</span>
      <CheckBox :name="right.key"
                :id="right.key"
                v-model="inviteUserRights[right.key]"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from "vue"
import CheckBox from "@/components/inputs/CheckBox.vue"
import {WALLET_USER_RIGHTS} from "@/content/Authorization";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  default: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])


const inviteUserRights = ref({})

WALLET_USER_RIGHTS.forEach(right => inviteUserRights.value[right.key] = props.default)

if (Object.keys(props.modelValue).length !== 0) {
  for (const key in props.modelValue) {
    inviteUserRights.value[key] = props.modelValue[key]
  }
}

watch(() => inviteUserRights.value, value => emit('update:modelValue', {...value}), {deep: true, immediate: true})

</script>