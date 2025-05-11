// check if a string is a valid JSON string
export const isJsonString = str => {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

export const isObject = value => typeof value === 'object' && value !== null