import axios, { AxiosResponse } from "axios";
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

import { rssEpisode, rssEpisodeRetry } from "../../interfaces";
import { UploadEpisode } from "../../interfaces/exm";

import { arweaveAddress, loadingPage, podcastColorAtom } from "../../atoms";

import { ImgCover } from "./reusables";
import ProgressBar from "../reusables/progressBar";
import Everpay from "everpay";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
const ConnectButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.ConnectButton })));
const UploadButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.UploadButton })));


const MAX_EPISODES_TO_UPLOAD_AT_ONCE = 5;

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

interface RssEpisodeContentLength {
  link: string;
  length: string;
};


// 2. Stylings
export const spinnerClass = "w-full flex justify-center mt-4"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-2"
export const descContainerStyling = "w-[100%] h-32 rounded-xl bg-zinc-800 flex flex-row justify-start items-start focus-within:ring-white focus-within:ring-2"

// 3. Custom Functions

// 4. Components

export const RssEpisode: FC<RssEpisodeUI> = ({ title, length, gigabyteCost, number }) => {
  const { t } = useTranslation();

  const size = getReadableSize(Number(length));
  const cost = (calculateARCost(Number(gigabyteCost), Number(length)) + EPISODE_SLIPPAGE).toFixed(2);

  return (
    <div className="bg-zinc-800 default-animation rounded-xl px-5 py-3 w-full text-white flex justify-between">
      <div className="">{t("home.episode")} {number}: {title}</div>
      <div className="ml-4 flex gap-x-2">
        <div>{size || ""}</div>
        <div>{cost || "?"} AR</div>
      </div>
    </div>
  );
};

