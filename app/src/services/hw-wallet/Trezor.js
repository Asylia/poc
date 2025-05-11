import TrezorConnect from "@trezor/connect-web";
import {reactive, ref} from "vue"
import {MULTISIG_ROOT} from "@/content/PublicKeysEnum";
import {bip32PathToSequence} from "@/comps/Wallet";

const trezorHasInitLoaded = ref(false)
const connectedDeviceState = reactive({
    id: null,
    name: ''
})

const TrezorInteraction = {

    initTrezor: async () => {
        return new Promise((resolve, reject) => {
            if (trezorHasInitLoaded.value) return resolve()
            TrezorConnect.init({
                lazyLoad: false,
                manifest: {
                    email: import.meta.env.VITE_APP_CONTACT_EMAIL,
                    appUrl: import.meta.env.VITE_APP_BASE_URL,
                },
                debug: false,
            }).then((r) => {

                TrezorConnect.on('DEVICE_EVENT', event => {
                    if (!['device-connect', 'device-changed'].includes(event.type) || event.payload?.type !== 'acquired') return
                    connectedDeviceState.id = event.payload.id
                    connectedDeviceState.name = event.payload.name
                })

                setTimeout(() => trezorHasInitLoaded.value = true, 500)
                resolve()
            }).catch(error => {
                // todo: handle error
                reject({error})
            })
        })
    },

    destroyTrezor: () => {
        TrezorConnect.dispose()
        trezorHasInitLoaded.value = false
        connectedDeviceState.id = null
        connectedDeviceState.name = ''
    },

    exportPublicKey: bip32Path => new Promise(async (resolve, reject) => {

        DEBUGGER.debug('TrezorInteraction.exportPublicKey()', bip32Path)

        await TrezorInteraction.initTrezor()

        const catchError = error => reject({
            data: null,
            error,
        })

        try {
            const result = await TrezorConnect.getPublicKey({
                coin: "Bitcoin",
                bundle: [
                    {
                        path: bip32Path,
                        showOnTrezor: false,
                    },
                    {
                        path: MULTISIG_ROOT,
                        showOnTrezor: true,
                    },
                ],
                // showOnTrezor: true,
                crossChain: true
            })

            if (!result.success) return catchError(result.payload.error)

            if (result.payload.length !== 2) return catchError('Payload does not have two responses.')

            const key = {
                path: result.payload[0].serializedPath,
                xpub: result.payload[0].xpub,
                xfp: result.payload[1].fingerprint.toString(16),
            }

            return resolve({
                data: {
                    key,
                    device: {
                        DeviceFullName: connectedDeviceState.name,
                        DeviceMeta: {},
                        DeviceHwId: connectedDeviceState.id,
                    }
                },
                error: null
            })

        } catch (e) {
            return catchError(e)
        } finally {
            await TrezorInteraction.destroyTrezor()
        }

    }),

    signPSBTTransaction: ({psbt, derivedPublicKeys, m}) => new Promise(async resolve => {

        await TrezorInteraction.initTrezor()

        const txInputs = psbt.txInputs
        const dataInputs = psbt.data.inputs
        const txOutputs = psbt.txOutputs

        const mapInputSignatureForInput = input => {
            if (!input?.partialSig) return Array(derivedPublicKeys.publicKeys.length).fill("")
            const signatures = []
            for (const singlePublicKey of derivedPublicKeys.publicKeys) {

                let signature = ""
                for (const singlePartSing of input.partialSig) {
                    if (singlePublicKey.derivedPubKeyHex === singlePartSing.pubkey.toString('hex')) {
                        signature = singlePartSing.signature.toString('hex')
                    }
                }
                signatures.push(signature)
            }
            return signatures
        }

        const mappedInputs = txInputs.map((input, i) => {
            const data = {
                address_n: bip32PathToSequence(dataInputs[i].bip32Derivation[0].path),
                prev_hash: input.hash.reverse().toString('hex'),
                prev_index: input.index,
                script_type: 'SPENDP2SHWITNESS',
                amount: dataInputs[i].witnessUtxo.value,
                sequence: input.sequence,
                multisig: {
                    m,
                    pubkeys: dataInputs[i].bip32Derivation.map(key => ({
                        address_n: [],
                        node: {
                            // todo fix me ??
                            depth: 0,
                            child_num: 0,
                            fingerprint: 0,
                            chain_code: "0".repeat(64),
                            public_key: key.pubkey.toString('hex')
                        }
                    })),
                    signatures: mapInputSignatureForInput(dataInputs[i])
                }
            }
            return data
        })


        const mappedOutputs = txOutputs.map((out, i) => ({
            address: out.address,
            amount: out.value,
            script_type: 'PAYTOADDRESS'
        }))

        const transactionToSign = {
            coin: 'Bitcoin',
            inputs: mappedInputs,
            outputs: mappedOutputs,
            version: 2
        }

        try {

            const result = await TrezorConnect.signTransaction(transactionToSign)


            if (!result.success) {
                // todo
                resolve({
                    data: null,
                    error: 'err 1'
                })
            }

            // mark as sig all
            result.payload.signatures = result.payload.signatures.map(sig => `${sig}01`)

            return resolve({
                data: {
                    serializedTx: result.payload.serializedTx,
                    signatures: result.payload.signatures,
                    witnesses: result.payload.witnesses,
                },
                error: null,
            })

        } catch (e) {
            resolve({
                data: null,
                error: 'err 2'
            })
        } finally {
            await TrezorInteraction.destroyTrezor()
        }

    })

}

export default TrezorInteraction
