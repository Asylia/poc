const GLOBAL_STORE_PREFIX = 'AppGlobalStore_';

class GlobalStore {
    constructor() {
        // this.store = {};
    }

    set(key, value) {
        this[key] = value;
    }

    get(key) {
        return this[key];
    }

    remove(key) {
        delete this[key];
    }

    has(key) {
        return (key in this)
    }

}

const getGlobalStoreKey = id => `${GLOBAL_STORE_PREFIX}${id}`;

const createGlobalStore = id => {
    if (existGlobalStore(id)) return getGlobalStore(id)
    const key = getGlobalStoreKey(id)
    global[key] = new GlobalStore()
    return global[key]
}

const existGlobalStore = id => {
    return !!global[getGlobalStoreKey(id)]
}

const removeGlobalStore = id => {
    // if (!existGlobalStore(getGlobalStoreKey(id))) throw new Error('Global store not found')
    delete global[getGlobalStoreKey(id)]
}

const getGlobalStore = id => {
    // if (!existGlobalStore(getGlobalStoreKey(id))) throw new Error('Global store not found')
    return global[getGlobalStoreKey(id)]
}

export {
    createGlobalStore,
    existGlobalStore,
    removeGlobalStore,
    getGlobalStore
}
