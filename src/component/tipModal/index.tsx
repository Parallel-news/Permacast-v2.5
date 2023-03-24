import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useArconnect } from "react-arconnect";
import { useRecoilState } from "recoil";
import { arweaveAddress } from "../../atoms";
import { FADE_IN_STYLE, FADE_OUT_STYLE } from "../../constants";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { containerPodcastModalStyling, selectPodcastModalStyling, SubmitTipButton, titleModalStyling } from "../uploadEpisode/uploadEpisodeTools";

interface TipModalInter {
    isVisible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

export const tipAmountDivStyling = "w-full flex flex-row justify-center items-center mx-auto space-x-2"
export const xMarkModalStyling = "h-7 w-7 mt-1 cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full"
export const tipInputStyling = "input input-secondary px-4 bg-zinc-700 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white w-[175px] h-20 text-3xl"

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
        <div className={selectPodcastModalStyling}>
            <div className={`${containerPodcastModalStyling+ " justify-between p-10"} ${showModal ? FADE_IN_STYLE :FADE_OUT_STYLE}`}>
                {/*Header*/}
                <div className={titleModalStyling}>
                    <div></div>
                    <p className="text-white text-4xl font-semibold">Tip</p>
                    <XMarkIcon className={xMarkModalStyling} onClick={() => props.setVisible(false)} />
                </div>
                {/*Tip Amount*/}
                <div className={tipAmountDivStyling}> 
                    <input className={tipInputStyling} required pattern=".{3,500}" type="number" name="tipAmount" placeholder={"Amount"}
                    onChange={(e) => {
                        setTipAmount(e.target.value);
                    }}/>
                    <p className=" text-3xl">AR</p> 
                </div>
                {/*Submit Tip*/}
                <SubmitTipButton 
                    disable={false}

                />
            </div>
        </div>
    )
}
