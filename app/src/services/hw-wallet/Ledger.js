import {ref} from "vue"
import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import {PsbtV2 as xa} from "@ledgerhq/hw-app-btc/newops/psbtv2"
import {AppClient, DefaultWalletPolicy, WalletPolicy} from 'ledger-bitcoin'

const transport = ref()
const LEDGER_XPUB_VERSION = 0x0488b21e

const LedgerInteraction = {

    openTransport: () => new Promise(async (resolve, reject) => {

        if (transport.value) return reject({
            error: 'Transport already initialized'
        })

        try {
            transport.value = await TransportWebUSB.request()
        } catch (e) {
            return reject({
                error: e, data: null
            })
        }

        resolve({error: null, data: null})

    }),

    getBitcoinPublicKey: bip32Path => new Promise(async function (resolve, reject) {

        DEBUGGER.log('LedgerInteraction.getBitcoinPublicKey()', bip32Path)
        const {error} = await LedgerInteraction.openTransport()

        if (error) return reject({data: null, error})

        try {

            const app = new AppClient(transport.value);
            const exportedXpub = await app.getExtendedPubkey(bip32Path, true)
            const fingerPrintHex = await app.getMasterFingerprint()

            const key = {
                path: bip32Path,
                xpub: exportedXpub,
                xfp: fingerPrintHex
            }

            return resolve({
                data: {
                    key,
                    device: {
                        DeviceFullName: transport.value?.device?.productName,
                        DeviceMeta: {},
                        DeviceHwId: transport.value?.device?.vendorId
                    }
                },
                error: null
            })

        } catch (e) {
            return reject({data: null, error: e})
        } finally {
            await LedgerInteraction.closeTransport()
        }
    }),

    installWallet: (name, bip32Paths) => new Promise(async (resolve) => {

        const {error} = await LedgerInteraction.openTransport()
        if (error) return {data: null, error}

        const app = new AppClient(transport.value);
        const createKey = (masterFingerprint, bip32Path, xpub) => `[${masterFingerprint}${bip32Path}]${xpub}`

        const keys = []
        for (let path of bip32Paths) {
            const key = createKey(path.xfp, "/48'/0'/0'/1'", path.xpub);
            keys.push(key)
        }


        try {

            const multisigPolicy = new WalletPolicy(
                name,
                "sh(wsh(sortedmulti(2,@0/**,@1/**,@2/**)))",
                [
                    ...keys
                ]
            )


            const [policyId, policyHmac] = await app.registerWallet(multisigPolicy);

            const hmc = policyHmac.toString('hex') || null

            if (!hmc) return resolve({data: null, error: 'HMC is null'})

            resolve({
                data: hmc,
                error: null
            })

        } catch (e) {
            resolve({data: null, error: e})
        }

    }),

    signPsbtTransaction: (psbt, name, bip32Paths) => new Promise(async (resolve) => {


        const {error} = await LedgerInteraction.openTransport()
        if (error) return {data: null, error}

        try {

            const app = new AppClient(transport.value);


            function createKey(masterFingerprint, bip32Path, xpub) {
                return `[${masterFingerprint}${bip32Path}]${xpub}`;
            }

            const ledgerPsbt = new xa();

            ledgerPsbt.deserialize(
                Buffer.from(psbt.serialize("base64"), "base64")
            )


            const keys = []
            for (let path of bip32Paths) {
                const key = createKey(path.xfp, "/48'/0'/0'/1'", path.xpub);
                keys.push(key)
            }

            const multisigPolicy = new WalletPolicy(
                name,
                "sh(wsh(sortedmulti(2,@0/**,@1/**,@2/**)))",
                [
                    ...keys
                ]
            )


            const [policyId, policyHmac] = await app.registerWallet(multisigPolicy);

            const hmc = Buffer.from(policyHmac.toString('hex'), "hex") || null

            await app.signPsbt(ledgerPsbt, multisigPolicy, hmc).then((result) => {


                function remapArrayOfPairs(inputArray) {
                    // Vytvorenie nového poľa pre výsledky
                    const resultArray = [];

                    // Iterovanie cez vnútorné polia
                    inputArray.forEach(pair => {
                        const [index, obj] = pair;
                        resultArray[index] = obj;
                    });

                    return resultArray;
                }

                const ensureSignatureIsSigHasAll = sig => sig.endsWith('01') ? sig : sig + '01'


                if (result[0] && result[0].length >= 2) {
                    const signatures = remapArrayOfPairs(result).map(sig => {
                        return {
                            pubkey: sig.pubkey,
                            signature: ensureSignatureIsSigHasAll(sig.signature.toString('hex'))
                        }
                    })
                    resolve({data: signatures, error: null})
                }

            }).catch((err) => {
                console.error(err);
                resolve({data: null, error: err})
            })

        } catch (e) {
            resolve({data: null, error: e})
        } finally {
            await LedgerInteraction.closeTransport()
        }

    }),

    closeTransport: async () => {
        if (!transport.value) return
        await transport.value.close()
        transport.value = null
    }

}


export default LedgerInteraction