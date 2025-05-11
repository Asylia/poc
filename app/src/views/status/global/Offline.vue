<template>
  <AuthLayout>

    <font-awesome-icon :icon="['fal','wifi-slash']" class="text-4xl text-blue-500"/>

    <div class="text-center mt-4 text-lg font-bold">
      Network Error
    </div>

    <div>
      <p class="text-center mt-2 text-gray-500 dark:text-neutral-500">
        You are currently offline. Please check your <span class="text-gray-800">internet connection</span> and try
        again.
      </p>
    </div>

  </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/templates/BeforeAuth.vue'

</script>