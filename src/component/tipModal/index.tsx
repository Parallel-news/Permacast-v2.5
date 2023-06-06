import { useTranslation } from "next-i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useArconnect } from "react-arconnect";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

import { everPayBalance } from "@/atoms/index";
import { ERROR_TOAST_TIME, FADE_IN_STYLE, FADE_OUT_STYLE, PERMA_TOAST_SETTINGS, SPINNER_COLOR } from "@/constants/index";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "@/constants/arconnect";
import { transferFunds } from "@/utils/everpay";
import { fetchARPriceInUSD } from "@/utils/redstone";

import { PermaSpinner } from "../reusables/PermaSpinner";
import { tipModalStyling } from "../uploadEpisode/uploadEpisodeTools";
import { ConnectButton } from "../uploadEpisode/reusables";
import { containerPodcastModalStyling, SubmitTipButton } from "../uploadEpisode/reusables";
import { Icon } from "../icon";

interface TipModalInter {
    to?: string;
    toAddress: string;
    isVisible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export const tipAmountDivStyling = "w-full flex flex-row justify-center items-center mx-auto space-x-2"
export const titleCornerStyling = "absolute top-0 left-0 bg-black h-[150px] w-[150px] flex justify-center items-center rounded-br-full z-30"
export const benefactorBannerStyling = "absolute top-0 bg-zinc-900 w-full h-[100px] z-30 flex flex-row items-center"
export const xMarkModalStyling = "h-7 w-7 mt-1 cursor-pointer focus:text-red-400 focus:bg-red-400/10 hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full z-30 absolute top-3 right-3"
export const tipInputStyling = "input input-secondary px-4 bg-zinc-700/80 border-0 rounded-lg outline-none focus:ring-2 focus:ring-inset focus:ring-white w-[200px] h-[100px] placeholder:text-5xl placeholder:font-bold text-5xl font-bold text-center" 
export const tipAmountAbsStyling = "absolute inset-0 top-0 flex justify-center items-center flex flex-col z-20"
export const benefactorNameStyling = "text-white text-3xl font-bold flex justify-center w-full text-center"
export const submitTipDivStyling = "w-full h-[100px] bg-zinc-900 flex justify-center items-center absolute bottom-0 cursor-pointer"
export const tipStyling = "text-white text-4xl transform -rotate-45 font-bold"

export const TipModal = (props: TipModalInter) => {

    const { t } = useTranslation();
    
    const [showModal, setShowModal] = useState<boolean>(false)
    const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const [arPrice, setArPrice] = useState(0);
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
    }, [props.isVisible]);

    useEffect(() => {fetchARPriceInUSD().then(setArPrice)}, []);

    // Calculate Tip USD
    useEffect(() => {
        const calculateTipUSD = async () => {
            setCalculatingTip(true);
            setTipUSD(0);
            setTipUSD(Number(tipAmount)*arPrice);
            setCalculatingTip(false);
        };
        if(tipAmount.trim().length > 0) calculateTipUSD()
    }, [tipAmount]);

    const submitTip = async () => {
        const numTipAmount = Number(tipAmount)
        // Check Balance
        if(numTipAmount >= _everPayBalance) {
            toast.error("Insufficient Balance", PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
            return false
        }
        setTipLoading(true)
        const tx = await transferFunds("TIP", numTipAmount, props.toAddress, address)
        setTipLoading(false)
        if(tx[0]) {
            toast.success(`${numTipAmount} AR Tip Sent!`, PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
            props.setVisible(false)
        } else {
            toast.error("Error sending tip.", PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
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
                <Icon className={xMarkModalStyling} onClick={() => props.setVisible(false)} icon="XMARK"/>   

                {/*Tip Amount*/}
                <div className={tipAmountAbsStyling}>
                    <a href="https://app.everpay.io/" target="_blank" rel="noreferrer">{t("tipModal.balance")+" "+Number(_everPayBalance).toFixed(2) + ' AR'}</a> 
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
