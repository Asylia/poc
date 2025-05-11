import {driver} from "driver.js";

const startHomeHelpTour = (walletListLength, hasSub) => {

    const steps = [
        {
            element: '#main-menu-link-wallets',
            popover: {
                title: 'Your wallets',
                description: 'On this page you will see all your bitcoin wallets'
            }
        },
        {
            element: '#main-menu-link-settings',
            popover: {
                title: 'Settings',
                description: 'Open user settings page'
            }
        },
    ]

    if (!hasSub) {
        steps.push({
            element: '#main-menu-link-go-premium',
            popover: {
                title: 'Premium',
                description: 'Upgrade to premium to access all features'
            }
        })
    }

    steps.push({
        element: '#main-menu-link-privacy-mode',
        popover: {
            title: 'Privacy mode',
            description: 'By clicking here you can hide all your balances cross the platform'
        }
    })

    steps.push({
        element: '#main-menu-link-release-bolg',
        popover: {
            title: 'Release blog',
            description: 'Read our latest platform updates'
        }
    })

    steps.push({
        element: '#main-menu-link-help',
        popover: {
            title: 'Help',
            description: 'On each view you can find help by pressing this button to get more information about the view and functions'
        }
    })

    steps.push({
        element: '#main-menu-link-log-out',
        popover: {
            title: 'Log out',
            description: 'By clicking you will log out from the platform'
        }
    })

    steps.push({
        element: '#main-menu-link-theme',
        popover: {
            title: 'Theme',
            description: 'Switch between light and dark theme'
        }
    })

    steps.push({
        element: '#down-links-wrapper',
        popover: {
            title: 'Other links',
            description: 'Other platform use-full links links'
        }
    })

    if (walletListLength === 0) {
        steps.push({
            element: '#create-new-wallet',
            popover: {
                title: 'Create new wallet',
                description: 'Click here to create a new wallet'
            }
        })
    }

    if (walletListLength > 1) {

        steps.push({
            element: '#wallets-list-gird',
            popover: {
                title: 'Wallets order',
                description: 'You can drag and drop your wallets to change the order, by holding mouse down on wallet title for 1 second'
            }
        })

    }

    steps.push({
        element: '.wallet-item',
        popover: {
            title: 'Open Your wallet',
            description: 'By clicking on the wallet you can see the details of the wallet'
        }
    })


    const driverObj = driver({
        showProgress: true,
        steps
    })

    driverObj.drive();

}

export default startHomeHelpTour