import * as bitcoin from "bitcoinjs-lib"
import * as ecc from "tiny-secp256k1"
import {BIP32Factory} from "bip32";
import {MAIN_BIP32_PATH} from "@/content/PublicKeysEnum";

const sortKeysByLex = (data, key) => data.sort((a, b) => a[key].localeCompare(b[key]))

const HARDENING_OFFSET = Math.pow(2, 31);

export const bip32PathToSequence = pathString => {
    const pathSegments = pathString.split("/").splice(1);
    return pathSegments.map((pathSegment) => {
        if (pathSegment.substr(-1) === "'") {
            return parseInt(pathSegment.slice(0, -1), 10) + HARDENING_OFFSET;
        } else {
            return parseInt(pathSegment, 10);
        }
    });
}

export const derivePubKey = (xpub, derivePath, network) => {
    const bip32 = BIP32Factory(ecc)
    if (typeof xpub !== 'string') {
        throw new Error('xpub musí byť reťazec');
    }
    const node = bip32.fromBase58(xpub, network);
    const child = node.derivePath(derivePath)
    return {
        publicKeyBuffer: child.publicKey,
        publicKeyHex: child.publicKey.toString('hex')
    }
}

export const derivePubKeysForWallet = (keys, derivePath, network) => {
    let publicKeys = keys.map((key, index) => {
        const derivedPubKey = derivePubKey(key.xpub, derivePath, network)
        return {
            ...key,
            derivedPubKeyHex: derivedPubKey.publicKeyHex,
            derivedPubKeyBuffer: derivedPubKey.publicKeyBuffer,
        }
    })

    publicKeys = sortKeysByLex(publicKeys, 'derivedPubKeyHex')

    return {
        publicKeys,
        mappedDerivedPubKeysBuffer: publicKeys.map(key => key.derivedPubKeyBuffer),
        mappedDerivedPubKeysHex: publicKeys.map(key => key.derivedPubKeyHex)
    }
}


export const pubKeysToBip32Derivation = (publicKeys, derivePath) => {

    return publicKeys.publicKeys.map(pubKey => ({
        masterFingerprint: Buffer.from(pubKey.xfp, 'hex'),
        path: (MAIN_BIP32_PATH + '/' + derivePath),
        pubkey: Buffer.from(pubKey.derivedPubKeyHex, 'hex'),
    }))

}
export const createP2SHTOP2WSHWallet = ({m, exportedPublicKeys, derivePath}) => {

    const network = bitcoin.networks.bitcoin
    const publicKeys = derivePubKeysForWallet(exportedPublicKeys, derivePath, network)

    const p2ms = bitcoin.payments.p2ms({
        m,
        pubkeys: publicKeys.mappedDerivedPubKeysBuffer,
        network: network
    });

    const p2wsh = bitcoin.payments.p2wsh({redeem: p2ms, network: network})
    const p2sh = bitcoin.payments.p2sh({redeem: p2wsh, network: network})
    const bip32Derivation = pubKeysToBip32Derivation(publicKeys, derivePath)

    return {
        p2ms, p2wsh, p2sh, publicKeys, bip32Derivation
    }

}

// not used
const extractAfterLastHardeningOffset = path => {
    // Regulárny výraz na nájdenie časti za posledným hardening offsetom
    const regex = /.*'\//;
    const matches = path.match(regex);

    // Ak nájdeme zhodu, vrátime časť za posledným hardening offsetom
    if (matches && matches[0]) {
        return path.slice(matches[0].length);
    } else {
        // Ak neexistuje žiaden hardening offset, vrátime celý vstup
        return path;
    }
}

export const ADDRESS_SCRIPT_TYPES = {
    P2WSH: "SPENDWITNESS",
    PAYTOADDRESS: "PAYTOADDRESS",
}
