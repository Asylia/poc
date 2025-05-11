<template>
  <div class="w-full">

    <div v-if="hasNewEmail" class="bg-blue-600 text-sm text-white rounded-lg p-4 dark:bg-blue-500"
         role="alert">
      <span class="font-bold">Info:</span> Pending email update from {{ userStore.userData.email }} to
      <b>{{ userStore.userData.new_email }}</b>. Pleas click on magic link in your new email to confirm.
    </div>

    <BaseInput v-else v-model="email" id="email" name="email" label="Email" type="email" required/>

    <!-- Select -->

    <SelectBox :options="CURRENCIES" class="mt-4" label="Currency" id="currency-picker" name="currencyPicker"
               v-model="currency"/>

    <SelectBox :options="LANGUAGES" class="mt-4" label="Language" id="language-picker" name="languagePicker"
               v-model="language"/>

    <hr class="mt-6 mb-4">

    <BaseButton @click="updateUserEmail" block :loading="loading" class="mt-2">
      Save
    </BaseButton>

  </div>
</template>

<script setup>

import BaseButton from "@/components/inputs/BaseButton.vue";
import BaseInput from "@/components/inputs/BaseInput.vue";
import {useUserStore} from "@/stores/UserStore";
import {computed, inject, ref} from "vue";
import {sleep} from "@/utils/helpers/general";
import SelectBox from "@/components/inputs/SelectBox.vue";
import {CURRENCIES, LANGUAGES} from "@/content/Global";
import {useLayoutStore, NOTIFICATIONS_TYPES} from "@/stores/LayoutStore";
import {tableName} from "@/utils/helpers/supabse-db/Index";

const userStore = useUserStore()
const layoutStore = useLayoutStore()

const email = ref(userStore.userData.email)
const loading = ref(false)
const Supabase = inject('SUPABASE')

const hasNewEmail = computed(() => userStore.userData.user?.new_email)

const currency = ref(userStore.getUserProfile()?.currency)
const language = ref(userStore.getUserProfile()?.language)

const updateUserEmail = async () => {
  loading.value = true

  const data = {
    currency: currency.value,
    language: language.value
  }

  if (!hasNewEmail.value && email.value !== userStore.userData.email) {
    const {error} = await Supabase.auth.updateUser({
      email: email.value
    })

    if (error) {
      return layoutStore.addAppNotification({
        type: NOTIFICATIONS_TYPES.ERROR,
        text: 'Error while updating email'
      })
    }

  }

  const {error} = await Supabase.from('users_profile')
      .upsert({
        id: userStore.userData.id,
        ...data,
      })

  await userStore.loadUser()
  await sleep(2000)
  loading.value = false

  if (error) {
    return layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.ERROR,
      text: 'Error while updating, currency or language'
    })
  } else {
    layoutStore.addAppNotification({
      type: NOTIFICATIONS_TYPES.SUCCESS,
      text: 'Profile updated'
    })
  }

}


</script>