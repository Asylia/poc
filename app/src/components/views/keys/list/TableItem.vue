<template>
  <tr>

    <td class="h-px w-px whitespace-nowrap">
      <div class="ps-6 text-center lg:ps-3 xl:ps-0 pe-6 py-3">
        <span>{{ props.index + 1 }}</span>
      </div>
    </td>

    <td class="h-px w-px whitespace-nowrap">
      <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
        <div class="flex items-center gap-x-3">
          <img class="inline-block h-[2.375rem] w-[2.375rem] rounded-full"
               :src="src"
               alt="Image Description">

          <div class="grow">
            <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">
              {{ props.data.name }}
            </span>
            <span class="block text-sm text-gray-500">
              {{ KeyTypeName }}
            </span>
          </div>
        </div>
      </div>
    </td>

    <td class="h-px w-px whitespace-nowrap">
      <div class="px-6 py-3">
        <span class="text-sm text-gray-500">
          {{ created }}
        </span>
      </div>
    </td>

    <td class="h-px w-px whitespace-nowrap">
      <div class="px-6 py-1.5">
        <a class="inline-flex hover:cursor-pointer items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
           @click="viewDetail"
        >
          Edit
        </a>
      </div>
    </td>
  </tr>
</template>

<script setup>
import {useRouter} from "vue-router"
import {KEY_TYPES, getKeyDataByType, KEY_TYPES_DATA} from "@/content/PublicKeysEnum"
import {formatDateFromDB} from "@/utils/helpers/DateTime"
import ROUTES_NAMES from "@/router/RouteNames"
import StatusTag from "@/components/global/tag/StatusTag.vue";

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const {name: KeyTypeName, image: src} = getKeyDataByType(props.data.type)
const created = formatDateFromDB(props.data.createdAt)
const viewDetail = () => router.push({name: ROUTES_NAMES.KEYS.VIEW_KEY, params: {id: props.data.id}})

</script>