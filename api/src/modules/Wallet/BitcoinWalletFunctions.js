import {BIP32Factory} from "bip32"
import * as ecc from "tiny-secp256k1"
import * as bitcoin from "bitcoinjs-lib"
import {receiveAddressBalance} from "./ApiCalls.js";
import BigNumber from "bignumber.js";

const GENERATE_MAX_WALLET_ADDRESSES = 10

const network = bitcoin.networks.bitcoin

export const utoxoScriptToAddress = script => {
    const hashHex = script.substring(4, script.length - 2);
    const hash = Buffer.from(hashHex, 'hex');
    return bitcoin.payments.p2sh({hash: hash, network}).address
}

const sortKeysByLex = (data, key) => data.sort((a, b) => a[key].localeCompare(b[key]))

const createWalletOnPath = (xpubs, path) => {

    const publicKeysHex = xpubs.map(xpub => {
        const bip32 = BIP32Factory(ecc)
        const node = bip32.fromBase58(xpub, network);
        const child = node.derivePath(path)
        return {
            publicKey: child.publicKey.toString('hex')
        }
    })

    const publicKeysHexList = sortKeysByLex(publicKeysHex, 'publicKey')
    const publicKeysBuffer = publicKeysHexList.map(key => Buffer.from(key.publicKey, 'hex'))

    const p2ms = bitcoin.payments.p2ms({
        m: 2, pubkeys: publicKeysBuffer, network: network
    })

    const p2wsh = bitcoin.payments.p2wsh({redeem: p2ms, network: network})
    const p2sh = bitcoin.payments.p2sh({redeem: p2wsh, network: network})

    return [p2sh.address, path]

}

const generateWalletAddressOnPath = (xpubs, path, isChange) => {

    let list = {}
    for (let counter = 0; counter < GENERATE_MAX_WALLET_ADDRESSES; counter++) {
        const derivePath = isChange ? `1/${path + counter}` : `0/${path + counter}`
        const wallet = createWalletOnPath(xpubs, derivePath)
        list[wallet[0]] = {
            path: wallet[1]
        }
    }

    return {
        addresses: list,
        pathFinishedOn: path + (GENERATE_MAX_WALLET_ADDRESSES)
    }

}

export const loadAddressUseAndBalances = async (walletXpubs, isChange) => {


    let finalBalance = 0
    let newPath = 0
    let pathCounter = 0
    let newPathSet = false
    let newAddress = ''
    let error = false
    const addressesMap = {}

    main_loop:
        while (newPathSet === false) {

            const {addresses, pathFinishedOn} = generateWalletAddressOnPath(walletXpubs, pathCounter, isChange)

            pathCounter = pathFinishedOn
            Object.assign(addressesMap, addresses)

            const newAddressesList = Object.keys(addresses)
            const balancesOnAddress = await receiveAddressBalance(newAddressesList)

            let foundNewPath = false
            for (let singleWalletAddress of newAddressesList) {
                const balance = balancesOnAddress[singleWalletAddress]
                if (!balance) break main_loop
                addressesMap[singleWalletAddress].balance = balance
                if (balance.total_received === 0 && !foundNewPath) {
                    foundNewPath = true
                    newPath = addresses[singleWalletAddress].path
                    newAddress = singleWalletAddress
                }
                finalBalance += balance.final_balance
            }

            if (foundNewPath) newPathSet = true
            if (pathCounter >= 210) {
                newPathSet = true
                error = true
            }

        }

    return {
        addressesMap,
        finalBalance,
        newPath,
        newAddress,
        error
    }

}
