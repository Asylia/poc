import {createGlobalStore} from "#app/plugins/custom/GlobalStore.js";
import {BlockChainInfoApi} from "#app/plugins/BlockChainInfoApi.js";
import isEqual from "is-equal";

const tickersStore = createGlobalStore('tickers');
const TICKERS_REFRESH_INTERVAL = 1000 * 10;

export const setupTickerSocketHandlers = (io, socket) => {
    const currentTickers = tickersStore.get('tickers');
    if (currentTickers) {
        socket.emit('update-tickers', currentTickers);
    } else {
    }
}

export const startLoadingTickers = async (io) => {
    tickersStore.set('interval', null);
    tickersStore.set('data', null);

    async function loadTickers() {
        const {data, error} = await BlockChainInfoApi.Get('ticker');

        if (error || Object.keys(data).length === 0) {
            console.warn('Error loading tickers:', error);
            return;
        }

        const mappedData = {USD: data.USD.last, CZK: data.CZK.last, EUR: data.EUR.last};
        const previousData = tickersStore.get('tickers');

        if (!isEqual(previousData, mappedData)) {
            tickersStore.set('tickers', mappedData);
            io.sockets.sockets.forEach(socket => {
                socket.emit('update-tickers', mappedData);
            })
        }
    }

    if (tickersStore.interval) clearInterval(tickersStore.interval);
    tickersStore.interval = setInterval(loadTickers, TICKERS_REFRESH_INTERVAL);
    await loadTickers();  // Initial load
}
