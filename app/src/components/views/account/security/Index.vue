<template>

  <MasterView>

    <div class="w-full mx-auto">

      <div class="bg-white max-w-[520px] mx-auto px-5 pt-2 pb-5 rounded-2xl shadow-md ">

        <Tabs :tabsHead="tabsHead" v-model="activeTab" :tabs-slots="tabsSlots"/>

      </div>
    </div>
  </MasterView>
</template>

<script setup>
import {ref} from "vue"
import MasterView from "@/components/layout/master/MasterView.vue"
import Tabs from "@/components/global/Tabs.vue";
import General from "@/views/after-auth/account/General.vue";
import Security from "@/views/after-auth/account/Security.vue";
import Personal from "@/views/after-auth/account/Personal.vue";
import Subscription from "@/views/after-auth/account/Subscription.vue";

const tabsHead = [
  {
    id: 'general-tab',
    title: 'General',
    icon: ['fal', 'sliders']
  },
  {
    id: 'personal-tab',
    title: 'Personal',
    icon: ['fal', 'user']
  },
  {
    id: 'security-tab',
    title: 'Security',
    icon: ['fas', 'lock']
  },
  {
    id: 'subscription-tab',
    title: 'Subscription',
    icon: ['fas', 'star']
  }
]

const tabsSlots = {
  'general-tab': General,
  'personal-tab': Personal,
  'security-tab': Security,
  'subscription-tab': Subscription
}

const activeTab = ref(tabsHead[0].id)


</script>