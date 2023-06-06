import Everpay, { ChainType } from "everpay";
import { EVERPAY_AR_TAG } from "../../constants";

export const transferFunds = async (type: string, amount: number, to: string, from: string) => {

    let data: any
    // Populate to add more utility
    if(type === "TIP") data = { action: "tip", amount: amount }
    if(type === "UPLOAD_EPISODE_FEE") data = { action: "Upload Episode Fee", amount: amount }
    if(type === "UPLOAD_CONTENT") data = { action: "Upload Content", amount: amount }

    const everpay = new Everpay({ account: from, chainType: ChainType.arweave, arJWK: 'use_wallet'})

    try {
        const tx = await everpay.transfer({
            tag: EVERPAY_AR_TAG,
            amount: String(amount.toFixed(12)),
            to: to, 
            data: data
        })
        return [true, tx]
    } catch(e) {
        console.log(e)
        return [false, ]
    }
} 
