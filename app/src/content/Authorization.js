export const WALLET_USER_RIGHTS = [
    {
        title: 'Can export wallet',
        key: 'CAN_EXPORT_WALLET'
    },
    {
        title: 'Can edit / delete wallet',
        key: 'CAN_EDIT_WALLET'
    },
    {
        title: 'Can invite users',
        key: 'CAN_INVITE_USERS'
    },
    {
        title: 'Can create transactions',
        key: 'CAN_CREATE_TRANSACTIONS'
    },
    {
        title: 'Can sign transactions',
        key: 'CAN_SIGN_TRANSACTIONS'
    },
    {
        title: 'Can delete transactions',
        key: 'CAN_DELETE_TRANSACTIONS'
    },
    {
        title: 'Can manage users permissions',
        key: 'CAN_MANAGE_USERS_PERMISSIONS'
    }
]

export const WALLET_USER_RIGHTS_FLAT = WALLET_USER_RIGHTS.map(right => right.key)
