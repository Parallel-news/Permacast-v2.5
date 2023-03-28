import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useArconnect } from "react-arconnect";
import { useRecoilState } from "recoil";
import { arweaveAddress } from "../../atoms";
import { FADE_IN_STYLE, FADE_OUT_STYLE } from "../../constants";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { containerPodcastModalStyling, SubmitTipButton, tipModalStyling, titleModalStyling} from "../uploadEpisode/uploadEpisodeTools";

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
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowModal(prev => !prev);
        }, 100);
     
        return () => {
            clearTimeout(timeoutId);
        };
    }, [props.isVisible])

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
                <div className="absolute inset-0 top-0 flex justify-center items-center">
                    <input className={tipInputStyling} required pattern=".{3,500}" type="number" name="tipAmount" placeholder={"AR"}
                    onChange={(e) => {
                        setTipAmount(e.target.value);
                    }}/>
                </div>
                {/*Submit Tip*/}
                <div className="w-full h-[100px] bg-zinc-900 flex justify-center items-center absolute bottom-0">
                    <SubmitTipButton 
                        disable={false}
                    />
                </div>
            </div>
        </div>
    )
}
