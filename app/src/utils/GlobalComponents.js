import OnlyAdmin from "@/components/global/admin/OnlyAdmin.vue"
import PrelineWrapper from "@/components/global/PrelineWrapper.vue"
import BtcSatsValue from "@/components/global/BtcSatsValue.vue"

export default app => {
    app.component('OnlyAdmin', OnlyAdmin)
    app.component('Preline', PrelineWrapper)
    app.component('BtcSatsValue', BtcSatsValue)
}