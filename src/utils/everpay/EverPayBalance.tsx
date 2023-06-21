import Everpay from "everpay";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react"
import { useArconnect } from "react-arconnect";
import { Tooltip } from "react-tooltip";
import { MoonLoader } from "react-spinners";
import { useRecoilState } from "recoil"

import { calculateEverPayBalance, everPayBalance } from "@/atoms/index";
import { LOADER_COLOR, LOADER_SIZE } from "@/constants/index";

interface everpayBalanceInterface {
    textClassname?: string;
}

export const EverPayBalance = (props: everpayBalanceInterface) => {
    const { t } = useTranslation();
    const { textClassname } = props
    const { walletConnected, address } = useArconnect();
    const [_everPayBalance, _setEverPayBalance] = useRecoilState(everPayBalance)
    const [_calculateEverPayBalance, _setCalculateEverPayBalance] = useRecoilState(calculateEverPayBalance)
    const [balanceError, setBalanceError] = useState<boolean>(false)
    const [balanceLoading, setBalanceLoading] = useState<boolean>(true)
  
    // When everpay recalculation requested, perform hook
    useEffect(() => {

        async function everBalance() {
            const everpay = new Everpay({
                account: address,
                //@ts-ignore
                chainType: 'arweave',
                arJWK: 'use_wallet',
            });

            try {
                setBalanceLoading(true)
                setBalanceError(false)
                //@ts-ignore string vs String
                const balance = await everpay.balances({ account: address });
                //@ts-ignore
                _setEverPayBalance(balance.find((el: any) => el.chainType === "arweave,ethereum")?.balance);
                setBalanceLoading(false)
            } catch (error) {
                setBalanceError(true)
                setBalanceLoading(false)
                console.log(error)
            }
        }
        if (walletConnected) everBalance();

    }, [_calculateEverPayBalance, address]);

    return (
        <>
            {walletConnected && (
                (balanceError ?
                    <div 
                        className="helper-tooltip px-1.5 ml-2" 
                        data-tooltip-id="verifiedTip"
                        data-tooltip-content={t("arconnect.load-failed")}>

                    ? </div>
                    : balanceLoading ?
                        <div className={`${textClassname} flex justify-center items-center z-50 bg-zinc-900`}>
                            <MoonLoader 
                                size={LOADER_SIZE}
                                color={LOADER_COLOR}
                            />
                        </div>
                        : <div className={`${textClassname}`}>{Number(_everPayBalance).toFixed(2) + ' AR'}</div>
                    
                )
            )}
        </>
    )
}