import {ref, reactive, computed} from 'vue'
import {defineStore} from 'pinia'
import {getCurrencyConversion} from '@/services/block-chain/Coin.js'
import ApiService from "@/services/ApiService";
import {useSocketStore} from "@/stores/SocketStore";

const CURRENCY = 'bitcoin'

import sb from "satoshi-bitcoin"
import {CURRENCIES} from "@/content/Global";

export const useCoinStore = defineStore('CoinStore', () => {

    const socketStore = useSocketStore()

    const selectedCurrency = ref(CURRENCIES[0].val)
    const selectedCurrencyLocale = computed(() => CURRENCIES.find(currency => currency.val === selectedCurrency.value).locale)
    const setCurrency = currency => selectedCurrency.value = currency
    const getSelectedCurrency = computed(() => selectedCurrency.value)

    const tickers = reactive({})
    const currentBtcPrice = computed(() => tickers[selectedCurrency.value])

    const init = () => {

        socketStore.addHook({
            id: 'coin-store',
            onConnect: socket => {
                socket.on('update-tickers', (data) => {
                    Object.assign(tickers, data)
                })
            },
            onDisconnect: socket => {
                socket.off('update-tickers')
            }
        })
        // socketStore.emitEvent('update-tickers')
    }

    const convertFiatToSats = (fiat) => Number(Number(fiat) / currentBtcPrice.value * 100_000_000).toFixed()
    const convertSatsToFiat = (sats, roundDown = false, decimalCount = 0) => {
        const value = Number(satsToBtc(sats) * currentBtcPrice.value).toFixed(2)
        if (!roundDown) return value
        if (decimalCount > 0) return Number(value).toFixed(decimalCount)
        return Math.floor(Number(value))
    }
    const satsToBtc = (sats) => {
        return sb.toBitcoin(sats)
    }

    const btcToSats = (btc) => {
        return sb.toSatoshi(btc)
    }

    const formatFiatCurrency = (amount, includeCurrencySymbol = true) => {

        const formatter = new Intl.NumberFormat(selectedCurrencyLocale.value, {
            style: includeCurrencySymbol ? 'currency' : 'decimal',
            currency: selectedCurrency.value,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })

        return formatter.format(amount)
    }

    return {
        // loadPrice,
        // stopLoadingBtcPrice,
        // startLoadingBtcPrice,
        convertSatsToFiat,
        convertFiatToSats,
        satsToBtc,
        setCurrency,
        btcToSats,
        init,
        formatFiatCurrency,
        getSelectedCurrency
        // convertValueToSelectedCurrency
    }

})