import {driver} from "driver.js";

const startSettingsHelpTour = () => {

    const steps = [
        {
            element: '#general-tab',
            popover: {
                title: 'General',
                description: 'Manage your personal email, currency and language settings'
            }
        },
        {
            element: '#personal-tab',
            popover: {
                title: 'Personal',
                description: 'Manage your name'
            }
        },
        {
            element: '#security-tab',
            popover: {
                title: 'Security',
                description: 'View your login history to platform'
            }
        },
        {
            element: '#subscription-tab',
            popover: {
                title: 'Subscription',
                description: 'Manage your subscription'
            }
        },
    ]

    const driverObj = driver({
        showProgress: true,
        steps
    })

    driverObj.drive();

}

export default startSettingsHelpTour