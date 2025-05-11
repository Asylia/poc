import WalletManager from "../Wallet.js";
import {createGlobalStore} from "#app/plugins/custom/GlobalStore.js";

const KEEP_WALLET_INSTANCE_ALIVE_AFTER_ALL_USERS_LEFT = (process.env.NODE_ENV === 'development' ? 60 : (3 * 60)) * 1000
const REFRESH_WALLET_BALANCE_INTERVAL = 30 * 1000

const walletsStore = createGlobalStore('wallets')

export const getRoomName = walletId => `wallet-${walletId}`

export const findWalletInList = (list, id) => list.find(wallet => wallet.id === id)

export const createWalletInstance = async (walletConfig, io) => {

    const Wallet = new WalletManager(io, walletConfig)
    await Wallet.create()

    /*
     * Save wallet instance to global store
     * add extra condition before save to avoid overwriting existing wallet instance
     * and function may be called multiple times and take time to create wallet instance
     */
    if (!walletsStore.has(Wallet.roomName)) {
        walletsStore.set(Wallet.roomName, Wallet)
        return Wallet
    }

    return walletsStore.get(Wallet.roomName)

}

const recheckWalletBalance = async (roomName) => {

    if (!walletsStore.has(roomName)) {
        return -1;
    }

    await walletsStore[roomName].calculateWalletBalance()

}

export const userJoinedWallet = async (walletConfig, io, socketId) => {

    const roomName = getRoomName(walletConfig.id)

    if (!walletsStore.has(roomName)) {
        await createWalletInstance(walletConfig, io)
        await walletsStore[roomName].calculateWalletBalance()
        walletsStore[roomName].emitWalletFullData()
    }

    if (walletsStore[roomName].socketRoom.delayTimeout) {
        clearTimeout(walletsStore[roomName].socketRoom.delayTimeout);
        walletsStore[roomName].socketRoom.delayTimeout = null;
    }

    walletsStore[roomName].socketRoom.socketIdList.push(socketId);
    if (walletsStore[roomName].socketRoom.socketIdList.length >= 1 && !walletsStore[roomName].socketRoom.interval) {
        // await walletsStore[roomName].calculateWalletBalance()
        walletsStore[roomName].socketRoom.interval = setInterval(async () => {

            await recheckWalletBalance(roomName)

        }, REFRESH_WALLET_BALANCE_INTERVAL)
    }

}

export const disconnectUserFromWallet = (roomName, socketId) => {

    if (!walletsStore.has(roomName)) return;

    walletsStore[roomName].socketRoom.socketIdList = walletsStore[roomName].socketRoom.socketIdList.filter(id => id !== socketId);
    if (walletsStore[roomName].socketRoom.socketIdList.length === 0) {
        clearInterval(walletsStore[roomName].socketRoom.interval)
        walletsStore[roomName].socketRoom.interval = null
        walletsStore[roomName].socketRoom.delayTimeout = setTimeout(() => {
            walletsStore.remove(roomName)
        }, KEEP_WALLET_INSTANCE_ALIVE_AFTER_ALL_USERS_LEFT)
    }
};
