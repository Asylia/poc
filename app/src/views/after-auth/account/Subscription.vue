<template>
  <div class="w-full">

    <BaseButton v-if="userStore.userSubscription.subscription_is_active === true"
                :block="true"
                @click="manageSubscription"
                :loading="loading"
    >
      Manage my subscription
    </BaseButton>

    <BaseButton v-else
                :block="true"
                @click="manageSubscription"
                :loading="loading"
                color="asyl"
                :icon="['fal','star']"
    >
      Buy premium
    </BaseButton>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import BaseButton from "@/components/inputs/BaseButton.vue"
import {useUserStore} from "@/stores/UserStore";
import ApiService from "@/services/ApiService";

const userStore = useUserStore()

const loading = ref(false)
const manageSubscription = async () => {

  loading.value = true
  const {data, error} = await ApiService('GET', 'v1/user/pay-link')
  loading.value = false
  if (error) {
    alert('err')
  }

  window.open(data.url, '_blank')

}

const buySubscription = () => {

}

</script>