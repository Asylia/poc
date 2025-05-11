<template>
  <div class="bg-gray-50 dark:bg-neutral-950">
    <main id="content" role="main" class="w-full min-h-screen flex flex-col justify-center">
      <div class="p-2 sm:p-5 sm:pb-0 space-y-5 text-center">
        <div class="max-w-md mx-auto space-y-3">
          <h1 class="leading-none text-8xl font-semibold text-gray-800 dark:text-neutral-200">
            404
          </h1>
          <h2 class="text-3xl font-medium tracking-tight text-gray-800 dark:text-neutral-200">
            Page not found
          </h2>
          <p class="text-gray-500 dark:text-neutral-500">
            Sorry, the page you're looking for cannot be found.
          </p>
          <div>
            <BaseButton @click="goHome" :icon="['fal','arrow-left']" size="lg">
              Back to home
            </BaseButton>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import ROUTE_NAMES from "@/router/RouteNames"
import {useRouter} from 'vue-router'
import BaseButton from "@/components/inputs/BaseButton.vue"

const router = useRouter()

const goHome = () => router.push({name: ROUTE_NAMES.ROOT})

</script>