import deepClone from "deep-clone";
import * as bitcoin from "bitcoinjs-lib";

export const dustLimit = 600;

export function selectUTXOsForPayment(utxos, amount, feeRate, receiverAddress) {

    if (amount === '') {
        return {
            error: 'Amount is required'
        }
    }

    amount = Number(amount)
    feeRate = Number(feeRate)

    const roundFeeAndChange = (fee, change) => ({
        fee: fee % 1 === 0 ? fee : Math.ceil(fee),
        change: change % 1 === 0 ? change : Math.floor(change),
    })

    const getCombination = i => {
        // Vypočítame prvý prvok kombinácie. Pre každý index 'i', prvý prvok
        // rastie po každej dvojici, čo dosiahneme pomocou celočíselného delenia i/2.
        const firstElement = Math.floor(i / 2) + 1;
        // Druhý prvok alternuje medzi 1 a 2, čo dosiahneme pomocou (i % 2) + 1.
        const secondElement = (i % 2) + 1;
        return [firstElement, secondElement];
    }


    const iterationsCount = (utxos.length * 2) + 2
    for (let i = 0; i <= iterationsCount; i++) {

        const combination = getCombination(i)

        const optimalInputCount = combination[0]
        const optimalOutputCount = combination[1]
        const transactionSize = estimateP2SHP2WSHTransactionSize(optimalInputCount, optimalOutputCount, receiverAddress)

        const fee = Math.ceil(transactionSize * feeRate);
        const pricePlusFee = amount + fee

        const utxoCombinations = findUTXOMinimumCombinations(deepClone(utxos), pricePlusFee)
        const filteredUtxoCombinations = utxoCombinations.filter(combination => combination.length === optimalInputCount)

        filteredUtxoCombinations.sort((a, b) => {
            const totalValueA = a.reduce((acc, utxo) => acc + utxo.value, 0)
            const changeA = totalValueA - pricePlusFee

            const totalValueB = b.reduce((acc, utxo) => acc + utxo.value, 0)
            const changeB = totalValueB - pricePlusFee

            // return changeA - changeB
            return changeB - changeA
        })

        if (filteredUtxoCombinations.length === 0) {
            continue
        }

        const returnResultAndCheckkDust = ({totalValue, fee, change, conbination, twoOuts}) => {

            const hasDust = change < dustLimit

            if (hasDust && twoOuts) {
                const transactionSizeOneOutput = estimateP2SHP2WSHTransactionSize(optimalInputCount, 1, receiverAddress)
                const feeOneOutput = Math.ceil(transactionSizeOneOutput * feeRate);
                const pricePlusFeeOneOutput = amount + fee
                const dustOneOutput = totalValue - pricePlusFeeOneOutput
                const finalFee = feeOneOutput + dustOneOutput

                return {
                    amount,
                    totalValue,
                    fee: feeOneOutput,
                    finalFee: feeOneOutput + dustOneOutput,
                    change: 0,
                    dustSize: 0,
                    dust: true,
                    estimatedSize: transactionSizeOneOutput,
                    selectedUTXOs: conbination,
                    insCOunt: optimalInputCount,
                    outsCount: 1,
                    feeRate: feeRate,
                    feeRateWithDust: Number(finalFee / transactionSizeOneOutput).toFixed(2),
                    t: true
                }

            } else {

                const dustSize = hasDust ? change : 0
                const finalChange = hasDust ? 0 : change
                const finalFee = fee + dustSize

                return {
                    amount,
                    totalValue,
                    fee: fee,
                    finalFee: finalFee,
                    change: finalChange,
                    dustSize: dustSize,
                    dust: hasDust,
                    estimatedSize: transactionSize,
                    selectedUTXOs: conbination,
                    insCOunt: optimalInputCount,
                    outsCount: optimalOutputCount,
                    feeRate: feeRate,
                    feeRateWithDust: Number(finalFee / transactionSize).toFixed(2),
                    t: false
                }

            }


        }
        // try to find combination with change less than dust limit
        if (optimalOutputCount === 1) {
            // foundWithOneOutputButChangeIsBiggerThanDust = true

            for (const conbination of filteredUtxoCombinations) {

                const totalValue = conbination.reduce((acc, utxo) => acc + utxo.value, 0)
                const change = totalValue - pricePlusFee

                const {fee: roundFee, change: roundChnage} = roundFeeAndChange(fee, change)

                if (change === 0 || change < dustLimit) {

                    return returnResultAndCheckkDust({
                        totalValue,
                        fee: roundFee,
                        change: roundChnage,
                        conbination,
                        twoOuts: false
                    })

                }

            }

        } else {

            if (filteredUtxoCombinations.length === 1) {


                const totalValue = filteredUtxoCombinations[0].reduce((acc, utxo) => acc + utxo.value, 0)
                const change = totalValue - pricePlusFee
                const dust = change === 0 || change < dustLimit

                if (dust) {

                    return returnResultAndCheckkDust({
                        totalValue,
                        ...roundFeeAndChange(fee, change),
                        conbination: filteredUtxoCombinations[0],
                        twoOuts: false
                    })

                } else {

                    return returnResultAndCheckkDust({
                        totalValue,
                        ...roundFeeAndChange(fee, change),
                        conbination: filteredUtxoCombinations[0],
                        twoOuts: true
                    })

                }

            } else {

                const totalValue = filteredUtxoCombinations[0].reduce((acc, utxo) => acc + utxo.value, 0)
                const change = totalValue - pricePlusFee

                return returnResultAndCheckkDust({
                    totalValue,
                    ...roundFeeAndChange(fee, change),
                    conbination: filteredUtxoCombinations[0],
                    twoOuts: true
                })

            }

        }

    }

    return {
        error: 'No UTXO found'
    }

}

