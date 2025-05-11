import {reactive} from "vue"

const createState = (stateValues = {}, DefaultState = {}) => {

    const DEFAULT_STATE = {}

    const hasDefaultState = Object.keys(DefaultState).length > 0
    Object.keys(DefaultState).forEach(key => DEFAULT_STATE[key] = DefaultState[key])

    if (!hasDefaultState) Object.keys(stateValues).forEach(key => DEFAULT_STATE[key] = stateValues[key])
    Object.freeze(DEFAULT_STATE)

    const state = reactive(stateValues)

    const clearState = () => {
        Object.assign(state, DEFAULT_STATE)
    }

    return {
        state,
        clearState
    }

}

export default createState