import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { FC, useEffect, useState } from "react"
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import toast from "react-hot-toast"
import { useRecoilState } from "recoil";

import { AR_DECIMALS, CONNECT_WALLET, EPISODE_UPLOAD_FEE, EVERPAY_EOA, EVERPAY_EOA_UPLOADS, GIGABYTE, TOAST_DARK, USER_SIG_MESSAGES, EPISODE_SLIPPAGE } from "../../constants";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";

import { calculateARCost, getBundleArFee, getReadableSize, upload2DMedia } from "../../utils/arseeding";
import { checkConnection, determineMediaType, handleError } from "../../utils/reusables";
import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import { transferFunds } from "../../utils/everpay";

import { rssEpisode } from "../../interfaces";
import { UploadEpisode } from "../../interfaces/exm";

import { arweaveAddress, loadingPage, podcastColorAtom } from "../../atoms";

import { ImgCover } from "./reusables";
import ProgressBar from "../reusables/progressBar";
const ConnectButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.ConnectButton })));
const UploadButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.UploadButton })));



// 1. Interfaces
interface ImportedEpisodesProps {
  pid: string;
  coverUrl: string;
  rssEpisodes: rssEpisode[];
  redirect?: boolean;
};

interface RssEpisodeUI extends rssEpisode {
  number: number;
  gigabyteCost: number;
};


// 2. Stylings
export const spinnerClass = "w-full flex justify-center mt-4"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-2"
export const descContainerStyling = "w-[100%] h-32 rounded-xl bg-zinc-800 flex flex-row justify-start items-start focus-within:ring-white focus-within:ring-2"

// 3. Custom Functions

// 4. Components

export const RssEpisode: FC<RssEpisodeUI> = ({ title, contentLength, gigabyteCost, number }) => {
  const { t } = useTranslation();

  const size = getReadableSize(Number(contentLength));
  const cost = (calculateARCost(Number(gigabyteCost), Number(contentLength)) + EPISODE_SLIPPAGE).toFixed(2);

  return (
    <div className="bg-zinc-800 default-animation rounded-xl px-5 py-3 w-full text-white flex justify-between">
      <div className="">{t("home.episode")} {number}: {title}</div>
      <div className="ml-4 flex gap-x-2">
        <div>{size}</div>
        <div>{cost} AR</div>
      </div>
    </div>
  );
};

