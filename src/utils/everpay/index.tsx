import Everpay, { BalanceItem, ChainType } from 'everpay';
import { useMutation, useQuery } from '@tanstack/react-query';

import { AR_BALANCE_KEY } from '@/constants/query-keys';
import { EPISODE_SLIPPAGE, EVERPAY_AR_TAG, EVERPAY_EOA_UPLOADS } from '@/constants/index';

import { queryClient } from '@/lib/react-query';
import { calculateSizeCost } from '../arseeding';

// rewrite to handle errors better 
export const transferFunds = async (type: string, amount: number, to: string, from: string) => {

    let data: any
    // Populate to add more utility
    if (type === "TIP") data = { action: "tip", amount: amount }
    if (type === "UPLOAD_EPISODE_FEE") data = { action: "Upload Episode Fee", amount: amount }
    if (type === "UPLOAD_CONTENT") data = { action: "Upload Content", amount: amount }

    const everpay = new Everpay({ account: from, chainType: ChainType.arweave, arJWK: 'use_wallet' })

    try {
        const tx = await everpay.transfer({
            tag: EVERPAY_AR_TAG,
            amount: String(amount.toFixed(12)),
            to: to,
            data: data
        })
        return [true, tx]
    } catch (e) {
        console.log(e)
        return [false, {}]
    }
}

// Sends money to everpay wallet on Nextjs side for storage
export const payStorageFee = async (gigabyteCost: number, size: number, fromAddress: string) => {
    try {
        const contentCost = calculateSizeCost(gigabyteCost, size);
        // to avoid rounding errors and a slippage change
        const finalCost = contentCost + EPISODE_SLIPPAGE;
        const uploadPaymentTX = await transferFunds("UPLOAD_CONTENT", finalCost, EVERPAY_EOA_UPLOADS, fromAddress);
        refetchEverpayARBalance();
        return uploadPaymentTX;
    } catch (e) {
        console.log('Failed to pay: ', e);
        return '';
    };
};


export const fetchUserEverpayARBalance = async (address: string) => {

    const everpay = new Everpay({
        account: address,
        chainType: ChainType.arweave,
        arJWK: 'use_wallet',
    });

    const balances = await everpay.balances({ account: address });
    const arBalance = balances.find(
        (el: BalanceItem) => el.chainType === "arweave,ethereum"
    ).balance;
    return arBalance;
};

export const getEverpayARBalance = (address: string) => {
    return useQuery({
        queryKey: [AR_BALANCE_KEY, address],
        queryFn: () => fetchUserEverpayARBalance(address),
    })
};

export const refetchEverpayARBalance = () => (
    queryClient.refetchQueries([AR_BALANCE_KEY])
);
