import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useArconnect } from "react-arconnect";
import { useRecoilState } from "recoil";
import { arweaveAddress, everPayBalance } from "../../atoms";
import { FADE_IN_STYLE, FADE_OUT_STYLE, SPINNER_COLOR } from "../../constants";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { fetchARPriceInUSD } from "../../utils/redstone";
import { PermaSpinner } from "../reusables/PermaSpinner";
import { ConnectButton, containerPodcastModalStyling, SubmitTipButton, tipModalStyling, titleModalStyling} from "../uploadEpisode/uploadEpisodeTools";
import { spinnerClass } from "../uploadShow/uploadShowTools";

interface TipModalInter {
    to?: string;
    isVisible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export const tipAmountDivStyling = "w-full flex flex-row justify-center items-center mx-auto space-x-2"
export const titleCornerStyling = "absolute top-0 left-0 bg-black h-[150px] w-[150px] flex justify-center items-center rounded-br-full z-20"
export const benefactorBannerStyling = "absolute top-0 bg-zinc-900 w-full h-[100px] z-10 flex flex-row items-center"
export const xMarkModalStyling = "h-7 w-7 mt-1 cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full z-30 absolute top-2 right-2"
export const tipInputStyling = "input input-secondary px-4 bg-zinc-700/80 border-0 rounded-lg outline-none focus:ring-2 focus:ring-inset focus:ring-white w-[200px] h-[100px] placeholder:text-5xl placeholder:font-bold text-5xl font-bold text-center" 

export const TipModal = (props: TipModalInter) => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [_arweaveAddress, _setArweaveAddress] = useRecoilState(arweaveAddress)
    const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const [tipAmount, setTipAmount] = useState<string>("0")
    const [tipUSD, setTipUSD] = useState<Number>(0)
    const [calculatingTip, setCalculatingTip] = useState<boolean>(false)
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [_everPayBalance, _setEverPayBalance] = useRecoilState(everPayBalance)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowModal(prev => !prev);
        }, 100);
     
        return () => {
            clearTimeout(timeoutId);
        };
    }, [props.isVisible])

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
    const submitTip = () => {
        // check if enough money in balance
        
        return false
    }

    return (
        <div className={tipModalStyling+" backdrop-blur-sm"}>
            <div className={`${containerPodcastModalStyling+ " justify-between relative overflow-hidden"} ${showModal ? FADE_IN_STYLE :FADE_OUT_STYLE}`}>
                <div className={titleCornerStyling}>
                    <p className="text-white text-4xl transform -rotate-45 font-bold">Tip</p>
                </div>
                <div className={benefactorBannerStyling}>
                    <p className="text-white text-3xl font-light w-[85%] ml-[10%] text-center">Public Enemy Number 1</p> 
                </div>
                {/*Header*/}
                <XMarkIcon className={xMarkModalStyling} onClick={() => props.setVisible(false)} />   

                {/*Tip Amount*/}
                <div className="absolute inset-0 top-0 flex justify-center items-center flex flex-col">
                    <Link href="https://app.everpay.io/" target="_blank" rel="noreferrer">{"Balance: "+Number(_everPayBalance).toFixed(2) + ' AR'}</Link> 
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
                <div className="w-full h-[100px] bg-zinc-900 flex justify-center items-center absolute bottom-0">
                    {address && address.length > 0 ?
                    <>
                        <SubmitTipButton 
                            disable={false} 
                        />
                    </>
                        
                    : 
                    <ConnectButton 
                        disable={false}
                        click={() => connect()}
                    />
                    }

                </div>
            </div>
        </div>
    )
}