export const ImportedEpisodes: FC<ImportedEpisodesProps> = ({ pid, rssEpisodes, coverUrl, redirect }) => {

  // hooks
  const { t } = useTranslation();
  const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
  const router = useRouter();
  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
  
  const [arweaveAddress_,] = useRecoilState(arweaveAddress);
  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  
  const [uploadingEpisodes, setUploadingEpisodes] = useState<boolean>(false);
  const [totalUploadCost, setTotalUploadCost] = useState<number>(0);
  const [gigabyteCost, setGigabyteCost] = useState<number>(0)

  const [progress, setProgress] = useState(0)
  const [, _setLoadingPage] = useRecoilState(loadingPage)
  
  useEffect(() => {
    const fetchData = async () => {
      if (!coverUrl) return;
      const dominantColor = await fetchDominantColor(coverUrl, false, false);
      if (dominantColor.error) return;
      const [coverColor, _] = getCoverColorScheme(dominantColor.rgba);
      setPodcastColor(coverColor);
    };

    const fetchGigabyteCosts = async () => Number(await getBundleArFee('' + GIGABYTE)) / AR_DECIMALS;
    const calculateTotal = async () => {
      const cost = await fetchGigabyteCosts();
      const total = rssEpisodes.map((rssEpisode: rssEpisode) => 
        calculateARCost(Number(cost), Number(rssEpisode.contentLength)) + EPISODE_SLIPPAGE
      );
      const totalCost = total.reduce((a, b) => a + b, 0);
      setTotalUploadCost(totalCost);
    };
    fetchData();
    fetchGigabyteCosts().then(setGigabyteCost);
    calculateTotal();
  }, []);

  const tryDescriptionUpload = async (description: string, handleErr: any) => {
    try {
      const descriptionTX = await upload2DMedia(description);
      const tx = descriptionTX?.order?.itemId || '';
      return tx;
    } catch (e) {
      console.log(e);
      handleErr(t("errors.descUploadError"), setUploadingEpisodes);
      return;
    };
  };

  const tryFeePayment = async (handleErr: any) => {
    try {
      const tx = await transferFunds("UPLOAD_EPISODE_FEE", EPISODE_UPLOAD_FEE, EVERPAY_EOA, address);
      //@ts-ignore - refusing to acknowledge everHash
      const everHash = tx[1].everHash;
      return everHash;
    } catch(e) {
      console.log(e);
      handleErr(t("error.everpayError"), uploadEpisodes);
      return;
    };
  };

  const uploadEpisodes = async () => {

    // Check Wallet Connection
    if (!checkConnection(arweaveAddress_)) {
      toast.error(CONNECT_WALLET, { style: TOAST_DARK })
      return false;
    }
    
    setUploadingEpisodes(true)

    const handleErr = handleError;
    const toastSaving = toast.loading(t("loadingToast.savingChain"), {style: TOAST_DARK, duration: 10000000});

    const percentPerEpisode = (100 / rssEpisodes.length);
    const episodeUploadPromises = rssEpisodes.map(async (rssEpisode: rssEpisode) => {
      const { description, title, fileType, link, contentLength } = rssEpisode;

      // Package EXM Call
      const uploadEpisodePayload: UploadEpisode = {
        "function": "addEpisode",
        "jwk_n": "",
        "pid": pid,
        "name": title,
        "desc": "",
        "sig": "",
        "txid": "",
        "isVisible": true,
        "thumbnail": "",
        "content": "",
        "mimeType": determineMediaType(fileType),
      };

      const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + await getPublicKey());
      // @ts-ignore
      uploadEpisodePayload["sig"] = await createSignature(data, defaultSignatureParams, "base64");
      uploadEpisodePayload["jwk_n"] = await getPublicKey();

      // Description to Arseeding
      const descriptionTx = await tryDescriptionUpload(description, handleErr);
      console.log(descriptionTx);
      // @ts-ignore
      uploadEpisodePayload["desc"] = descriptionTx;

      // Pay Upload Fee
      const feeTX = await tryFeePayment(handleErr);
      console.log(feeTX);
      // @ts-ignore
      uploadEpisodePayload["txid"] = feeTX;

      const CONTENT_COST = calculateARCost(Number(gigabyteCost), Number(contentLength));
      const FINAL_CONTENT_COST = CONTENT_COST + EPISODE_SLIPPAGE; // to avoid rounding errors and a slippage change
      const uploadPaymentTX = await transferFunds("UPLOAD_CONTENT", FINAL_CONTENT_COST, EVERPAY_EOA_UPLOADS, address);

      const finalPayload = {
        url: link,
        uploadPaymentTX,
        episodeMetadata: uploadEpisodePayload,
      };

      let interlen = 0;
      const inter = setInterval(() => {
        if (interlen > 95) return;
        setProgress(prev => prev + (percentPerEpisode / 100))
        ++interlen;
      }, 1000);
      const result = await axios.post('/api/arseed/upload-url', finalPayload);
      setProgress(prev => prev + percentPerEpisode);
      clearInterval(inter)
      console.log(result.data)
    });

    const result = await Promise.all(episodeUploadPromises);
    setProgress(100);
    toast.dismiss(toastSaving);
    toast.success(t("success.showUploaded"), {style: TOAST_DARK})
    setTimeout(async function () {
      const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
      const { locale } = router;
      router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true })
    }, 3500)
    console.log(result);
  };

  return (
    <div className={showFormStyling}>
      {/*First Row*/}
      <div className="flex flex-col justify-center items-center lg:items-start lg:flex-row w-full">
        {/*Cover*/}
        <div className="w-[25%] flex justify-center mb-4 lg:mb-0">
          <ImgCover img={coverUrl} />
        </div>
        <div className="flex flex-col w-[95%] md:w-[75%] lg:w-[50%] space-y-3">
          {/* Preview */}
          <div className="flexCol gap-y-2">
            {rssEpisodes.map((rssEpisode: rssEpisode, number: number) => (
              <RssEpisode { ...rssEpisode } gigabyteCost={gigabyteCost} number={number+1} />
            ))}
          </div>
          {/* Upload */}
          <div className="w-full flex justify-center items-center flex-col">
            {/*Show Upload Btn, Spinner, or Connect Btn*/}
            {address && address.length > 0 && !uploadingEpisodes && (
              <UploadButton
                disable={false}
                width="w-[50%]"
                click={uploadEpisodes}
              />
            )}
            {address && address.length > 0 && uploadingEpisodes && (
              <ProgressBar
                value={progress}
              />
            )}
            {!address && (
              <ConnectButton
                width="w-[75%] md:w-[50%]"
                disable={false}
                click={() => connect()}
              />
            )}
            <p className="mt-2 text-neutral-400">{t("uploadshow.uploadCost") + ": " + (Number(totalUploadCost)).toFixed(6) + " AR"}</p>
          </div>
        </div>
        <div className="w-[25%]"></div>
      </div>
    </div>
  );
};
