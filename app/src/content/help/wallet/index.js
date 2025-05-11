import {useWalletStore} from "@/stores/wallet/Wallet";
import startNotSetUpHelpTour from "@/content/help/wallet/NotSetUp";
import starWalletBaseFunctionsHelpTour from "@/content/help/wallet/WalletBaseFunctions";

const startWalletHelpTour = () => {

    const walletStore = useWalletStore()
    const walletIsSetUp = walletStore.walletHasAllKeys

    if (!walletIsSetUp) return startNotSetUpHelpTour()

    starWalletBaseFunctionsHelpTour()

}

export default startWalletHelpTour