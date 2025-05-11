export const TRANSACTION_STATUS = {
    CREATED: 'CREATED',
    PARTLY_SIGNED: 'PARTLY_SIGNED',
    SIGNED: 'SIGNED',
    BROADCASTED: 'BROADCASTED',
    CONFIRMED: 'CONFIRMED',
    FAILED: 'FAILED',
    CANCELED: 'CANCELED'
}

export const getCurrentFeePerByte = async () => {
    try {
        // Získanie odporúčaného poplatku za transakciu (v satoshi za bajt)
        const response = await fetch('https://mempool.space/api/v1/fees/recommended');
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const fees = await response.json();

        return {
            data: fees,
            error: null
        }

    } catch (error) {
        return {
            data: null,
            error: error
        }
    }
}
