<template>
  <div class="w-full">

    <BaseInput v-model="state.firstName" class="mt-2" id="first_name" name="first_name" label="Fist name" type="text"
               required/>
    <BaseInput v-model="state.middleName" class="mt-2" id="middle_name" name="middle_name" label="Middle name"
               type="text"
               required/>
    <BaseInput v-model="state.lastName" class="mt-2" id="last_name" name="last_name" label="Last name" type="text"
               required/>

    <hr class="my-4">

    <BaseButton @click="updateUserProfile" block :loading="loading" class="mt-2">
      Save
    </BaseButton>

  </div>
</template>

<script setup>

import BaseButton from "@/components/inputs/BaseButton.vue";
import BaseInput from "@/components/inputs/BaseInput.vue";
import {useUserStore} from "@/stores/UserStore";
import {computed, inject, reactive, ref} from "vue";
import {sleep} from "@/utils/helpers/general";
import {NOTIFICATIONS_TYPES, useLayoutStore} from "@/stores/LayoutStore";


const userStore = useUserStore()

const state = reactive({
  firstName: '',
  lastName: '',
  middleName: '',
})

Object.assign(state, userStore.getUserProfile())

const loading = ref(false)
const Supabase = inject('SUPABASE')
const layoutStore = useLayoutStore()

const updateUserProfile = async () => {
  loading.value = true

  const {error} = await Supabase.from('users_profile')
      .upsert({
        id: userStore.userData.id,
        ...state,
      })
      .select()

  await userStore.loadUser()
  loading.value = false

  if (error) {
    return layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error while updating, profile try again later.'
    })
  } else {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.SUCCESS,
      text: 'Profile updated'
    })
  }

  userStore.setUserProfile(Object.assign({}, state))

}
</script>