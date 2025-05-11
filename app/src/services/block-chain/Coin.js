import BigNumber from "bignumber.js"

export const getCurrencyConversion = async (crypto = 'bitcoin', fiat = 'czk') => {

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`)
        const parsedResponse = await response.json()
        return {
            data: parsedResponse,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error
        }
    }


}

export function satoshiToBTC(satoshi) {
    const satoshiPerBTC = new BigNumber(100000000);
    return new BigNumber(satoshi).dividedBy(satoshiPerBTC).toString();
}

export function calculateWalletBalance(data) {
    const {chain_stats, mempool_stats} = data;

    // Sčítanie hodnôt pridaných do peňaženky (chain + mempool)
    const totalFunded = chain_stats.funded_txo_sum + mempool_stats.funded_txo_sum;

    // Sčítanie hodnôt odoslaných z peňaženky (chain + mempool)
    const totalSpent = chain_stats.spent_txo_sum + mempool_stats.spent_txo_sum;

    // Výpočet finálneho zostatku
    const finalBalance = totalFunded - totalSpent;

    return finalBalance;
}

export function calculateAvaliableWalletBalance(data) {
    const {chain_stats, mempool_stats} = data;

    // Sčítanie hodnôt pridaných do peňaženky (chain + mempool)
    return chain_stats.funded_txo_sum - chain_stats.spent_txo_sum


}