import { arweaveAddress, calculateEverPayBalance, everPayBalance } from "../../atoms";
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import Everpay from "everpay";
import { PermaSpinner } from "../../component/reusables/PermaSpinner";
import { SPINNER_COLOR } from "../../constants";

interface everpayBalanceInterface {
    textClassname?: string;
}

export const EverPayBalance = (props: everpayBalanceInterface) => {
    const { textClassname } = props
    const [_everPayBalance, _setEverPayBalance] = useRecoilState(everPayBalance)
    const [_calculateEverPayBalance, _setCalculateEverPayBalance] = useRecoilState(calculateEverPayBalance)
    const [_arweaveAddress, _setArweaveAddress] = useRecoilState<String>(arweaveAddress);
    const [balanceError, setBalanceError] = useState<boolean>(false)
    const [balanceLoading, setBalanceLoading] = useState<boolean>(true)


    // When everpay recalculation requested, perform hook
    useEffect(() => {

        async function everBalance() {
            const everpay = new Everpay({
                //@ts-ignore string vs String
                account: _arweaveAddress,
                //@ts-ignore
                chainType: 'arweave',
                arJWK: 'use_wallet',
            });

            try {
                setBalanceLoading(true)
                setBalanceError(false)
                //@ts-ignore string vs String
                const balance = await everpay.balances({ account: _arweaveAddress });
                //@ts-ignore
                _setEverPayBalance(balance.find((el: any) => el.chainType === "arweave,ethereum")?.balance);
                setBalanceLoading(false)
            } catch (error) {
                setBalanceError(true)
                setBalanceLoading(false)
                console.log(error)
            }
        }
        if (_arweaveAddress.length > 0) {
            everBalance()
        }

    }, [_calculateEverPayBalance, _arweaveAddress])

    return (
        (balanceError ?
            <a href="https://app.everpay.io/" className="underline text-black font-semibold">balance</a>
            : balanceLoading ?
                <div className={`${textClassname} w-16 flex justify-center`}>
                    <PermaSpinner 
                        divClass='spinner w-4 h-4 mx-1 text-white'
                        spinnerColor={SPINNER_COLOR}
                        size={10}
                    />
                </div>
                : <a href="https://app.everpay.io/" target="_blank" rel="noreferrer" className={`${textClassname}`}>{Number(_everPayBalance).toFixed(2) + ' AR'}</a>
        )
    )
}