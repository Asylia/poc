<template>
  <div @click.prevent.stop="()=>{}"
       style="background: linear-gradient(to right, #2563eb, #8b5cf6);"
       class="absolute flex text-center justify-center items-center opacity-80 w-full h-full z-30 rounded-xl border-blue-500  border  ">
    <div class="">
      <font-awesome-icon :icon="['fas','lock']" class="text-4xl text-white"/>
      <div class="text-white text-sm mt-4"> Finish wallet set up first</div>
    </div>
  </div>
</template>