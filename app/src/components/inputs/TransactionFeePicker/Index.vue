<template>

  <div class="w-full">

    <input type="range"
           class="w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:w-2.5
  [&::-webkit-slider-thumb]:h-2.5
  [&::-webkit-slider-thumb]:-mt-0.5
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:bg-white
  [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:transition-all
  [&::-webkit-slider-thumb]:duration-150
  [&::-webkit-slider-thumb]:ease-in-out
  [&::-webkit-slider-thumb]:dark:bg-slate-700

  [&::-moz-range-thumb]:w-2.5
  [&::-moz-range-thumb]:h-2.5
  [&::-moz-range-thumb]:appearance-none
  [&::-moz-range-thumb]:bg-white
  [&::-moz-range-thumb]:border-4
  [&::-moz-range-thumb]:border-blue-600
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:transition-all
  [&::-moz-range-thumb]:duration-150
  [&::-moz-range-thumb]:ease-in-out

  [&::-webkit-slider-runnable-track]:w-full
  [&::-webkit-slider-runnable-track]:h-2

  [&::-webkit-slider-runnable-track]:rounded-full

  [&::-moz-range-track]:w-full
  [&::-moz-range-track]:h-2
  [
  [&::-moz-range-track]:rounded-full"
           id="steps-range-slider-usage"
           :min="1"
           :max="100"
           :step="0.1"
           :value="value"
           @input="setNewValue($event)"
           style="background: linear-gradient(to right, #dc2626,#ea580c,#fdba74,#d9f99d,#bbf7d0,#22c55e)"
    >

    <div class="w-full mt-2 space-x-2 flex">


      <Option title="Min."
              :is-selected="positionedInValuePart === 0"
              :value="originalValuesParts[0]"
              @click="setFee(0)"
      />

      <Option title="Economy"
              :is-selected="positionedInValuePart === 1"
              :selectedIndex="positionedInValuePart"
              :value="originalValuesParts[1]"
              @click="setFee(1)"
      />

      <Option title="60 min."
              :is-selected="positionedInValuePart === 2"
              :selectedIndex="positionedInValuePart"
              :value="originalValuesParts[2]"
              @click="setFee(2)"
      />

      <Option title="30 min."
              :is-selected="positionedInValuePart === 3"
              :selectedIndex="positionedInValuePart"
              :value="originalValuesParts[3]"
              @click="setFee(3)"
      />

      <Option title="Max."
              :is-selected="positionedInValuePart === 4"
              :selectedIndex="positionedInValuePart"
              :value="originalValuesParts[4]"
              @click="setFee(4)"
      />

    </div>

    <slot/>

  </div>

</template>

<script setup>
import {watch, ref, computed} from 'vue'
import Option from "./Option.vue"

const props = defineProps({
  modelValue: {
    type: Number,
    default: 2
  },
  realValues: {
    type: Object,
    default: () => ({
      "fastestFee": 75,
      "halfHourFee": 70,
      "hourFee": 61,
      "economyFee": 12,
      "minimumFee": 6,
    })

  }
})

const emit = defineEmits(['update:modelValue'])


const value = ref(props.modelValue)


const originalValuesParts = computed(() => [
  props.realValues.minimumFee,
  props.realValues.economyFee,
  props.realValues.hourFee,
  props.realValues.halfHourFee,
  props.realValues.fastestFee,
])

const sliderParts = originalValuesParts.value.length - 1

const calculateSliderPosition = (currentValue) => {
  for (let i = 0; i < sliderParts; i++) {
    if (currentValue >= originalValuesParts.value[i] && currentValue <= originalValuesParts.value[i + 1]) {
      const partRange = originalValuesParts.value[i + 1] - originalValuesParts.value[i]
      const partStep = 100 / sliderParts
      const valueRelativeToPart = (currentValue - originalValuesParts.value[i]) / partRange
      return i * partStep + valueRelativeToPart * partStep
    }
  }
  return 100 // Vrátit maximální možnou hodnotu, pokud currentValue přesahuje definovaný rozsah
}

const positionedInValuePart = ref(0)
const setNewValue = (e) => {
  const v = parseFloat(e.target.value);


  // Ako prvé určíme správne pozicionovanie v rozsahu
  positionedInValuePart.value = Math.floor(v / (100 / sliderParts));
  // let positionedInValuePart = Math.floor(v / (100 / sliderParts));
  // Ak v == 100, nastavíme positionedInValuePart na posledný platný index
  if (v === 100) {
    positionedInValuePart.value = sliderParts;
  }


  const rangeStart = originalValuesParts.value[positionedInValuePart.value];
  let rangeEnd = originalValuesParts.value[positionedInValuePart.value + 1];

  if (v === 100) {
    emit('update:modelValue', Number(originalValuesParts.value[originalValuesParts.value.length - 1]))
    return
  }

  let valueWithinRange = Number(((v % (100 / sliderParts)) / (100 / sliderParts)) * (rangeEnd - rangeStart) + rangeStart);

  // Kontrola na NaN a oprava
  if (isNaN(valueWithinRange)) {
    valueWithinRange = Number(originalValuesParts.value[originalValuesParts.value.length - 1]);
  }

  valueWithinRange = valueWithinRange.toFixed(2);
  emit('update:modelValue', valueWithinRange);
}

watch(() => props.modelValue, (newValue) => {
  value.value = calculateSliderPosition(newValue)
}, {immediate: true})

const setFee = index => {
  emit('update:modelValue', originalValuesParts.value[index])
  positionedInValuePart.value = index
}

</script>