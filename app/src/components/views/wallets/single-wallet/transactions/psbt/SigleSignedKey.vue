<template>
  <div class="flex py-1 items-center justify-between">
    <!--  <div class="flex py-1 items-center justify-between mb-2 " :class="{'border-b':!props.isLast}">-->
    <SignKey :data="props.device"/>
    <Authorization :rights="['CAN_SIGN_TRANSACTIONS']">
      <SignTag :singed="singed" @click="makeSign" :locked="isLocked" :loading="isSingingThisKey"/>
    </Authorization>
  </div>
</template>

<script setup>
import {computed} from "vue"
import SignKey from "@/components/views/wallets/single-wallet/SignKey.vue"
import SignTag from "@/components/global/tag/SignTag.vue"
import Authorization from "@/components/views/wallets/Authorization.vue";

const props = defineProps({
  singedXfpList: {
    type: Array,
    required: true,
    default: () => []
  },
  device: {
    type: Object,
    required: true
  },
  currentlySigningXfp: {
    required: true,
    default: null
  },
  isLast: {
    type: Boolean,
    required: true,
    default: false
  },
  isLocked: {
    type: Boolean,
    required: true,
    default: false
  }
})

const emit = defineEmits(['makeSign'])

const WALLET_KEYS_ENUM = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DISABLED: 'DISABLED',
}

const singed = computed(() => props.singedXfpList.includes(props.device.xfp))
const isSingingThisKey = computed(() => !props.isLocked && props.currentlySigningXfp === props.device.xfp)
const isLocked = computed(() => props.device.status === WALLET_KEYS_ENUM.DISABLED || props.isLocked || props.currentlySigningXfp && !isSingingThisKey.value)

const makeSign = () => {
  if (isLocked.value || isSingingThisKey.value || singed.value) return
  emit('makeSign')
}

</script>