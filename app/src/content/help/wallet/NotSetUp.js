import {driver} from "driver.js";
import {INVITE_USER_BUTTON_OPEN_MODAL} from "@/content/help/wallet/Parts";

const startNotSetUpHelpTour = () => {

    const steps = [
        {
            element: '#wallet-not-set-up',
            popover: {
                title: 'Your wallet is not set up',
                description: 'While you see this message, it means that you have not set up your wallet yet. There are is missing singing keys.'
            }
        },
        {
            element: '#add-key-button-open-modal',
            popover: {
                title: 'Press button',
                description: 'Open window to connect your hardware wallets and add missing keys.'
            }
        },
        INVITE_USER_BUTTON_OPEN_MODAL
    ]

    const driverObj = driver({
        showProgress: true,
        steps
    })

    driverObj.drive();


}

export default startNotSetUpHelpTour