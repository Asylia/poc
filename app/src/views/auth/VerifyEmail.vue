<template>

  <AuthLayout>
    <div class="flex items-center justify-center">
      <LoadingIcon class="mx-auto"/>
    </div>
  </AuthLayout>

</template>

<script setup>
import {useRouter} from "vue-router";
import AuthLayout from '@/templates/BeforeAuth.vue'
import {inject} from "vue"
import {useUserStore} from "@/stores/UserStore"
import {error} from "@trezor/connect-web/lib/iframe";

const router = useRouter()
import ROUTES_NAMES from '@/router/RouteNames'
import LoadingIcon from "@/components/global/LoadingIcon.vue";

const Supabase = inject('SUPABASE')
const userStore = useUserStore()


const verify = async () => {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const token_hash = searchParams.get('tokenhash');

  if (token && email && token_hash) {
    const {data: d, error: e} = await Supabase.auth.verifyOtp({token_hash, type: 'email'})
    if (d.user) userStore.setUser(d.user)
    if (error) {
      return alert(error)
    }
    await router.push({
      name: ROUTES_NAMES.ROOT
    })
  } else {
    // todo
  }

}

verify()

</script>