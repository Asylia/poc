import {ASYLIA_SAFE_KEY_1} from "../../content/PublickKeys.js"
import {getMultiAddressInfo, getUTXOsForAddressList} from './ApiCalls.js'
import {getWalletUsers} from './DbCalls.js'
import isEqual from "is-equal"
import {
    loadAddressUseAndBalances,
    utoxoScriptToAddress
} from "./BitcoinWalletFunctions.js";

const WALLET_STATUS_ENUM = {
    NOT_LOADED: 'NOT_LOADED',
    NOT_SETUP: 'NOT_SETUP',
    OK: 'OK',
    ON_HOLD: 'ON_HOLD',
}

const EMPTY_ROOM = {
    socketIdList: [],
    interval: null,
    delayTimeout: null
}

class WalletInstanceHolder {

    io = null
    walletId = ''
    instanceCreated = null
    roomName = ''
    initialLoadDone = false
    socketRoom = EMPTY_ROOM

    /*
     * Wallet Config
     */

    rawWalletConfig = {}
    mappedWalletConfig = {}
    walletXpubs = []

    /*
     * Wallet Address
     */
    receiveAddressMap = {}
    changeAddressMap = {}
    newReceivePath = ''
    newChangePath = ''
    newReceiveAddress = ''
    newChangeAddress = ''
    utxos = []
    unconfirmedUtxos = []

    /*
     * Wallet balance
     */
    balance = {
        receivedBalance: 0,
        balanceInMempool: 0,
        confirmedBalance: 0
    }

    /*
    * Wallet Users
    */
    walletUsers = []

    constructor(io, rawWalletConfig) {
        this.io = io
        this.rawWalletConfig = rawWalletConfig
        this.initialLoadDone = false
        this.walletId = rawWalletConfig.id
        this.instanceCreated = new Date().getTime()
        this.roomName = `wallet-${rawWalletConfig.id}`
        this.socketRoom = EMPTY_ROOM
    }

    setWalletDataKeyVal(key, val, forceEmit = false) {
        let hasChange = false
        if (this.initialLoadDone) {
            hasChange = !isEqual(this[key], val)
        }
        this[key] = val
        if (hasChange || forceEmit) {
            this.emitWalletData(key, val)
        }
        return hasChange
    }

    // not used
    setWalletDataObjectKeyVal(obj = '', key = '', val, emit = false) {
        let hasChange = false
        if (this.initialLoadDone) hasChange = !isEqual(this[obj][key], val)
        this[obj][key] = val
        if (hasChange || emit) this.emitWalletData(obj, this[obj])
        return hasChange
    }

    setWalletDataObject(key, obj, assign = false, forceEmit = false) {
        let hasChange = false
        if (this.initialLoadDone) {
            for (const [objKey, val] of Object.entries(obj)) {
                if (assign) {
                    if (!isEqual(this[key][objKey], val)) {
                        hasChange = true
                        break
                    }
                } else {
                    for (const [objKey, val] of Object.entries(obj)) {
                        if (!isEqual(this[objKey], val)) {
                            hasChange = true
                            break
                        }
                    }
                }
            }
        }

        if (!assign) {
            for (const [objKey, val] of Object.entries(obj)) {
                this[objKey] = val
            }
        } else {
            for (const [objKey, val] of Object.entries(obj)) {
                this[key][objKey] = val
            }
        }

        if (hasChange || forceEmit) {
            if (assign) {
                this.emitWalletData(key, this[key])
            } else {
                this.emitWalletData(key, obj)
            }
        }
        return hasChange
    }

    emitWalletData(key, data) {
        this.io.to(this.roomName).emit(`update-${key}`, data)
    }

}

class MyWallet extends WalletInstanceHolder {

    constructor(io, rawWalletConfig) {
        super(io, rawWalletConfig)
    }

    /*
     * Wallet config
     */

    mapWalletConfig() {

        const walletConfig = {
            name: this.rawWalletConfig.name,
            addressType: "P2SH-P2WSH",
            uuid: this.walletId,
            quorum: {
                requiredSigners: 2,
                totalSigners: 3
            },
            network: "mainnet",
            client: {
                "type": "public"
            },
            extendedPublicKeys: this.rawWalletConfig.extendedPublicKeys,
            startingAddressIndex: 0,
            ledgerPolicyHmacs: []
        }

        const asyliaKeyAdded = walletConfig.extendedPublicKeys.find(key => key.xpub === ASYLIA_SAFE_KEY_1.xpub)
        if (!asyliaKeyAdded) {
            walletConfig.extendedPublicKeys.push(ASYLIA_SAFE_KEY_1)
        }

        this.mappedWalletConfig = walletConfig
        this.walletUsers = this.rawWalletConfig.users
        // this.walletUserIdList = this.rawWalletConfig.userIdList
        this.walletXpubs = walletConfig.extendedPublicKeys.map(key => key.xpub)

    }

