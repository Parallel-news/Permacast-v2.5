import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { FC, useEffect, useState } from "react"
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import toast from "react-hot-toast"
import { useRecoilState } from "recoil";

import { ARSEED_URL, AR_DECIMALS, CONNECT_WALLET, EPISODE_UPLOAD_FEE, EVERPAY_EOA, EVERPAY_EOA_UPLOADS, GIGABYTE, TOAST_DARK, USER_SIG_MESSAGES, EPISODE_SLIPPAGE } from "../../constants";

import { calculateARCost, getBundleArFee, getReadableSize, upload2DMedia } from "../../utils/arseeding";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { checkConnection, determineMediaType, handleError } from "../../utils/reusables";
import { arweaveAddress, loadingPage, podcastColorAtom } from "../../atoms";

import { rssEpisode } from "../../interfaces";

import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import { transferFunds } from "../../utils/everpay";
import { UploadEpisode } from "../../interfaces/exm";

const CoverContainer = React.lazy(() => import("./reusables").then(module => ({ default: module.CoverContainer })));
const ConnectButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.ConnectButton })));
const UploadButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.UploadButton })));



// 1. Interfaces
interface ImportedEpisodesProps {
  pid: string;
  rssEpisodes: rssEpisode[];
  redirect?: boolean;
};

interface RssEpisodeContentLength {
  link: string;
  length: string;
};

interface gigabyteCost {
  gigabyteCost: number | Number;
}

// 2. Stylings
export const spinnerClass = "w-full flex justify-center mt-4"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-2"
export const descContainerStyling = "w-[100%] h-32 rounded-xl bg-zinc-800 flex flex-row justify-start items-start focus-within:ring-white focus-within:ring-2"

// 3. Custom Functions

// 4. Components

export const RssEpisode: FC<rssEpisode & gigabyteCost> = ({ title, contentLength, gigabyteCost }) => {
  const size = getReadableSize(Number(contentLength));
  const cost = calculateARCost(Number(gigabyteCost), Number(contentLength));
  return (
    <div className="bg-zinc-800 default-animation rounded-xl px-5 py-3 w-full text-white flex justify-between">
      <div className="max-w-[200px]">{title}</div>
      <div className="flex gap-x-2">
        <div>{size}</div>
        <div>{cost}</div>
      </div>
    </div>
  );
};

export const ImportedEpisodes: FC<ImportedEpisodesProps> = ({ pid, rssEpisodes, redirect }) => {

  // hooks
  const { t } = useTranslation();
  const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
  const router = useRouter();
  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
  
  const [arweaveAddress_,] = useRecoilState(arweaveAddress);
  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  
  const [uploadingEpisodes, setUploadingEpisodes] = useState<boolean>(false);
  const [uploadCost, setUploadCost] = useState<Number>(0);
  const [gigabyteCost, setGigabyteCost] = useState<Number>(0)

  // inputs
  const [podcastCover_, setPodcastCover_] = useState(null);
  const [coverUrl, setCoverUrl] = useState<string>("")

  const [progress, setProgress] = useState(0)
  const [, _setLoadingPage] = useRecoilState(loadingPage)
  
  useEffect(() => {
    const fetchData = async () => {
      if (!podcastCover_) return;
      const dominantColor = await fetchDominantColor(podcastCover_, false, false);
      if (dominantColor.error) return;
      const [coverColor, _] = getCoverColorScheme(dominantColor.rgba);
      setPodcastColor(coverColor);
    };
    const fetchGigabyteCosts = async () => {
      const cost = Number(await getBundleArFee('' + GIGABYTE)) / AR_DECIMALS;
      setGigabyteCost(cost);
    };
    fetchData();
    fetchGigabyteCosts();
  }, [podcastCover_]);

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
    // steps:
    // 0. async call and get all link sizes
    // 1. calculate all sizes async

    // Check Wallet Connection
    if (!checkConnection(arweaveAddress_)) {
      toast.error(CONNECT_WALLET, { style: TOAST_DARK })
      return false;
    }
    
    const rssLinks = [rssEpisodes[0]].map((rssEpisode: rssEpisode) => rssEpisode.link);
    const sizes = (await axios.post('/api/rss/get-headers', { rssLinks })).data.links;

    const rssEpisodesFinal = [rssEpisodes[0]].map((rssEpisode: rssEpisode) => {
      const contentLength = sizes.find((item: RssEpisodeContentLength) => item.link === rssEpisode.link);
      return {
        ...rssEpisode,
        contentLength: contentLength.length,
      };
    });
  
    setUploadingEpisodes(true)

    const handleErr = handleError;
    const toastSaving = toast.loading(t("loadingToast.savingChain"), {style: TOAST_DARK, duration: 10000000});

    const episodeUploadPromises = [rssEpisodesFinal[0]].map(async (rssEpisode: rssEpisode) => {
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
      const FINAL_CONTENT_COST = CONTENT_COST + 0.005; // to avoid rounding errors and a slippage change
      const uploadPaymentTX = await transferFunds("UPLOAD_CONTENT", FINAL_CONTENT_COST, EVERPAY_EOA_UPLOADS, address);

      const finalPayload = {
        url: link,
        uploadPaymentTX,
        episodeMetadata: uploadEpisodePayload,
      };

      const result = await axios.post('/api/arseed/upload-url', finalPayload);
      console.log(result.data)
    })
    toast.dismiss(toastSaving);
    toast.success(t("success.showUploaded"), {style: TOAST_DARK})

    const result = Promise.all(episodeUploadPromises);
  };

  return (
    <div className={showFormStyling}>
      {/*First Row*/}
      <div className="flex flex-col justify-center items-center lg:items-start lg:flex-row w-full">
        {/*Cover*/}
        <div className="w-[25%] flex justify-center mb-4 lg:mb-0">
          <CoverContainer
            setCover={() => { }}
            isEdit={false}
            editCover={coverUrl}
          />
        </div>
        <div className="flex flex-col w-[95%] md:w-[75%] lg:w-[50%] space-y-3">
          {/* Preview */}
          <div className="flexCol">
            {[rssEpisodes[0]].map((rssEpisode: rssEpisode) => (
              <RssEpisode { ...rssEpisode } gigabyteCost={gigabyteCost}  />
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
            {!address && (
              <ConnectButton
                width="w-[75%] md:w-[50%]"
                disable={false}
                click={() => connect()}
              />
            )}
            <p className="mt-2 text-neutral-400">{t("uploadshow.uploadCost") + ": " + (Number(uploadCost)).toFixed(6) + " AR"}</p>
          </div>
        </div>
        <div className="w-[25%]"></div>
      </div>
    </div>
  );
};
