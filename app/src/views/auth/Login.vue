<template>
  <AuthLayout>
    <div class="text-center mb-4">

      <h1 class="text-lg space-x-2 font-semibold text-gray-700 dark:text-neutral-200">
        <span>Sing</span>
        <span class="space-x-0.5">
                <span>in</span><span class="opacity-75">/</span><span>up</span>
            </span>
      </h1>

      <p class="mt-1 text-sm text-gray-500 dark:text-neutral-500">
        Just enter your email and we will send you
        a magic link.
      </p>

    </div>

    <form>
      <div class="space-y-5">

        <template v-if="emailSend">
          <div class="bg-blue-600 text-sm text-white rounded-lg p-4 dark:bg-blue-500"
               role="alert">
            Check your email <b>{{ state.email }}</b> for magic link to sign in / sign up.
          </div>

          <div @click="close"
               class="space-x-2 mt-1 transition  hover:space-x-0.5 hover:cursor-pointer hover:opacity-75 text-gray-800 text-sm flex items-center">
            <font-awesome-icon :icon="['fal','arrow-left']" class="text-sm text-gray-800"/>
            <span>Back</span>
          </div>
        </template>

        <div v-else class="space-y-3">

          <BaseInput v-model="state.email" id="email" name="email" label="Email address" type="email" required/>

          <BaseButton :loading="loading" block @click="loginAction">
            Continue
          </BaseButton>

        </div>


      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import {reactive, ref} from "vue";
import AuthLayout from '@/templates/BeforeAuth.vue'
import BaseInput from "@/components/inputs/BaseInput.vue"
import BaseButton from "@/components/inputs/BaseButton.vue"
import ApiService from "@/services/ApiService"
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore";

const layoutStore = useLayoutStore()
const emailSend = ref(false)

const IS_DEV = import.meta.env.VITE_NODE_ENV === 'development'
const state = reactive({
  email: IS_DEV ? 'infodavidzita@gmail.com' : '',
})

const close = () => {
  emailSend.value = false
  state.email = ''
}

const loading = ref(false)

const loginAction = async () => {

  loading.value = true
  const {data, error} = await ApiService('POST', 'v1/auth/sig-in', {email: state.email})

  loading.value = false

  if (error) {
    layoutStore.addNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      message: 'Error during login. Please try again.',
    })
  } else emailSend.value = true

}


</script>