    async getAndMapAddressUseAndBalances() {

        const {
            error: receiveError,
            addressesMap: receiveAddressMap,
            finalBalance: receivedBalance,
            newPath: newReceivePath,
            newAddress: newReceiveAddress
        } = await loadAddressUseAndBalances(this.walletXpubs, false)

        const {
            error: changeError,
            addressesMap: changeAddressMap,
            finalBalance: changeBalance,
            newPath: newChangePath,
            newAddress: newChangeAddress
        } = await loadAddressUseAndBalances(this.walletXpubs, true)

        const finalBalance = receivedBalance + changeBalance
        const hasError = receiveError || changeError

        return {
            data: {
                address: {
                    receiveAddressMap,
                    changeAddressMap,
                    newReceivePath,
                    newChangePath,
                    newReceiveAddress,
                    newChangeAddress,
                },
                balance: {
                    receivedBalance: finalBalance
                }
            },
            error: hasError
        }

    }

    async calculateWalletBalance() {

        if (this.getWalletStatus() === WALLET_STATUS_ENUM.NOT_SETUP) return

        // balance and addresses
        const walletAddressesAndBalanceData = await this.getAndMapAddressUseAndBalances()
        // todo
        if (walletAddressesAndBalanceData.error) {
            return
        }

        const addressesOrBalanceHasChange = this.setWalletAddressAndBalances(walletAddressesAndBalanceData.data)

        if (addressesOrBalanceHasChange || !this.initialLoadDone) {
            const walletUtxo = await this.loadAndMapUTXOsForWallet()
            this.setUtxo(walletUtxo)
        }

    }

    debugCounter = -999999

    setWalletAddressAndBalances(data) {
        const addressChange = this.setWalletDataObject('address', data.address, false, this.debugCounter === 2)
        const balanceChange = this.setWalletDataObject('balance', data.balance, true, this.debugCounter === 2)
        this.debugCounter++
        return addressChange || balanceChange
    }

    get walletAddressList() {
        return [...Object.keys(this.receiveAddressMap), ...Object.keys(this.changeAddressMap)]
    }

    async loadAndMapUTXOsForWallet() {

        const utxos = await getUTXOsForAddressList(this.walletAddressList)

        let balanceInMempool = 0
        let confirmedBalance = 0

        const mappedUtxos = utxos.map(utxo => {
            // balanceInMempool += utxo.value
            if (utxo.confirmations === 0) balanceInMempool += utxo.value
            else confirmedBalance += utxo.value
            const address = utoxoScriptToAddress(utxo.script)
            let addressPath = ''
            if (this.receiveAddressMap[address]) {
                addressPath = this.receiveAddressMap[address].path
            } else if (this.changeAddressMap[address]) {
                addressPath = this.changeAddressMap[address].path
            }
            return {
                ...utxo,
                address,
                addressPath,
            }

        }).filter(utxo => utxo.confirmations > 0)

        this.unconfirmedUtxos = utxos.filter(utxo => utxo.confirmations === 0)

        return {
            balance: {
                balanceInMempool,
                confirmedBalance
            },
            utxos: mappedUtxos
        }
    }

    async getWalletBlockChainTransactions(n, offset) {

        const data = await getMultiAddressInfo(this.walletAddressList, n + 200, 0)

        const mappedTransactions = []

        for (const tx of data.txs) {
            mappedTransactions.push({
                hash: tx.hash,
                result: tx.result,
                isConfirmed: tx.block_height !== null,
                time: tx.time,
                isReceive: tx.result > 0,
            })
        }

        return {
            transactions: mappedTransactions
        }

    }

    setUtxo(data) {
        this.setWalletDataKeyVal('utxos', data.utxos)
        this.setWalletDataObject('balance', data.balance, true)
    }

    get fullWalletData() {
        return {
            status: this.getWalletStatus(),
            config: this.mappedWalletConfig,
            balance: this.balance,
            address: {
                receiveAddressMap: this.receiveAddressMap,
                changeAddressMap: this.changeAddressMap,
                newReceivePath: this.newReceivePath,
                newChangePath: this.newChangePath,
                newReceiveAddress: this.newReceiveAddress,
                newChangeAddress: this.newChangeAddress,
            },
            utxos: this.utxos,
            walletUsers: this.walletUsers
        }
    }

    getWalletStatus() {

        const walletHasAllKeys = this.mappedWalletConfig.extendedPublicKeys.length === this.mappedWalletConfig.quorum.totalSigners

        let status = null
        if (!walletHasAllKeys) {
            status = WALLET_STATUS_ENUM.NOT_SETUP
        } else {
            status = WALLET_STATUS_ENUM.OK
        }

        return status
    }

    emitWalletFullData() {
        this.io.to(this.roomName).emit(`update-wallet-full-data`, this.fullWalletData)
    }

}

export default class WalletManager extends MyWallet {

    constructor(io, rawWalletConfig) {
        super(io, rawWalletConfig)
    }

    async create() {

        this.mapWalletConfig()

        if (this.getWalletStatus() === WALLET_STATUS_ENUM.NOT_SETUP) return
        await this.calculateWalletBalance()

        this.initialLoadDone = true
    }



    async reloadWalletUsers() {
        const walletUsers = await getWalletUsers(this.walletId)
        this.setWalletDataKeyVal('walletUsers', walletUsers, true)
    }


}
