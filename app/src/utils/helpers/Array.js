export const removeOnIndex = (array, index) => {
    array.splice(index, 1)
    return array
}

export const arrIsEqual = (a1, a2) => {
    if (!a1 || !a2) return false
    return a1.sort().toString() === a2.sort().toString()
}

export const removeDuplicates = arr => [...new Set(arr)]