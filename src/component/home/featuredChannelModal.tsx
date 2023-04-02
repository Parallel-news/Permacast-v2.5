import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Everpay, { ChainType } from "everpay";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { defaultSignatureParams, useArconnect } from "react-arconnect";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { allPodcasts, arweaveAddress, everPayBalance } from "../../atoms";
import { EVERPAY_AR_TAG, EVERPAY_FEATURE_TREASURY, FADE_IN_STYLE, FADE_OUT_STYLE, FEATURE_COST, USER_SIG_MESSAGES } from "../../constants";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { Podcast } from "../../interfaces";
import { transferFunds } from "../../utils/everpay";
import { fetchARPriceInUSD } from "../../utils/redstone";
import DateSelector from "../dateSelector";
import { PermaSpinner } from "../reusables/PermaSpinner";
import { ConnectButton, containerPodcastModalStyling, SelectPodcast, tipModalStyling } from "../uploadEpisode/uploadEpisodeTools";
import { GetFeaturedButtonStyling } from "./getFeatured";

interface TipModalInter {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export const tipAmountDivStyling = "w-full flex flex-row justify-center items-center mx-auto space-x-2"
export const titleCornerStyling = "absolute top-0 left-0 bg-black h-[150px] w-[150px] flex justify-center items-center rounded-br-full z-30"
export const benefactorBannerStyling = "absolute top-0 bg-zinc-900 w-full h-[100px] z-30 flex flex-row items-center"
export const xMarkModalStyling = "h-7 w-7 mt-1 cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full z-30 absolute top-3 right-3"
export const tipInputStyling = "input input-secondary px-4 bg-zinc-700/80 border-0 rounded-lg outline-none focus:ring-2 focus:ring-inset focus:ring-white w-[200px] h-[100px] placeholder:text-5xl placeholder:font-bold text-5xl font-bold text-center"
export const tipAmountAbsStyling = "absolute inset-0 top-0 flex justify-center items-center flex flex-col z-20"
export const benefactorNameStyling = "text-white text-3xl font-bold flex justify-center w-full text-center"
export const tipStyling = "text-white text-4xl transform -rotate-45 font-bold"



const FeaturedChannelModal: FC<TipModalInter> = ({isVisible, setIsVisible}) => {

  const { t } = useTranslation();

  const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);
  const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
  //? Darn it we need to get rid of this
  const [_arweaveAddress, _setArweaveAddress] = useRecoilState(arweaveAddress);
  const yourShows: Podcast[] = allPodcasts_.filter((item: Podcast) => item.owner === address);

  const [pid, setPid] = useState<string>("")

  const [showModal, setShowModal] = useState<boolean>(false)
  const [tipAmount, setTipAmount] = useState<string>("0")
  const [tipUSD, setTipUSD] = useState<Number>(0)
  const [calculatingTip, setCalculatingTip] = useState<boolean>(false)
  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
  const [_everPayBalance, _setEverPayBalance] = useRecoilState(everPayBalance)
  const [tipLoading, setTipLoading] = useState<boolean>(false)

  const [showModalisVisible, setShowModalIsVisible] = useState<boolean>(false);

  const [duration, setDuration] = useState(1);

