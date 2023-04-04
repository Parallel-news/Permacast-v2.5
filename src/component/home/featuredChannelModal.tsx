import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Everpay, { ChainType } from "everpay";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { defaultSignatureParams, useArconnect } from "react-arconnect";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { allPodcasts, arweaveAddress, everPayBalance } from "../../atoms";
import { EVERPAY_AR_TAG, EVERPAY_FEATURE_TREASURY, FADE_IN_STYLE, FADE_OUT_STYLE, FEATURE_COST, SPINNER_COLOR, USER_SIG_MESSAGES } from "../../constants";
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

interface CostsProps {
  balance: number;
  duration: number;
}

const Costs: FC<CostsProps> = ({ balance, duration }) => {
  const { t } = useTranslation();
  const [arPrice, setArPrice] = useState<number>(0);

  useEffect(() => {
    fetchARPriceInUSD().then(setArPrice);
  }, []);

  const ARCost = (FEATURE_COST * duration).toFixed(1);
  const dollarCost = (arPrice * (FEATURE_COST * duration)).toFixed(2);


  return (
    <div className="text-center mt-2 text-lg">
      <div className="mb-2">{t("home.featured-modal.cost")} {ARCost} AR (${dollarCost} USD)</div>
      <div className="text-white text-lg">{t("home.featured-modal.balance")} {Number(balance).toFixed(2)} AR</div>
    </div>
  );
};


const FeaturedChannelModal: FC<TipModalInter> = ({isVisible, setIsVisible}) => {

  const { t } = useTranslation();

  const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
  const [_everPayBalance, _setEverPayBalance] = useRecoilState(everPayBalance)
  const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);
  const [_arweaveAddress, _setArweaveAddress] = useRecoilState(arweaveAddress);
  const yourShows: Podcast[] = allPodcasts_.filter((item: Podcast) => item.owner === address);

  const [pid, setPid] = useState<string>("")

  const [showModal, setShowModal] = useState<boolean>(false)

  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME });

  const [showModalisVisible, setShowModalIsVisible] = useState<boolean>(false);

  const [duration, setDuration] = useState(1);

  const [loading, setLoading] = useState(false);

  // Show Modal Effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowModal(prev => !prev);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isVisible])


  const payAndGetFeatured = async () => {
    setLoading(true)
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
    toast.success("Your channel is now featured! 🎉");
    setLoading(false)
    setShowModal(false);
    setIsVisible(false);
  };

  const sufficientFunds = _everPayBalance >= (FEATURE_COST * duration);

  return (
    <div className={tipModalStyling + " backdrop-blur-sm"}>
      <div className={`${containerPodcastModalStyling + " relative overflow-hidden"} ${showModal ? FADE_IN_STYLE : FADE_OUT_STYLE}`}>
        {/*Header*/}
        <div className="text-2xl font-bold text-center mt-4">{t("home.get-featured")}</div>
        <XMarkIcon className={xMarkModalStyling} onClick={() => setIsVisible(false)} />
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="z-[100]">
            {address && (
              <>
                <SelectPodcast
                  pid={pid}
                  setPid={setPid}
                  shows={yourShows}
                />
                <div className={"mt-12"}>
                  <DateSelector {...{duration, setDuration}} />
                  <Costs balance={_everPayBalance} duration={duration} />
                </div>
              </>
            )}
          </div>
          <div className="w-full flex justify-center pt-5 items-center">
            {(!address || address.length === 0) ? (
              <ConnectButton
                disable={false}
                click={() => connect()}
              />
            ): (
              <button disabled={pid.length === 0 || !sufficientFunds || loading} className={GetFeaturedButtonStyling + " flex "} onClick={payAndGetFeatured}>
                <div>
                  {
                    sufficientFunds ? (
                    pid.length !== 0 ? t("home.featured-modal.feature"):
                    t("uploadepisode.select-show")
                  ): t("home.featured-modal.insufficient-balance")}
                </div>
                <>
                  {loading && <PermaSpinner 
                    spinnerColor={SPINNER_COLOR}
                    size={8}
                    divClass={"ml-2"}
                  />}
                </>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedChannelModal;