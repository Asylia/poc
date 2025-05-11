export const KEY_TYPES = {
    TREZOR: 'trezor',
    LEDGER: 'ledger',
    COLD_CARD: 'cold-card',
    HOT_WALLET: 'hot-wallet'
}

export const KEY_TYPES_DATA = {
    [KEY_TYPES.TREZOR]: {
        name: 'Trezor',
        image: "/icons/trezor/icon.svg"
    },
    [KEY_TYPES.LEDGER]: {
        name: 'Ledger',
        image: "/icons/ledger/icon.svg"
    },
    [KEY_TYPES.COLD_CARD]: {
        name: 'Cold Card',
        image: "/icons/key-icon.svg"
    },
    [KEY_TYPES.HOT_WALLET]: {
        name: 'Hot Wallet',
        image: "/icons/key-icon.svg"
    }
}
export const MULTISIG_ROOT = "m/45'"
export const MAIN_BIP32_PATH = "m/48'/0'/0'/1'"
export const MAIN_BIP32_PATH_DEPTH = 4
export const MAIN_BIP32_CHILD_NUM = 2147483649

export const getKeyDataByType = type => {
    return KEY_TYPES_DATA[type]
}

export const ASYLIA_SAFE_KEY_1 = {
    "name": "Asylia-sign-key",
    "bip32Path": "m/48'/0'/0'/1'",
    "xpub": "xpub6DqsZhS2knACUFefZDC8SQ26avw8ZiThx1NebtFcF8sF6Nuiie77dNwb9s9Ho6ZmDvKfqiDdiadM1RWwiC2HVbb8ptS44MXqaUPcAeuYkMb",
    "xfp": "9ea6b6de",
    "method": "trezor",
}

export const ASYLIA_SIGN_DEVICE_1 = {
    name: 'Asylia sign key 1',
    "Id": import.meta.env.VITE_SERVICE_ASYLIA_SIGN_DEVICE_1,
    "Xpub": "xpub6DqsZhS2knACUFefZDC8SQ26avw8ZiThx1NebtFcF8sF6Nuiie77dNwb9s9Ho6ZmDvKfqiDdiadM1RWwiC2HVbb8ptS44MXqaUPcAeuYkMb",
    "Depth": 4,
    "ChildNum": "2147483649",
    "Bip32Path": "m/48'/0'/0'/1'",
    "ChainCode": "fab964adb21a846365bdede66aadcbd0919f0dbf30bb048df5722354535ede76",
    "PublicKey": "023ba227ba6255bb4c57382e72a19456701d0d563dc345be45528dd4cfa1cda4fc",
    "CaravanXfp": "9ea6b6de",
    "Fingerprint": "707130668"
}

export const ASYLIA_SIGN_DEVICECE_ID_LIST = [ASYLIA_SIGN_DEVICE_1.Id]

export const excludeAlysiaSignDevices = devices => devices.filter(device => !ASYLIA_SIGN_DEVICECE_ID_LIST.includes(device.Id))