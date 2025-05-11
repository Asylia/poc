<template>

  <li class="px-5 mb-1.5">
    <a @click="goToRoute"
       @mouseenter.prevent.stop="isHovered = true"
       @mouseleave.prevent.stop="isHovered = false"
       class="link flex gap-x-3 hover:cursor-pointer items-center py-2 px-3 text-sm text-gray-800 rounded-lg  focus:outline-none focus:bg-gray-100 "
    >
<!--      <font-awesome-icon  :icon="linkIcon" class="text-base " />-->
      <font-awesome-icon :icon="linkIcon" class="text-base gradient-fill" :class="{'text-blue-600':props.highlight}"/>
      <span class="menu-link relative"
            :class="{'menu-link-highlight bg-clip-text bg-gradient-to-tr from-blue-600 to-purple-600 to-80% text-transparent':props.highlight,'active':routeIsActive}">
          {{ props.title }}
      </span>
      <div v-if="props.tag !== ''" class="ms-auto">
                  <span
                      class=" relative text-gradient inline-flex items-center gap-1.5 py-px px-1.5 rounded-lg text-[10px] bg-gray-100/10 leading-4 font-medium border text-blue-500">
                   {{ props.tag }}
                  </span>
      </div>
    </a>
  </li>

</template>

<script setup>
import {useRouter, useRoute} from 'vue-router'
import {computed, ref} from "vue";

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
  hoverIcon: {
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

const goToRoute = () => {
  if (props.to.length === 0 && !props.isExternal) return
  props.isExternal ? window.open(props.to, '_blank') : router.push({name: props.to})
}

const routeIsActive = computed(() => !props.isExternal && route.name === props.to)

const isHovered = ref(false)

const linkIcon = computed(() => {
  if (props.hoverIcon.length === 0 || !isHovered.value) return props.icon
  return props.hoverIcon
})

</script>

<style scoped lang="scss">

.menu-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  transition: width 0.2s ease;
  @apply  bg-gradient-to-r from-blue-600 to-purple-600;

  //&.menu-link-highlight {
  //  @apply bg-gradient-to-r from-blue-600 to-purple-600;
  //}
}

.link {

  &:hover {

    .menu-link::after {
      width: 25%;
    }

    .menu-link.active::after {
      width: 50%;
    }

  }

  .menu-link.active::after {
    width: 50%;
  }

}

</style>