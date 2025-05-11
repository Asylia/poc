<template>
  <Preline>
    <div class="hs-tooltip inline-block">
      <div class="hs-tooltip-toggle flex">
        <font-awesome-icon :icon="['fas','circle-info']" class="text-base hover:cursor-pointer text-blue-500"/>
        <span
            class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
            role="tooltip">
         <slot/>
        </span>
      </div>
    </div>
  </Preline>
</template>
