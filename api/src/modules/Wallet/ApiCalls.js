import {BlockChainInfoApi} from "#app/plugins/BlockChainInfoApi.js"

const arrayToApiList = array => array.join('|')

export const receiveAddressBalance = async (addressList) => {

    const {data, error} = await BlockChainInfoApi.Get('balance', {active: arrayToApiList(addressList)})
    if (error) {
        return []
    }
    return data
}

export const getUTXOsForAddressList = async list => {

    const {data, error} = await BlockChainInfoApi.Get('unspent', {active: arrayToApiList(list)})
    if (error) {
        // todo handle error
        return []
    }
    return data.unspent_outputs

}

export const getMultiAddressInfo = async (list, n, offset) => {

    const {data, error} = await BlockChainInfoApi.Get('multiaddr', {
        active: arrayToApiList(list),
        n,
        offset
    })

    if (error) {
        // todo handle error
        console.error('error', error)
        return {}
    }

    return data

}
