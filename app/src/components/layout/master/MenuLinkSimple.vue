<template>
  <li>
    <a @click="goToRoute"
       class="flex gap-x-3  py-2 px-3 text-sm text-white/80 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10 hover:cursor-pointer"
       :class="{'bg-white/10 ':routeIsActive}"
    >
      <font-awesome-icon :icon="props.icon" class="text-base" :class="{'text-teal-300':props.highlight}"/>
      <span
          :class="{'bg-clip-text bg-gradient-to-tr from-teal-300 to-fuchsia-300 to-80% text-transparent':props.highlight}">
          {{ props.title }}
      </span>
      <div v-if="props.tag !== ''" class="ms-auto">
                  <span
                      class="inline-flex items-center gap-1.5 py-px px-1.5 rounded-lg text-[10px] leading-4 font-medium border border-white/10 text-white/80">
                   {{ props.tag }}
                  </span>
      </div>
    </a>
  </li>
</template>

<script setup>
import {useRouter, useRoute} from 'vue-router'
import {computed} from "vue";

const router = useRouter()
const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: Array,
    required: false,
    default: () => []
  },
  to: {
    type: String,
    required: false,
    default: ''
  },
  tag: {
    type: String,
    required: false,
    default: ''
  },
  highlight: {
    type: Boolean,
    required: false,
    default: false
  },
  isExternal: {
    type: Boolean,
    required: false,
    default: false
  }
})

const goToRoute = () => props.isExternal ? window.open(props.to, '_blank') : router.push({name: props.to})

const routeIsActive = computed(() => !props.isExternal && route.name === props.to)

</script>
