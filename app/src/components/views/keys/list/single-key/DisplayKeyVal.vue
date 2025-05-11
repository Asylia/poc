<template>
  <div class="flex text-sm  items-center justify-between py-1">
    <span class="px-2">
      <slot name="key"/>
    </span>
    <span class="w-[24rem] px-2 text-right text-gray-500 shrink" style="overflow-wrap: anywhere;">
      <slot name="val"/>
    </span>
  </div>
</template>