  // const req = {
  //   "function": "featureChannel",
  //   "jwk_n": "xGx07uNnjitWsOSfKZC-ic74oXs9qDXU5QOsAis4V3tXk0krk5zUlGYu7SlZ-4xfNVA1QsHa_pOvlgE-0xGKJvMZRZYzlYcBDsnDJgLYQc5D2B2Ng4HQjLON-Gqsxl25Uj7-VSEeUgk5b2Q4SrAoVTKLWKEtuGDqwy5qKKCvNHYShYJHbmAsjQzwCwvfn2bqKv_zFUD4QeukihfDJbVyZaiev7GoE1NzTsqJ_V_eZ9tKV_5YVy-ZVU8a9dEeTnGJm2rT6z9aCcQwd9EqVYi7h8QCbKOn2r5K2NbD6V8xjQGHvODHMO0iHk2hLzcLbfDfyn_Ej-xZsHU6LBJCTeDBy_5kWtOVlYL_RH34UA1j_IYEMVDYnQBKo5laassByvkn7nODZiXesvw6TsXPYdrqrgIL7x4Td5QVK8UHXCGXOrtAlhxfzNWyjP0z5ezAsQpzGPgGI9OKgjmPIk4K6K88BoxNmJ_XFPV1DN8qZGsPSVz2N7XN9wFetDs4CMOGyDToTDEea77TsP1ykKMcXf2h-JCZlvzFEpxS_zMaRMcwV502zXN01oCR2QpUEISf_IzxQYXsjR_F75VPpUvfmDtPYf4ftQN1cZYiH68zxn74uO7DLqIa3nUXq_IrUP7SmEnbMgjzjElp0a_u62XtmgT3GQv7SBrQdzym3yhhM-3kcok",
  //   "pid": "6z9MDpEe4vYPmjqfvMQO7qTxYXd8PXA9bxiQ6aebE6c",
  //   "period": 10,
  //   "payment_txid": "0x4dd0707a8d7baaf39e34939839c28d9604cf0d07590b6cef3f02ab539e2def31",
  //   "sig": "iXScmaioe6MhfyBKSCyWFxNlRCymYRaQ+IVlsx82HqOSNWbyhJvs2W9pQRhE+nLFggVhQ2Q70i0USzP8Shpp2jPVgqmw/Nt7kV2uOD1XIfQxgYcIqStUfD6OgM+aBcJ7H6g3WwgU90iLQpUlrX+fKHC39l52n885jWIOGg5Oz/mzXiUwLEwQPnadbK2OrQXPsCibmT2crbsofB60xu0mcGsZBlbiFQABOyiGealocXyjqcHI765/wAaW5nuLwwELV88x35TaX+ptVSt1dcgQbyziQJ+FtMvxDzlN5xCnC6nRc55z+t5OSSflDXbUyZcF44cV0QnuN90xp6D3+dmqbyehSQGe7jNTlUEUB4Zyz9NsC8vcHpB+yZFY4vKXrmNEKodCCXE/K82rLge9u/cn3rv4DVvc4OUw2lMyY0cSeKholElkXISLKuHzIAMzNqj/j6TFOtbkykbl9hSJcDQyHbCBeKliKmQ2bNyTQlpEZwclVMqCHNnPUk2yLnUG3xU6KkbPwOi7i7wlzslPZdFA1tEo9/Lg3OmOBXAcEIhmiIEgRJZLyO8O0LvwmLYDPPa3xcpFDR0t7V3j+5kSBZnkoPOF2jVqPoxdu068rb/ytbRTLCuPwjP0gF57CgJ6fhxsg4BqB9ckHzD9M6lUOmkIvQnQ/BgdMwY8hpqjf61tPQE="
  // };

  // Show Modal Effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowModal(prev => !prev);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isVisible])

  // // Calculate Tip USD
  // useEffect(() => {
  //     const calculateTipUSD = async () => {
  //         setCalculatingTip(true)
  //         setTipUSD(0)
  //         const arPrice = await fetchARPriceInUSD()
  //         setTipUSD(Number(tipAmount)*arPrice)
  //         setCalculatingTip(false)
  //     }
  //     if(tipAmount.trim().length > 0) calculateTipUSD();
  // }, [tipAmount]);

  const payAndGetFeatured = async () => {
    const everpay = new Everpay({account: address, chainType: ChainType.arweave, arJWK: 'use_wallet'});
    const payment_txid = await everpay.transfer({
      tag: EVERPAY_AR_TAG,
      amount: String((FEATURE_COST * duration).toFixed(1)),
      to: EVERPAY_FEATURE_TREASURY,
      data: {action: "featureChannel", pid}
    });

    const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + await getPublicKey());
    const sig = await createSignature(data, defaultSignatureParams, "base64");
    const jwk_n = await getPublicKey();

    const req = {
      "function": "featureChannel",
      jwk_n,
      pid,
      period: duration,
      payment_txid,
      sig
    };
    const res = (await axios.post('/api/exm/featured-channels/write', req)).data;
    console.log(res);
    toast.success("Your channel is now featured! 🎉")
    setShowModal(false);
    setIsVisible(false);
  };

  return (
    <div className={tipModalStyling + " backdrop-blur-sm"}>
      <div className={`${containerPodcastModalStyling + " justify-between relative overflow-hidden"} ${showModal ? FADE_IN_STYLE : FADE_OUT_STYLE}`}>
        {/*Header*/}
        <XMarkIcon className={xMarkModalStyling} onClick={() => setIsVisible(false)} />
        {address && (
          <div className="mt-20 z-[100]">
            <SelectPodcast
              pid={pid} 
              setPid={setPid}
              shows={yourShows}
            />
          </div>
        )}
        {/*Tip Amount*/}
        <div className={tipAmountAbsStyling}>
          <DateSelector {...{duration, setDuration}} />
          <div>
            cost: {(FEATURE_COST * duration).toFixed(1)} AR
          </div>
        </div>
        <button className={"z-50"} onClick={payAndGetFeatured}>
          Get Featured
        </button>
        <div>
          {(!address || address.length === 0) && (
            <ConnectButton
              disable={false}
              click={() => connect()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedChannelModal;