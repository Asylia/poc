<template>
  <DashboardCard id="wallet-cart-box">

    <div class="flex items-center justify-between">
      <h4 class="text-xl font-semibold text-gray-800 dark:text-neutral-200">
        Transactions chart
        <!--        <template v-if="selectedChartType === 'BALANCE'">Transactions chart</template>-->
        <!--        <template v-else>Bitcoin price</template>-->
      </h4>
      <ButtonGroup id="cart-currency" :buttons="BALANCE_TYPES" size="xs" v-model="selectedBalanceType"/>
      <!--      <ButtonGroup :buttons="CHART_TYPES" size="xs" v-model="selectedChartType"/>-->
    </div>

    <div id="cart-time-filter" class="flex mt-2 items-center text-sm text-gray-800 justify-between">
      <div class="space-x-1">
        <span v-for="(item,i) in BALANCE_TIME_PERIOD_FILTER">
          <span v-if="i > 0" class="text-gray-500 hover:opacity-75 hover:cursor-pointer">/</span>
          <span @click="selectedChartTimePeriodIndex = i"
                class="hover:opacity-75 hover:cursor-pointer"
                :class="{'text-blue-500': selectedChartTimePeriodIndex === i}">{{ item.text }}</span>
        </span>
      </div>
      <div class="space-x-1">
        <span v-for="(item,i) in BALANCE_TIME_FRAME_FILTER">
          <span v-if="i > 0" class="text-gray-500 hover:opacity-75 hover:cursor-pointer">/</span>
          <span @click="selectedChartTimeFrameIndex = i"
                class="hover:opacity-75 hover:cursor-pointer"
                :class="{'text-blue-500': selectedChartTimeFrameIndex === i}">{{ item.text }}</span>
        </span>
      </div>
    </div>

    <LoadingIcon class="mx-auto mt-4" v-if="walletTransactionsBlockChain.loading"/>
    <div v-else-if="walletTransactionsBlockChain.walletTransactions.length === 0">
      <div class="flex items-center justify-center h-40">
        <span class="text-gray-500">No transactions found</span>
      </div>
    </div>
    <div v-else-if="privacyModeActive">
      <div class="flex items-center justify-center h-40">
        <span class="text-gray-500">
Privacy mode is active. Data is hidden.
        </span>
      </div>
    </div>
    <canvas v-else ref="chartEl"></canvas>

  </DashboardCard>
</template>

<script setup>
import {ref, computed, watch, nextTick, reactive} from "vue"
import DashboardCard from "@/components/global/DashboardCard.vue"
import {useWalletTransactionsBlockChain} from "@/stores/wallet/WalletTransactionsBlockChain";
import LoadingIcon from "@/components/global/LoadingIcon.vue";
import Chart from "chart.js/auto";
import ButtonGroup from "@/components/inputs/ButtonGroup.vue";

import {
  fromUnixTime,
  format,
  addMonths,
  addWeeks,
  addDays,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  eachDayOfInterval
} from 'date-fns';
import {useStorage} from "@vueuse/core";
import {PRIVACY_MODE_ACTIVE_KEY} from "@/content/Global";
import {useCoinStore} from "@/stores/CoinStore";

const BALANCE_TYPES = [
  {
    text: 'FIAT',
    value: 'FIAT'
  },
  {
    text: 'SAT',
    value: 'SAT',
  },
  {
    text: 'BTC',
    value: 'BTC',
  }
]

const CHART_TYPES = [
  {
    text: 'Balance',
    value: 'BALANCE',
  },
  {
    text: 'BTC Price',
    value: 'BTC_PRICE',
  }
]

const BALANCE_TIME_PERIOD_FILTER = [
  {
    text: 'All',
    value: 'ALL'
  },
  {
    text: 'This year',
    value: format(new Date(), 'yyyy').toString()
  }
]

const BALANCE_TIME_FRAME_FILTER = [
  {
    text: 'Year',
    value: 'year'
  },
  {
    text: 'Month',
    value: 'month'
  },
  {
    text: 'Week',
    value: 'week'
  },
  {
    text: 'Day',
    value: 'day'
  }
]

const coinStore = useCoinStore()
const privacyModeActive = useStorage(PRIVACY_MODE_ACTIVE_KEY, false)

const selectedChartTimePeriodIndex = ref(1)
const selectedChartTimeFrameIndex = ref(1)

const selectedChartType = ref(CHART_TYPES[0].value)
const selectedBalanceType = ref(BALANCE_TYPES[0].value)

const walletTransactionsBlockChain = useWalletTransactionsBlockChain()
const chartEl = ref()

function formatChartData(transactions, timeframe, year) {

  if (transactions.length === 0) {
    return {
      labels: [],
      datasets: []
    }
  }

  const currentDate = new Date();
  let startDate, endDate;

  // Nastavenie časového intervalu podľa parametru 'year'
  if (year === 'ALL') {
    startDate = fromUnixTime(transactions[0].time);
    endDate = currentDate;
  } else {
    startDate = startOfYear(new Date(year, 0, 1));
    endDate = currentDate; // Zobrazenie do aktuálneho dátumu
  }

  // Funkcia na získanie časových intervalov
  const getIntervals = {
    year: () => eachYearOfInterval({start: startDate, end: endDate}),
    month: () => eachMonthOfInterval({start: startDate, end: endDate}),
    week: () => eachWeekOfInterval({start: startDate, end: endDate}),
    day: () => eachDayOfInterval({start: startDate, end: endDate})
  };

  // Zoskupenie transakcií podľa požadovaného intervalu
  const groupedData = {};
  transactions.forEach(tx => {
    const date = fromUnixTime(tx.time);
    if (date >= startDate && date <= endDate) {
      let period;
      switch (timeframe) {
        case 'year':
          period = format(date, 'yyyy');
          break;
        case 'month':
          period = format(date, 'MM.yyy');
          break;
        case 'week':
          period = format(date, 'ww-yyy');
          break;
        case 'day':
          period = format(date, 'dd.MM.yyy');
          break;
        default:
          throw new Error('Invalid timeframe value');
      }
      if (!groupedData[period]) {
        groupedData[period] = {received: 0, spent: 0};
      }
      if (tx.result > 0) {
        groupedData[period].received += tx.result;
      } else {
        groupedData[period].spent += Math.abs(tx.result);
      }
    }
  });

  // Formátovanie dát pre Chart.js
  const labels = [];
  const receivedData = [];
  const spentData = [];
  const intervals = getIntervals[timeframe]();

  intervals.forEach(date => {
    let period;
    switch (timeframe) {
      case 'year':
        period = format(date, 'yyyy');
        break;
      case 'month':
        period = format(date, 'MM.yyy');
        break;
      case 'week':
        period = format(date, 'ww-yyy');
        break;
      case 'day':
        period = format(date, 'dd.MM.yyy');
        // period = format(date, 'yyyy-MM-dd');
        break;
    }
    labels.push(period);
    receivedData.push(groupedData[period] ? groupedData[period].received : 0);
    spentData.push(groupedData[period] ? groupedData[period].spent : 0);
  });

  if (selectedBalanceType.value === 'BTC') {
    receivedData.map((value, index) => {
      receivedData[index] = coinStore.satsToBtc(value)
      // receivedData[index] = value / 100000000;
    })
    spentData.map((value, index) => {
      spentData[index] = coinStore.satsToBtc(value)
      // spentData[index] = value / 100000000;
    })
  } else if (selectedBalanceType.value === 'FIAT') {
    receivedData.map((value, index) => {
      receivedData[index] = coinStore.convertSatsToFiat(value)
    })
    spentData.map((value, index) => {
      spentData[index] = coinStore.convertSatsToFiat(value)
    })
  }

  if (privacyModeActive.value) {
    receivedData.map((value, index) => {
      receivedData[index] = '*'.repeat(8);
    })
    spentData.map((value, index) => {
      spentData[index] = '*'.repeat(8);
    })
  }

  return {
    labels,
    datasets: [
      {
        label: 'Received',
        data: receivedData,
        backgroundColor: 'rgb(74 222 128 )',
        borderColor: 'rgb(74 222 128 )',
        borderWidth: 1
      },
      {
        label: 'Spent',
        data: spentData,
        backgroundColor: 'rgb(248 113 113)',
        borderColor: 'rgb(248 113 113)',
        borderWidth: 1
      }
    ],
  };
}

const chartData = computed(() => {

  const year = BALANCE_TIME_PERIOD_FILTER[selectedChartTimePeriodIndex.value].value;
  const timeframe = BALANCE_TIME_FRAME_FILTER[selectedChartTimeFrameIndex.value].value;
  const transactions = walletTransactionsBlockChain.walletTransactions
  const chartData = formatChartData(transactions, timeframe, year)

  return {
    type: 'bar',
    data: chartData,
  }

})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          if (context.parsed.y !== null) label += selectedBalanceType.value === 'FIAT' ? `${coinStore.formatFiatCurrency(context.parsed.y)}` : context.parsed.y;
          return label
        }
      }
    }
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        callback: function (value, index, values) {
          if (selectedBalanceType.value === 'FIAT') return `${coinStore.formatFiatCurrency(value)}`
          // if (selectedBalanceType.value === 'FIAT') return `${value} ${coinStore.getSelectedCurrency}`
          else return value;
        }
      }
    }
  }
}

let createdChart = null
watch(() => chartData.value, (val) => {
  nextTick(() => {
    if (chartEl.value) {
      if (createdChart) {
        createdChart.destroy()
        createdChart = null
      }
      createdChart = new Chart(chartEl.value, {
        ...val,
        options: chartOptions
      })
    } else {
      console.warn('Chart element not found')
    }
  })

})


</script>