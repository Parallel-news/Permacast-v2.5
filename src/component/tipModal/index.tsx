import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useArconnect } from "react-arconnect";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { arweaveAddress, everPayBalance } from "../../atoms";
import { FADE_IN_STYLE, FADE_OUT_STYLE, SPINNER_COLOR } from "../../constants";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { transferFunds } from "../../utils/everpay";
import { fetchARPriceInUSD } from "../../utils/redstone";
import { PermaSpinner } from "../reusables/PermaSpinner";
import { ConnectButton, containerPodcastModalStyling, SubmitTipButton, tipModalStyling } from "../uploadEpisode/uploadEpisodeTools";

interface TipModalInter {
    to?: string;
    toAddress: string;
    isVisible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export const tipAmountDivStyling = "w-full flex flex-row justify-center items-center mx-auto space-x-2"
export const titleCornerStyling = "absolute top-0 left-0 bg-black h-[150px] w-[150px] flex justify-center items-center rounded-br-full z-30"
export const benefactorBannerStyling = "absolute top-0 bg-zinc-900 w-full h-[100px] z-30 flex flex-row items-center"
export const xMarkModalStyling = "h-7 w-7 mt-1 cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full z-30 absolute top-3 right-3"
export const tipInputStyling = "input input-secondary px-4 bg-zinc-700/80 border-0 rounded-lg outline-none focus:ring-2 focus:ring-inset focus:ring-white w-[200px] h-[100px] placeholder:text-5xl placeholder:font-bold text-5xl font-bold text-center" 
export const tipAmountAbsStyling = "absolute inset-0 top-0 flex justify-center items-center flex flex-col z-20"
export const benefactorNameStyling = "text-white text-3xl font-bold flex justify-center w-full text-center"
export const submitTipDivStyling = "w-full h-[100px] bg-zinc-900 flex justify-center items-center absolute bottom-0 cursor-pointer"
export const tipStyling = "text-white text-4xl transform -rotate-45 font-bold"

export const TipModal = (props: TipModalInter) => {

    const { t } = useTranslation();
    
    const [showModal, setShowModal] = useState<boolean>(false)
    const [_arweaveAddress, _setArweaveAddress] = useRecoilState(arweaveAddress)
    const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const [tipAmount, setTipAmount] = useState<string>("0")
    const [tipUSD, setTipUSD] = useState<Number>(0)
    const [calculatingTip, setCalculatingTip] = useState<boolean>(false)
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [_everPayBalance, _setEverPayBalance] = useRecoilState(everPayBalance)
    const [tipLoading, setTipLoading] = useState<boolean>(false)

    // Show Modal Effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowModal(prev => !prev);
        }, 100);
     
        return () => {
            clearTimeout(timeoutId);
        };
    }, [props.isVisible])

    // Calculate Tip USD
    useEffect(() => {
        const calculateTipUSD = async () => {
            setCalculatingTip(true)
            setTipUSD(0)
            const arPrice = await fetchARPriceInUSD()
            setTipUSD(Number(tipAmount)*arPrice)
            setCalculatingTip(false)
        }
        if(tipAmount.trim().length > 0) calculateTipUSD()
    }, [tipAmount])

    const submitTip = async () => {
        const numTipAmount = Number(tipAmount)
        // Check Balance
        if(numTipAmount >= _everPayBalance) {
            toast.error("Insufficient Balance")
            return false
        }
        setTipLoading(true)
        const tx = await transferFunds("TIP", numTipAmount, props.toAddress, address)
        setTipLoading(false)
        if(tx[0]) {
            toast.success(`${numTipAmount} AR Tip Sent!`)
            props.setVisible(false)
        } else {
            toast.error("Error sending tip.")
        }
        console.log(tx)
    }

    return (
        <div className={tipModalStyling+" backdrop-blur-sm"}>
            <div className={`${containerPodcastModalStyling+ " justify-between relative overflow-hidden"} ${showModal ? FADE_IN_STYLE :FADE_OUT_STYLE}`}>

                <div className={benefactorBannerStyling}>
                    <p className={benefactorNameStyling}>{props.to}</p> 
                </div>
                {/*Header*/}
                <XMarkIcon className={xMarkModalStyling} onClick={() => props.setVisible(false)} />   

                {/*Tip Amount*/}
                <div className={tipAmountAbsStyling}>
                    <Link href="https://app.everpay.io/" target="_blank" rel="noreferrer">{t("tipModal.balance")+" "+Number(_everPayBalance).toFixed(2) + ' AR'}</Link> 
                    <input className={tipInputStyling+" mb-2 mt-2"} required pattern=".{3,500}" type="number" name="tipAmount" placeholder={"AR"}
                    onChange={(e) => {
                        setTipAmount(e.target.value);
                    }}/>  
                    {calculatingTip ? 
                    <PermaSpinner 
                        spinnerColor={SPINNER_COLOR}
                        size={8}
                        divClass={"w-full flex justify-center pt-3"}     
                    />
                    : 
                    <p className={`${tipAmount.trim().length > 0 ? "visible" : "invisible"}`}>{tipAmount+" AR = "+"$"+String(tipUSD.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</p>
                    }
                </div>
                {/*Submit Tip*/}
                <div className={submitTipDivStyling}>
                    {address && address.length > 0 && !tipLoading && ( 
                        <SubmitTipButton 
                            disable={false} 
                            click={submitTip}
                            
                        />
                    )}
                    {address && address.length > 0 && tipLoading && (
                        <PermaSpinner 
                            spinnerColor={SPINNER_COLOR}
                            size={10}
                            divClass={"w-full flex justify-center"}     
                        /> 
                    )}
                    {(!address || address.length === 0) && (
                        <ConnectButton 
                            disable={false}
                            click={() => connect()}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}


/*<div className={titleCornerStyling}>
    <p className={tipStyling}>Tip</p>
    </div>
*/