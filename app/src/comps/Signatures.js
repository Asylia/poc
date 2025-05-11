import bip66 from "bip66";
import ECPairFactory from "ecpair"
import * as ecc from "tiny-secp256k1"

const ECPair = ECPairFactory(ecc)

function multisigSignatureBuffer(signature) {
    const encodedSignerInputSignatureBuffer = Buffer.from(signature, "hex");
    const decodedSignerInputSignatureBuffer = bip66.decode(encodedSignerInputSignatureBuffer);
    const {r, s} = decodedSignerInputSignatureBuffer;
    // The value returned from the decodedSignerInputSignatureBuffer has
    // a few edge cases that need to be handled properly. There exists a mismatch between the
    // DER serialization and the ECDSA requirements, namely:
    //   DER says that its highest bit states polarity (positive/negative)
    //   ECDSA says no negatives, only positives.
    // So in the case where DER would result in a negative, a one-byte 0x00 is added to the value
    // NOTE: this can happen on r and on S.

    // See https://transactionfee.info/charts/bitcoin-script-ecdsa-length/ for more information

    // Truncate the leading 0x00 if r or S is 33 bytes long
    let rToUse = r.byteLength > 32 ? r.slice(1) : r;
    // Technically, this could be done but extremely unlikely in the current era.
    // let sToUse = s.byteLength > 32 ? s.slice(1) : s;

    const signatureBuffer = Buffer.alloc(64);
    // r/s bytelength could be < 32, in which case, zero padding needed
    signatureBuffer.set(Buffer.from(rToUse), 32 - rToUse.byteLength);
    signatureBuffer.set(Buffer.from(s), 64 - s.byteLength);
    return signatureBuffer;
}

function signatureNoSighashType(signature) {
    const len = parseInt(signature.slice(2, 4), 16);
    if (len === (signature.length - 4) / 2) return signature;
    else return signature.slice(0, -2);
}

export function findPublicKeyForSignature(signature, hash, publicKeys) {

    for (const pubKey of publicKeys) {
        const ecPair = ECPair.fromPublicKey(pubKey);
        const signatureBuffer = multisigSignatureBuffer(signatureNoSighashType(signature));
        if (ecPair.verify(hash, signatureBuffer)) return pubKey
    }

    return -1
}
