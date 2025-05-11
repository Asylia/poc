import {BIP32Factory} from 'bip32';
import * as ecc from 'tiny-secp256k1';
import ApiService from "@/services/ApiService";
import * as bitcoin from "bitcoinjs-lib";
import BigNumber from "bignumber.js";

const API_URL = 'https://blockstream.info/api';

export const getWalletDataByAddress = async address => {
    try {
        const response = await fetch(`${API_URL}/address/${address}`)
        const parsedResponse = await response.json()
        return {
            data: parsedResponse, error: null
        }
    } catch (error) {
        return {
            data: null, error: error
        }
    }
}

async function getUTXOsForAddress(address) {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}?unspentOnly=true`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.txrefs) {
            return data.txrefs.map(utxo => ({
                txid: utxo.tx_hash, value: utxo.value, vout: utxo.tx_output_n,
            }));
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

// Použitie funkcie


export const getWalletUTXOsByAddress = async address => {
    try {
        const response = await fetch(`${API_URL}/address/${address}/utxo`);
        const utxos = await response.json();
        return {
            data: utxos, error: null
        };
    } catch (error) {
        console.error('Chyba pri získavaní UTXOs:', error);
        return {
            data: null, error: error
        }
    }
}

export const getWalletUTXOsByAddress2 = async address => {
    try {

        const {data, error} = await ApiService('GET', 'unspent', {
            active: address,
        })


        const os = data?.unspent_outputs ?? []

        for (let i = 0; i < os.length; i++) {

            const network = bitcoin.networks.bitcoin;
            const scriptToAddress = (script) => {

                const hashHex = script.substring(4, script.length - 2); // Odstránime prvé 4 a posledné 2 znaky
                const hash = Buffer.from(hashHex, 'hex'); // Konverzia hex stringu na Buffer

                // Teraz by mal hash mať správnu dĺžku 20 bajtov
                const p2sh = bitcoin.payments.p2sh({hash: hash, network});
                return p2sh.address;

            };

            os[i]['address'] = scriptToAddress(os[i]['script']);

        }


        return {
            data: os,
            error: null
        }

    } catch (error) {
        console.error('Chyba pri získavaní UTXOs:', error);
        return {
            data: null, error: error
        }
    }
}


export const uni8ArrayToHexString = byteArray => Array.from(byteArray, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('')
// export const HexStringToUnit8Array = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
export const HexStringToUnit8Array = hexString => Buffer.from(hexString, 'hex')

/*
 not used
 */
const globalxput = ()=>{
    for (const device of Devices) {
        const pkey = device.PublicKey
        pkey['name'] = device.Name ?? 'asylia'

        const bip32 = BIP32Factory(ecc)
        const node = bip32.fromBase58(pkey.Xpub);

        const xpubMark = Buffer.from('0488b21e', 'hex')
        const depth = Buffer.from([node.depth])
        const parentFingerprint = Buffer.from(new BigNumber(node.parentFingerprint).toNumber().toString(16), 'hex')
        const childNum = Buffer.from(new BigNumber(node.index).toNumber().toString(16), 'hex')
        const chainCode = node.chainCode
        const publicKey = node.publicKey

        const r = Buffer.concat([xpubMark, depth, parentFingerprint, childNum, chainCode, publicKey]);


        pkey['extendedPublicKey'] = r.toString('hex')
        pkey['PublicKey'] = publicKey.toString('hex')

    }

    const sortKeysByLex = (data, key) => data.sort((a, b) => {
        return a[key].localeCompare(b[key])
    })

}