// Rube Goldberg would be proud
export const ImportedEpisodes: FC<ImportedEpisodesProps> = ({ pid, rssEpisodes, coverUrl, redirect }) => {

  // hooks
  const { t } = useTranslation();
  const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
  const router = useRouter();
  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

  const [arweaveAddress_,] = useRecoilState(arweaveAddress);
  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);

  const [uploadingEpisodes, setUploadingEpisodes] = useState<boolean>(false);
  const [uploadRetryEpisodes, setUploadRetryEpisodes] = useState<boolean>(false);
  const [totalUploadCost, setTotalUploadCost] = useState<number>(0);
  const [gigabyteCost, setGigabyteCost] = useState<number>(0)
  const [userHasEnoughAR, setUserHasEnoughAR] = useState<boolean>(false);

  const [currentEpisodes, setCurrentEpisodes] = useState<rssEpisode[]>([]);
  const [retryEpisodes, setRetryEpisodes] = useState<rssEpisodeRetry[]>([]);
  const [uploadedCount, setUploadCount] = useState<number>(0);
  const [progress, setProgress] = useState(0)
  const [, _setLoadingPage] = useRecoilState(loadingPage)

  const calculateFailedEpisodeSizes = async () => {
    let episodes = [];
    for (let i = 0; i < retryEpisodes.length; i++) {
      const file = (await axios.get(retryEpisodes[i].link, { responseType: 'arraybuffer' })).data;
      episodes.push({
        ...retryEpisodes[i],
        contentLength: file.byteLength,
        file
      });
    };
    setRetryEpisodes(episodes);
    return episodes;
  };

  // fetches content length for each episode, and splices it into the rssFeed array
  const fetchEpisodeData = async () => {
    const customRetryList = [];

    const maxEpisodes = rssEpisodes.slice(uploadedCount, uploadedCount + MAX_EPISODES_TO_UPLOAD_AT_ONCE);
    const rssLinks = maxEpisodes.filter((rssEpisode: rssEpisode) => !rssEpisode.length);
    if (!rssLinks.length) return maxEpisodes;
    const sizes = (await axios.post('/api/rss/get-headers', { rssLinks })).data.links;

    // splice rss episodes with content length
    const rssEpisodesFinal = maxEpisodes.map((rssEpisode: rssEpisode) => {
      const episode = sizes.find((ep: RssEpisodeContentLength) => ep.link === rssEpisode.link);
      if (!episode?.length) {
        customRetryList.push(rssEpisode);
        return null;
      };
      return {
        ...rssEpisode,
        contentLength: episode?.length || '0'
      };
    }).filter((item: rssEpisode) => item !== null);
    setRetryEpisodes(customRetryList);
    setCurrentEpisodes(rssEpisodesFinal);
    return rssEpisodesFinal;
  };

  useEffect(() => {

    const fetchCover = async () => {
      if (!coverUrl) return;
      const dominantColor = await fetchDominantColor(coverUrl, false, false);
      if (dominantColor.error) return;
      const [coverColor, _] = getCoverColorScheme(dominantColor.rgba);
      setPodcastColor(coverColor);
    };

    const fetchGigabyteCosts = async () => Number(await getBundleArFee('' + GIGABYTE)) / AR_DECIMALS;

    const calculateTotal = async (currEpisodes: rssEpisode[]) => {
      // calculate all episodes cost
      const cost = await fetchGigabyteCosts();
      const total = currEpisodes.map((rssEpisode: rssEpisode) =>
        calculateARCost(Number(cost), Number(rssEpisode.contentLength)) + EPISODE_SLIPPAGE
      );
      const totalCost = total.reduce((a, b) => a + b, 0);
      setTotalUploadCost(totalCost);

      // check if user has enough AR
      const everpay = new Everpay({
        account: arweaveAddress_,
        //@ts-ignore
        chainType: 'arweave',
        arJWK: 'use_wallet',
      });
      const balances = await everpay.balances({ account: arweaveAddress_ });
      //@ts-ignore
      const arBalance = balances.find((el: any) => el.chainType === "arweave,ethereum")?.balance;
      const isEnough = Number(arBalance) >= totalCost;
      setUserHasEnoughAR(isEnough);
    };

    const asyncs = async () => {
      await fetchCover();
      await fetchGigabyteCosts().then(setGigabyteCost);
      const currEpisodes = await fetchEpisodeData();
      await calculateTotal(currEpisodes);
    };
    asyncs();
  }, [uploadedCount]);

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
    } catch (e) {
      console.log(e);
      handleErr(t("error.everpayError"), setUploadingEpisodes);
      return;
    };
  };

  const uploadEpisode = async (rssEpisode: rssEpisode | rssEpisodeRetry, handleErr,) => {
    const testing = 0;
    if (testing) return 'testing';

    const { description, title, fileType, link, contentLength } = rssEpisode;

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

    // get user auth
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

    // start progress bar
    let interlen = 0;
    const percentPerEpisode = (100 / currentEpisodes.length);
    const inter = setInterval(() => {
      // prevent full progress bar
      if (interlen > 90) return;
      setProgress(prev => prev + (percentPerEpisode / 100))
      ++interlen;
    }, 1000);

    // upload content to arseeding
    const finalPayload = {
      url: link,
      uploadPaymentTX,
    };
    let tx: AxiosResponse | undefined;
    try {
      tx = await axios.post('/api/arseed/upload-url', finalPayload);
      console.log(tx.data);
      if (!tx) {
        throw new Error('Failed to upload url to arseeding: ' + link + "\n Reason: " + tx.status);
      };
    } catch {
      console.error('Failed to upload url to arseeding: ', link, "\n Reason: ", tx.status);
      return
    };
    // add uploaded content tx to payload
    uploadEpisodePayload['content'] = tx.data.response;

    setProgress(prev => prev + ((percentPerEpisode / 100) * 5));
    const result = await axios.post('/api/exm/write', uploadEpisodePayload);
    setProgress(prev => prev + percentPerEpisode);
    clearInterval(inter);
    console.log(result.data);
  };

  const startEpisodesUpload = async () => {

    // Check Wallet Connection
    if (!checkConnection(arweaveAddress_)) {
      toast.error(CONNECT_WALLET, { style: TOAST_DARK })
      return false;
    };

    setUploadingEpisodes(true);

    const handleErr = handleError;
    const toastSaving = toast.loading(t("loadingToast.savingChain"), { style: TOAST_DARK, duration: 10000000 });

    const episodeUploadPromises = currentEpisodes.map((episode: rssEpisode) => uploadEpisode(episode, handleErr));

    const result = await Promise.all(episodeUploadPromises);
    console.log(result);
    setUploadingEpisodes(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
    toast.dismiss(toastSaving);
    toast.success(t("success.showUploaded"), { style: TOAST_DARK })

    // this will trigger a refetch of the episodes
    setUploadCount(prev => prev + result.length);

    if (rssEpisodes.length !== uploadedCount) return;
    setTimeout(async function () {
      const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
      const { locale } = router;
      router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true })
    }, 3500);
  };

  const startEpisodesRetryUpload = async () => {
    // Check Wallet Connection
    if (!checkConnection(arweaveAddress_)) {
      toast.error(CONNECT_WALLET, { style: TOAST_DARK })
      return false;
    };

    setUploadRetryEpisodes(true);

    const handleErr = handleError;
    const toastSaving = toast.loading(t("loadingToast.savingChain"), { style: TOAST_DARK, duration: 10000000 });

    const episodeUploadPromises = retryEpisodes.map((episode: rssEpisode) => uploadEpisode(episode, handleErr));

    const result = await Promise.all(episodeUploadPromises);
    console.log(result);
    setUploadRetryEpisodes(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
    toast.dismiss(toastSaving);
    toast.success(t("success.showUploaded"), { style: TOAST_DARK })

    // this will trigger a refetch of the episodes
    setUploadCount(prev => prev + result.length);

    if (rssEpisodes.length !== uploadedCount) return;
    setTimeout(async function () {
      const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
      const { locale } = router;
      router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true })
    }, 3500);
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
            {retryEpisodes.length > 0 && (
              <>
                <div className="text-center text-white text-xl font-bold">{t("failed-to-estimate")}</div>
                {retryEpisodes.map((rssEpisode: rssEpisode, number: number) => (
                  <React.Fragment key={number}>
                    <RssEpisode {...rssEpisode} gigabyteCost={gigabyteCost} number={number + 1} />
                  </React.Fragment>
                ))}
                <div className="flex gap-x-3">
                  <button onClick={calculateFailedEpisodeSizes}>
                    Retry calculation
                  </button>
                  <button onClick={() => startEpisodesRetryUpload()}>
                    Attempt upload
                  </button>
                  <button onClick={() => setRetryEpisodes([])}>
                    Skip
                  </button>
                </div>
              </>
            )}
            {currentEpisodes.map((rssEpisode: rssEpisode, number: number) => (
              <React.Fragment key={number}>
                <RssEpisode {...rssEpisode} gigabyteCost={gigabyteCost} number={number + uploadedCount + 1} />
              </React.Fragment>
            ))}
            <div className="text-center">
              {uploadedCount} / {rssEpisodes.length}
            </div>
            <div>
              {/* <button
                className="bg-zinc-800 text-white rounded-full h-10 w-10 flex items-center justify-center"
                onClick={() => {}}
              >
                <ChevronLeftIcon className="h-6 w-6 mr-1" />
              </button> */}
              {/* {rssEpisodes.length > 0 && rssEpisodes.map((episode) => (
                <button onClick={}>

                </button>
              ))} */}
              {/* <button
                className="bg-zinc-800 text-white rounded-full h-10 w-10 flex items-center justify-center"
                onClick={() => {}}
              >
                <ChevronRightIcon className="h-6 w-6 mr-1" />
              </button> */}
            </div>
          </div>
          {/* Upload */}
          <div className="w-full flex justify-center items-center flex-col">
            {/*Show Upload Btn, Spinner, or Connect Btn*/}
            {address && address.length > 0 && !uploadingEpisodes && (
              <>
                <UploadButton
                  disable={!userHasEnoughAR}
                  width="w-[50%]"
                  click={startEpisodesUpload}
                />
                {!userHasEnoughAR && (
                  <p>{t("home.insufficient-balance")}</p>
                )}
              </>
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
