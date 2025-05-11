import {driver} from "driver.js";
import {INVITE_USER_BUTTON_OPEN_MODAL} from "@/content/help/wallet/Parts";
import {useWalletUsersStore} from "@/stores/wallet/WalletUsers";

const starWalletBaseFunctionsHelpTour = () => {

    const walletUsersStore = useWalletUsersStore()

    const steps = [
        {
            element: '#wallet-details-info',
            popover: {
                title: 'Wallet Details',
                description: 'Here you can find your wallet name, wallet type and wallet multi-signature configuration.'
            }
        },
        {
            element: '#edit-wallet',
            popover: {
                title: 'Edit wallet',
                description: 'Here you can edit wallet name or delete wallet.'
            }
        },
        {
            element: '#wallet-balance-wrapper',
            popover: {
                title: 'Wallet balance',
                description: 'Here summary of your all wallet balances'
            }
        },
        {
            element: '#wallet-balance-total',
            popover: {
                title: 'Total',
                description: 'Final balance in your wallet'
            }
        },
        {
            element: '#wallet-balance-spendable',
            popover: {
                title: 'Spendable',
                description: 'This is your current balance that you can spend to create new transaction. It is calculated as confirmed balance - sum of balances in your created PSBTs'
            }
        },
        {
            element: '#wallet-balance-incoming',
            popover: {
                title: 'Incoming',
                description: 'This is your incoming balance that is not confirmed yet'
            }
        },
        {
            element: '#wallet-balance-confirmed',
            popover: {
                title: 'Confirmed',
                description: 'This is your confirmed balance that is confirmed and you can spend it'
            }
        },
        {
            element: '#wallet-balance-in-psbt',
            popover: {
                title: 'In PSBT',
                description: 'Sum of balances in your created PSBTs, but not boradcasted yet'
            }
        },
        {
            element: '#wallet-manage-founds',
            popover: {
                title: 'Manage founds',
                description: 'Trouble this buttons you can manage your founds in wallet. Receive, send, deposit, withdraw, etc.'
            }
        },
        {
            element: '#deposit-button',
            popover: {
                title: 'Deposit',
                description: 'Click here to view your deposit address or mode details about your wallet'
            }
        },
        {
            element: '#withdraw-button',
            popover: {
                title: 'Withdraw',
                description: 'Click here to open new window to create PSBT transaction.'
            }
        },
        // {
        //     element: '#buy-crypto-button',
        //     popover: {
        //         title: 'Buy bitcoin',
        //         description: 'Click here to buy bitcoin direct to your wallet with credit card'
        //     }
        // },
        {
            element: '#wallet-keys-list',
            popover: {
                title: 'Wallet keys',
                description: 'This is wallet keys list used to create your multi-signature wallet.'
            }
        },
        {
            element: '#export-wallet-config-button',
            popover: {
                title: 'Export your wallet (backup)',
                description: 'By pressing this button you will export wallet configuration .zip file. This backup may be used to restore your wallet in future or for other third party software.'
            }
        },
        {
            element: '#wallet-users-box',
            popover: {
                title: 'Wallet users',
                description: 'This is list of users that have access to your wallet.'
            }
        },
        INVITE_USER_BUTTON_OPEN_MODAL
    ]

    if (walletUsersStore.users.length > 1) {
        steps.push({
            element: '#edit-wallet-user-1',
            popover: {
                title: 'Edit wallet user',
                description: 'By pressing this button you will open window to manage user permissions or you can remove user from wallet.'
            }
        })
    }

    steps.push({
        element: '#wallet-transactions-wrapper',
        popover: {
            title: 'Wallet transactions',
            description: 'In this you will find all your current wallet transaction. PSBTs transactions waiting to be signed, broadcasted or rejected and also all blockchain transactions connected to your wallet.'
        }
    })

    steps.push({
        element: '#transactions-head-filter',
        popover: {
            title: 'Transaction type',
            description: 'Filter your transactions by type: PSBTs or Blockchain transactions.'
        }
    })

    steps.push({
        element: '#wallet-cart-box',
        popover: {
            title: 'Balance cart',
            description: 'This is cart of your wallet balance. You can see how your balance is changing in time.'
        }
    })

    steps.push({
        element: '#cart-time-filter',
        popover: {
            title: 'Time-frame filter',
            description: 'Filter your balance cart by time-frame.'
        }
    })

    steps.push({
        element: '#cart-currency',
        popover: {
            title: 'Currency filter',
            description: 'Switch balance values between BTC and Satoshis.'
        }
    })

    const driverObj = driver({
        showProgress: true,
        steps
    })

    driverObj.drive()

}

export default starWalletBaseFunctionsHelpTour