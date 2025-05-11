import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

// solid
import {faCircleCheck as fasCircleCheck} from '@fortawesome/pro-solid-svg-icons'
import {faCircleInfo as fasInfoCircle} from '@fortawesome/pro-solid-svg-icons'
import {faCopy as fasCopy} from "@fortawesome/pro-solid-svg-icons"
import {faPen as fasPen} from "@fortawesome/pro-solid-svg-icons"
import {faLock as fasLock} from "@fortawesome/pro-solid-svg-icons"
import {faSpinnerThird as FasSpinnerThird} from "@fortawesome/pro-solid-svg-icons"
import {
    faUpRight as fasUpRight,
    faDownRight as fasDownRight,
    faDownLeft as fasDownLeft,
    faCirclePlus as fasCirclePlus,
    faCheck as fasCheck,
    faQuestion as fasQuestion,
    faCircleInfo as fasCircleInfo,
    faTrash as fasTrash,
    faStar as fasStar,
    faEye as fasEye,
    faPencil as FasPencil,
    faTimes as fasTimes,
    faBars as FasBars,
    faCloudArrowUp as fasCloudArrowUp,
} from "@fortawesome/pro-solid-svg-icons";

// duotone
import {faSatelliteDish as fadSatelliteDish} from '@fortawesome/pro-duotone-svg-icons'
// light
import {faHome as falHome} from '@fortawesome/pro-light-svg-icons'
import {faKey as falKey} from '@fortawesome/pro-light-svg-icons'
import {faWallet as falWallet} from '@fortawesome/pro-light-svg-icons'
import {faBook as falBook} from '@fortawesome/pro-light-svg-icons'
import {faBell as falBell} from '@fortawesome/pro-light-svg-icons'
import {faStar as falStar} from '@fortawesome/pro-light-svg-icons'
import {faPlus as falPlus} from '@fortawesome/pro-light-svg-icons'
import {faArrowLeft as falArrowLeft} from "@fortawesome/pro-light-svg-icons"
import {faTrash as falTrash} from "@fortawesome/pro-light-svg-icons"
import {faXmark as falXmark} from "@fortawesome/pro-light-svg-icons";
import {faCreditCard as falCreditCard} from "@fortawesome/pro-light-svg-icons";
import {
    faGear as falGear,
    faUser as falUser,
    faRightFromBracket as falRightFromBracket,
    faAngleLeft as falAngleLeft,
    faAngleRight as falAngleRight,
    faAngleDown as falAngleDown,
    faAngleUp as falAngleUp,
    faDesktop as falDesktop,
    faMobile as falMobile,
    faSliders as falSliders,
    faEye as falEye,
    faWifiSlash as falWifiSlash,
    faTriangleExclamation as falTriangleExclamation,
    faFileExport as falFileExport,
    faCopy as falCopy,
    faCog as falCog,
    faCircleInfo as falCircleInfo,
    faComment as falComment,
} from "@fortawesome/pro-light-svg-icons";

import {} from '@fortawesome/free-brands-svg-icons'

// Install font awesome pack
export default app => {

    // light
    library.add(falComment)
    library.add(falCircleInfo)
    library.add(falCog)
    library.add(FasBars)
    library.add(falCopy)
    library.add(falFileExport)
    library.add(falTriangleExclamation)
    library.add(falWifiSlash)
    library.add(falEye)
    library.add(falSliders)
    library.add(falMobile)
    library.add(falDesktop)
    library.add(fasQuestion)
    library.add(falAngleRight)
    library.add(falRightFromBracket)
    library.add(falUser)
    library.add(falGear)
    library.add(falCreditCard)
    library.add(falXmark)
    library.add(falTrash)
    library.add(falStar)
    library.add(falKey)
    library.add(falHome)
    library.add(falWallet)
    library.add(falBook)
    library.add(falBell)
    library.add(falPlus)
    library.add(falArrowLeft)
    library.add(falAngleDown)
    library.add(falAngleUp)
    library.add(falAngleLeft)

    // solid
    library.add(fasCloudArrowUp)
    library.add(fasTimes)
    library.add(FasPencil)
    library.add(fasEye)
    library.add(fasStar)
    library.add(fasTrash)
    library.add(fasCirclePlus)
    library.add(fasDownLeft)
    library.add(fasDownRight)
    library.add(fasUpRight)
    library.add(fasCircleInfo)
    library.add(fasCheck)
    library.add(fasLock)
    library.add(FasSpinnerThird)
    library.add(fasPen)
    library.add(fasCopy)
    library.add(fasInfoCircle)
    library.add(fasCircleCheck)

    // duotone
    library.add(fadSatelliteDish)

    app.component('font-awesome-icon', FontAwesomeIcon)

}