function findUTXOMinimumCombinations(utxos, target) {
    const results = [];

    function findCombinations(index, currentSum, path) {
        // Ak je súčasná suma aspoň rovná cieľovej, pridáme cestu (kopiu) do výsledkov a nepridávame ďalšie UTXO
        if (currentSum >= target) {
            results.push([...path]);
            return;
        }

        // Ak sme na konci zoznamu UTXO, vrátime sa späť
        if (index === utxos.length) return;

        // Skúšame pridať aktuálne UTXO, len ak sme ešte nedosiahli alebo prekročili cieľovú sumu
        if (currentSum < target) {
            path.push(utxos[index]);
            findCombinations(index + 1, currentSum + utxos[index].value, path);

            // Odstránime aktuálne UTXO z cesty (backtrack) a pokračujeme ďalej bez neho
            path.pop();
        }

        findCombinations(index + 1, currentSum, path);
    }

    findCombinations(0, 0, []);
    return results;
}

export function estimateMaxSpendable(utxos, feeRate, receiverAddress) {

    if (!utxos) utxos = []
    if (!feeRate) feeRate = 2

    const totalUTXOValue = utxos.reduce((sum, utxo) => sum + utxo.value, 0);
    const estimatedTxSize = estimateP2SHP2WSHTransactionSize(utxos.length, 1, receiverAddress);
    const amount = totalUTXOValue - (estimatedTxSize * feeRate)

    if (amount > 0) {
        return {
            amount: Math.ceil(amount),
        }
    } else {
        return {
            amount: 0,
            error: 'Not enough funds'
        }
    }

}

export const estimateP2SHP2WSHTransactionSize = (inputsCount = 1, outputsCount = 1, receiverAddress = '') => {

    const transaction = new bitcoin.Transaction()
    transaction.version = 2
    transaction.locktime = 0

    for (let i = 0; i < inputsCount; i++) {
        const hash = Buffer.from('0'.repeat(64), 'hex')
        const sequence = 0xffffffff
        const scriptSig = Buffer.from('0'.repeat(70), 'hex')
        transaction.addInput(hash, i, sequence, scriptSig)

        const witness = [
            Buffer.alloc(0),
            Buffer.from('0'.repeat(144), 'hex'),
            Buffer.from('0'.repeat(144), 'hex'),
            Buffer.from('0'.repeat(210), 'hex')
        ];
        transaction.setWitness(i, witness);
    }


    function detectAddressType(address) {
        if (/^1[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) {
            return 'P2PKH';
        } else if (/^3[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) {
            return 'P2SH';
        } else if (/^bc1[q0-9ac-hj-np-z]{39,58}$/.test(address)) {
            return 'Bech32-P2WPKH-P2WSH';
        } else if (/^bc1p[q0-9ac-hj-np-z]{38,58}$/.test(address)) {
            return 'Bech32m-P2TR';
        } else {
            return 'Unknown';
        }
    }

    const addressSizesInCharactersCount = {
        P2PKH: 34,
        P2SH: 34,
        'Bech32-P2WPKH-P2WSH': 51,
        'Bech32m-P2TR': 62,
        Unknown: 34
    }

    const addressType = detectAddressType(receiverAddress)
    const addressSize = addressSizesInCharactersCount[addressType]

    // reciver address
    const scriptPubKey = Buffer.from('0'.repeat(addressSize), 'hex')
    transaction.addOutput(scriptPubKey, 1000)

    // change address
    if (outputsCount === 2) {
        const scriptPubKey = Buffer.from('0'.repeat(64), 'hex')
        transaction.addOutput(scriptPubKey, 1000)
    }


    return transaction.virtualSize()

}

