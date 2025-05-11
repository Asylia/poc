const getItem = (key) => localStorage.getItem(key)
const setItem = (key, item) => localStorage.setItem(key, item)
const hasItem = (key) => !!getItem(key)
const removeItem = (key) => localStorage.removeItem(key)

const storage = {
    getItem,
    setItem,
    hasItem,
    removeItem
}

export default storage