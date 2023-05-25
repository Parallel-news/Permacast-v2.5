import axios, { AxiosProgressEvent, AxiosResponse } from "axios";
import Everpay from "everpay";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { FC, useEffect, useState } from "react"
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import toast from "react-hot-toast"
import { useRecoilState } from "recoil";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Spacer, Loading, Tooltip } from "@nextui-org/react";

import { AR_DECIMALS, CONNECT_WALLET, EPISODE_UPLOAD_FEE, EVERPAY_EOA, EVERPAY_EOA_UPLOADS, GIGABYTE, TOAST_DARK, USER_SIG_MESSAGES, EPISODE_SLIPPAGE } from "../../constants";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";

import { calculateARCost, getBundleArFee, getReadableSize, upload2DMedia } from "../../utils/arseeding";
import { checkConnection, determineMediaType, handleError } from "../../utils/reusables";
import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import { transferFunds } from "../../utils/everpay";

import { EXMState, rssEpisode, rssEpisodeRetry } from "../../interfaces";
import { UploadEpisode } from "../../interfaces/exm";

import { arweaveAddress, loadingPage, podcastColorAtom } from "../../atoms";

import { fetchARPriceInUSD } from "../../utils/redstone";
import { RSSFeedManager } from "../../utils/localstorage";
import { findPodcast } from "../../utils/filters";

import { ImgCover } from "./reusables";
import ProgressBar from "../reusables/progressBar";
import { RSSEpisodeEstimate } from "../../interfaces/api";
import DebouncedInput from "../reusables/debouncedInput";
import { convertToValidNumber } from "../../utils/validation/inputs";
import { DEFAULT_THEME_COLOR } from "../../constants/ui";
const ConnectButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.ConnectButton })));
const UploadButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.UploadButton })));

const RSS_TESTING_URL = "https://permacast-bloodstone-helper.herokuapp.com/feeds/rss/T7HWHKp-AjIj69TQRvV4EZRVTY1J8J9zSgE668aOmC4";
const FULL_TESTING = 0;
const MAX_EPISODES_TO_UPLOAD_AT_ONCE = 5;

// 1. Interfaces
interface ImportedEpisodesProps {
  pid: string;
  coverUrl: string;
  rssEpisodes: rssEpisode[];
  redirect?: boolean;
  // temp
  index?: number;
};

interface uploadEpisodeInter {
  tx: string;
  number: number;
};

interface RssEpisodeUI extends rssEpisode {
  number: number;
  gigabyteCost: number;
  uploaded?: boolean;
};

interface RssEpisodeContentLength {
  link: string;
  length: string;
};


// 2. Stylings
export const spinnerClass = "w-full flex justify-center mt-4"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-2"
export const descContainerStyling = "w-[100%] h-32 rounded-xl bg-zinc-800 flex flex-row justify-start items-start focus-within:ring-white focus-within:ring-2"
export const buttonColorStyling = `bg-zinc-800 hover:bg-zinc-600 default-animation disabled:hover:bg-black disabled:bg-black text-white disabled:text-gray-500 flexFullCenter rounded-lg `;

export const buttonStyling = buttonColorStyling + `h-8 w-8 `;
// 3. Custom Functions
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 4. Components


// Rube Goldberg would be proud
export const ImportedEpisodes: FC<ImportedEpisodesProps> = ({ pid, rssEpisodes, coverUrl, index, redirect }) => {

  // hooks
  const { t } = useTranslation();
  const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
  const router = useRouter();
  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

  const [arweaveAddress_,] = useRecoilState(arweaveAddress);
  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [, _setLoadingPage] = useRecoilState(loadingPage)

  const [realPid, setRealPid] = useState<string>('');
  const [totalUploadCost, setTotalUploadCost] = useState<number>(0);
  const [gigabyteCost, setGigabyteCost] = useState<number>(0);
  const [arPrice, setArPrice] = useState<number>(0);
  const [userHasEnoughAR, setUserHasEnoughAR] = useState<boolean>(false);
  const [isUploadingEpisodes, setIsUploadingEpisodes] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const [isReverseOrder, setIsReverseOrder] = useState<boolean>(false);
  const [currentEpisodes, setCurrentEpisodes] = useState<rssEpisode[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [navigatePage, setNavigatePage] = useState<number>(1);
  const [uploadedPages, setUploadedPages] = useState<number[]>([]);
  const [retryEpisodes, setRetryEpisodes] = useState<rssEpisodeRetry[]>([]);  
  const [uploadedCount, setUploadCount] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  const MAX_PAGES = Math.floor((rssEpisodes?.length || 0) / MAX_EPISODES_TO_UPLOAD_AT_ONCE);

  const fetchPodcast = async () => {
    const data: EXMState = (await axios.get('/api/exm/read')).data;
    const podcast = data.podcasts[index];
    console.log(podcast);
    return podcast;
  };

  const attemptIndexPodcastID = async () => {
    let attempts = 3;

    console.log(index);
    for (let i = 0; i < attempts; i++) {
      const foundPod = await fetchPodcast();
      console.log(foundPod);
      if (foundPod) {
        setRealPid(foundPod.pid);
        console.log("Podcast found");
        return foundPod;
      } else {
        await sleep(3500);
        if (i === attempts - 1) {
          console.log("Podcast not found");
          return null;
        };
      };
    };
  };

  // check if all episodes have length
  // if not all episodes have length, fetch sizes
  // if no sizes, attempt size fetch via headers
  // if still no sizes, add to custom download list

  const fetchEpisodeSizes = async (rssEpisodes: rssEpisode[]) => {
    const retryEpisodeDownloadList: rssEpisodeRetry[] = [];
    // attempt to fetch sizes via known property length
    const episodesWithoutLength = rssEpisodes.filter((rssEpisode: rssEpisode) => (
      !rssEpisode?.['length'] || Number(rssEpisode?.['length']) === 0)
    );
    console.log('episodes without length', episodesWithoutLength);
    // if all episodes have length, return
    if (!episodesWithoutLength.length) return { knownEpisodeSizes: rssEpisodes, unkwownEpisodeSizes: [] };
    
    const episodesWithLength = rssEpisodes.filter((rssEpisode: rssEpisode) => (
      rssEpisode?.['length'] && Number(rssEpisode?.['length']) > 0)
    );

    // else, simplify list to links, and fetch sizes via header request
    const rssLinks = episodesWithoutLength.map((rssEpisode: rssEpisode) => rssEpisode.link);
    const sizes = (await axios.post('/api/rss/get-headers', { rssLinks })).data.links;

    // if no sizes, add to custom download list
    // splice rss episodes with length property
    const rssEpisodesFinal = episodesWithoutLength.map((rssEpisode: rssEpisode) => {
      const attemptedLink = sizes.find((ep: RssEpisodeContentLength) => ep.link === rssEpisode.link);
      if (!attemptedLink?.['length']) {
        retryEpisodeDownloadList.push(rssEpisode);
        return null;
      };
      return {
        ...rssEpisode,
        length: attemptedLink?.['length'] || '0'
      };
    }).filter((item: rssEpisode) => item !== null);
    const sortedEpisodes = [...episodesWithLength, ...rssEpisodesFinal].sort((a: rssEpisode, b: rssEpisode) => a.order - b.order);
    return { knownEpisodeSizes: sortedEpisodes, unknownEpisodeSizes: retryEpisodeDownloadList };
  };

  const fetchCover = async () => {
    if (!coverUrl) return;
    const dominantColor = await fetchDominantColor(coverUrl, false, false);
    if (dominantColor.error) return;
    const [coverColor, _] = getCoverColorScheme(dominantColor.rgba);
    setPodcastColor(coverColor);
  };

  const fetchGigabyteCosts = async () => Number(await getBundleArFee('' + GIGABYTE)) / AR_DECIMALS;

  const calculateTotalAndSetEpisodes = async (episodes: rssEpisode[]) => {

    // calculate all episodes cost
    const cost = await fetchGigabyteCosts();

    const { knownEpisodeSizes, unknownEpisodeSizes } = await fetchEpisodeSizes(episodes);
    setCurrentEpisodes(knownEpisodeSizes);
    setRetryEpisodes(unknownEpisodeSizes);

    const total = knownEpisodeSizes.map((rssEpisode: rssEpisode) =>
      calculateARCost(Number(cost), Number(rssEpisode.length)) + EPISODE_SLIPPAGE
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
    if (!rssEpisodes) return;
    setIsCalculating(true);
    fetchARPriceInUSD().then(setArPrice);
    await fetchCover();
    await fetchGigabyteCosts().then(setGigabyteCost);
    const index = MAX_EPISODES_TO_UPLOAD_AT_ONCE * (currentPage - 1);
    console.log(index);
    const nextEpisodes = rssEpisodes.slice(
      index,
      index + MAX_EPISODES_TO_UPLOAD_AT_ONCE
    );
    const finalEpisodes = isReverseOrder ? nextEpisodes.reverse() : nextEpisodes;
    await calculateTotalAndSetEpisodes(finalEpisodes);
    setIsCalculating(false);
  };

  useEffect(() => {
    if (!realPid) {
      attemptIndexPodcastID();
      return
    };
    const savedPIDpages = RSSFeedManager.getValueFromObject(realPid);
    console.log(savedPIDpages);
    if (savedPIDpages) setUploadedPages(JSON.parse(savedPIDpages));
  }, [realPid]);

  useEffect(() => {
    setNavigatePage(currentPage);
    asyncs();
  }, [currentPage]);

  const tryDescriptionUpload = async (description: string, handleErr: any) => {
    try {
      const descriptionTX = await upload2DMedia(description);
      const tx = descriptionTX?.order?.itemId || '';
      return tx;
    } catch (e) {
      console.log(e);
      handleErr(t("errors.descUploadError"), setIsUploadingEpisodes);
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
      handleErr(t("error.everpayError"), setIsUploadingEpisodes);
      return;
    };
  };

  const payStorageFee = async (length: string) => {
    if (FULL_TESTING) return "0x8fac6c0c2c1c50e029a75ff0df2bcb8b643e279f1c218f9c2074f2c28f65b8ac";
    // Pay for content storage on API side
    const CONTENT_COST = calculateARCost(Number(gigabyteCost), Number(length));
    const FINAL_CONTENT_COST = CONTENT_COST + EPISODE_SLIPPAGE; // to avoid rounding errors and a slippage change
    const uploadPaymentTX = await transferFunds("UPLOAD_CONTENT", FINAL_CONTENT_COST, EVERPAY_EOA_UPLOADS, address);
    return uploadPaymentTX;
  };

  const uploadEpisode = async (link: string, number: number): Promise<uploadEpisodeInter> => {
    if (FULL_TESTING) return { tx: 'WvUITx9o7ASiK1MHmsgXdWsy1xLTNYAoz_83dbW5r0o', number };

    try {
      const tx = (await axios.post('/api/arseed/upload-url', { url: link })).data.response;
      if (tx) return { tx, number };
      throw new Error("\n Reason: " + tx.status);
    } catch (error) {
      // TODO: call refund function
      console.error('Failed to upload url to arseeding: ', error);
      return { tx: '', number };
    };
  };

  const saveEpisodeToEXM = async (rssEpisode: rssEpisode, uploadPaymentTX: string) => {
    console.log('Uploading to EXM, ', rssEpisode);
    const handleErr = handleError;
    const { description, title, fileType } = rssEpisode;
    const percentPerEpisode = (100 / currentEpisodes.length);

    const uploadEpisodePayload: UploadEpisode = {
      "function": "addEpisode",
      "jwk_n": "",
      "pid": realPid,
      "name": title,
      "desc": "",
      "sig": "",
      "txid": "",
      "isVisible": true,
      "thumbnail": "",
      "content": uploadPaymentTX,
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

    // Pay Permacast's Episode Upload Fee
    const feeTX = await tryFeePayment(handleErr);
    console.log(feeTX);
    // @ts-ignore
    uploadEpisodePayload["txid"] = feeTX;

    const result = await axios.post('/api/exm/write', uploadEpisodePayload);
    setProgress(prev => prev + percentPerEpisode);
    console.log(result.data);
    return 'success';
  };

  const startEpisodesUpload = async () => {

    // Check Wallet Connection
    if (!checkConnection(arweaveAddress_)) {
      toast.error(CONNECT_WALLET, { style: TOAST_DARK })
      return false;
    };

    if (!userHasEnoughAR) {
      toast.error("Not enough AR to upload", { style: TOAST_DARK })
      return false;
    };

    setIsUploadingEpisodes(true);

    if (!realPid) {
      const attemptPid = await attemptIndexPodcastID();
      if (!attemptPid) {
        toast.error("Podcast not found, wait a little more before attempting download", { style: TOAST_DARK });
        console.log('FAILED TO DOWNLOAD: ', pid);
        setIsUploadingEpisodes(false);
        return false;
      };
    };
    
    const toastSaving = toast.loading("Downloading Episodes...", { style: TOAST_DARK, duration: 10000000 });

    const paymentTXes = [];
    for (let i = 0; i < currentEpisodes.length; i++) {
      if (FULL_TESTING) break;
      const tx = await payStorageFee(currentEpisodes[i].length);
      paymentTXes.push(tx);
      await sleep(1000);
    };
    console.log(currentEpisodes);

    const contentTXPromises = currentEpisodes.map((episode: rssEpisode, number: number) => uploadEpisode(episode.link, number));

    const contentTXResults = (
      await Promise.all(contentTXPromises)
    ).sort((a: uploadEpisodeInter, b: uploadEpisodeInter) => a.number - b.number);
    console.log(contentTXResults);
    toast.dismiss(toastSaving);
    const savingBlockchainToast = toast.loading(t("loadingToast.savingChain"), { style: TOAST_DARK, duration: 10000000 });

    const uploadedEpisodes = [];
    for (let i = 0; i < contentTXResults.length; i++) {
      const episode = contentTXResults[i];
      if (!episode.tx) {
        toast.dismiss(toastSaving);
        console.log('Failed to upload episode: ', episode);
        continue;
      }
      console.log({ currentEpisode: currentEpisodes[i], episode });
      if (FULL_TESTING) break;
      const EXMUpload = await saveEpisodeToEXM(currentEpisodes[i], episode.tx);
      uploadedEpisodes.push(EXMUpload);
    };
    console.log(uploadedEpisodes);

    setIsUploadingEpisodes(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
    RSSFeedManager.addValueToObject(realPid, JSON.stringify([...uploadedPages, currentPage]));

    let totalUploadedCount = uploadedCount + uploadedEpisodes.length;
    setUploadCount(totalUploadedCount);
    
    console.log(uploadedCount);
    toast.dismiss(savingBlockchainToast);
    console.log(currentPage);
    console.log(MAX_PAGES);
    setUploadedPages(prev => [...prev, currentPage]);
    if (currentPage === MAX_PAGES) {
      setCurrentPage(MAX_PAGES - 1);
    } else setCurrentPage(prev => prev + 1);

    if (totalUploadedCount >= rssEpisodes.length) {
      setTimeout(async function () {
        toast.success(t("success.showUploaded"), { style: TOAST_DARK })
        const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
        const { locale } = router;
        router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true })
      }, 3500);  
    };
  };

  const estimateUploadCost = async (episodes: rssEpisodeRetry[]): Promise<RSSEpisodeEstimate[]> => {
    const fileLinks = episodes.map(episode => episode.link);
    const sizes = (await axios.post('/api/rss/estimate-size', { fileLinks })).data;
    return sizes;
  };

  const startEstimating = async () => {
    const toastEstimating = toast.loading(t("loadingToast.estimating"), { style: TOAST_DARK, duration: 10000000 });
    setIsCalculating(true);
    try {
      const result = await estimateUploadCost(retryEpisodes);
      const nonZeroResults = result.filter((ep: RSSEpisodeEstimate) => Number(ep.size) > 0);
      if (nonZeroResults.length === 0) {
        toast.dismiss(toastEstimating);
        toast.error(t("errors.failedToEstimate"), { style: TOAST_DARK });
        setIsCalculating(false);
        return false;
      };
      const newEpisodes = retryEpisodes.map((episode: rssEpisodeRetry, index: number) => {
        const length = nonZeroResults.find((result) => result.link === episode.link);
        return {
          ...episode,
          length: length?.size || '0'
        };
      });
      setCurrentEpisodes(prev => [...prev, ...newEpisodes]);
      setIsCalculating(false);
      toast.dismiss(toastEstimating);  
    } catch (error) {
      setIsCalculating(false);
      toast.dismiss(toastEstimating);
    };
  };

  const RssEpisode: FC<RssEpisodeUI> = ({ title, length, gigabyteCost, number, uploaded }) => {
    const { t } = useTranslation();

    const size = getReadableSize(Number(length));
    const cost = (calculateARCost(Number(gigabyteCost), Number(length)) + EPISODE_SLIPPAGE).toFixed(2);

    return (
      <div className="bg-zinc-800 default-animation rounded-xl px-5 py-3 w-full text-white flex justify-between">
        <div className="line-clamp-2">{t("home.episode")} {number}: {title}</div>
        <div className="ml-4 flex gap-x-2">
          {uploaded ? <CheckIcon className="bg-green-500 rounded-full w-5 h-5 text-white shrink-0" /> : ""}
          <div>{size || ""}</div>
          <div>{cost || "?"} AR</div>
        </div>
      </div>
    );
  };

  //TODO:
  // 1. Cover needs 1:1 ratio
  // 2. Fix page number on big rss feeds (done!)
  // 3. Styles and text fixes
  // 4. Download episodes if size unavailable (WIP)
  // 5. Trigger balance update after upload

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
            {currentEpisodes.map((rssEpisode: rssEpisode, number: number) => (
              <React.Fragment key={number}>
                <RssEpisode
                  {...rssEpisode}
                  gigabyteCost={gigabyteCost}
                  number={number + uploadedCount + 1}
                  uploaded={uploadedPages.includes(currentPage)}
                />
              </React.Fragment>
            ))}
            {retryEpisodes?.length > 0 && (
              <>
                <div className="text-center my-2">{t("rss.estimation-failed")}</div>
                {retryEpisodes.map((rssEpisode: rssEpisode, number: number) => (
                  <React.Fragment key={number}>
                    <RssEpisode
                      {...rssEpisode}
                      gigabyteCost={gigabyteCost}
                      number={number + uploadedCount + 1}
                      uploaded={uploadedPages.includes(currentPage)}
                    />
                  </React.Fragment>
                ))}
                <Spacer y={1} />
                <div className="flexCenter justify-between">
                  <button className={buttonColorStyling + "py-3 px-4 "} onClick={() => startEstimating()}>
                    {isCalculating && (
                      <div style={{ color: DEFAULT_THEME_COLOR }}>
                        <Loading size="sm" color="currentColor" />
                      </div>
                    )}
                    <div className="">{t("rss.retry-estimation")}</div>
                    <Tooltip rounded color="invert" content={<div>{t("rss.limited-size")}</div>}>
                      <span className="ml-2 mt-[2.5px] tooltip-button">
                        ?
                      </span>
                    </Tooltip>
                  </button>
                  <button className={buttonColorStyling + "py-3 px-4 "} onClick={() => {
                    setRetryEpisodes([]);
                    setCurrentPage(prev => prev + 1);
                  }}>
                    {t("rss.skip-failed")}
                  </button>
                </div>
              </>
            )}
            <div className="text-center my-4">
              <div className="mb-2 font-medium">{uploadedCount} / {rssEpisodes?.length || 0} {t("rss.downloaded")}</div>
              <div className="flexFullCenterGap justify-center">
                {MAX_PAGES >= 1 && (
                  <button
                    className={buttonStyling}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1 || isCalculating}
                  >
                    <ChevronLeftIcon className="h-6 w-6 mr-1" />
                  </button>
                )}
                {MAX_PAGES >= 1 && Array.from(Array(MAX_PAGES).keys()).slice(0, 3).map((page: number) => (
                  <button
                    key={page}
                    className={buttonStyling}
                    onClick={() => setCurrentPage(page + 1)}
                    disabled={page === (currentPage - 1) || isCalculating}
                  >
                    {page + 1}
                  </button>
                ))}
                {/* Manual page input */}
                {MAX_PAGES >= 4 && (
                  <DebouncedInput 
                    className={buttonStyling + 'text-center font-bold '}
                    input={navigatePage}
                    setInput={setNavigatePage}
                    timeout={800}
                    disabled={isCalculating}
                    callback={(val) => {
                      const value = convertToValidNumber(val, 1);
                      if (value > 1 && value <= MAX_PAGES && value !== currentPage) {
                        setCurrentPage(value);
                      } else if (value === 1) {
                        setCurrentPage(1);
                      };
                    }}
                    placeholder={currentPage.toString()}
                  />
                )}
                {MAX_PAGES >= 5 && (
                  <button
                    className={buttonStyling}
                    onClick={() => setCurrentPage(MAX_PAGES)}
                    disabled={MAX_PAGES === currentPage || isCalculating}
                  >
                    {MAX_PAGES}
                  </button>                
                )}
                {MAX_PAGES >= 1 && (
                  <button
                    className={buttonStyling}
                    disabled={currentPage === MAX_PAGES || isCalculating}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRightIcon className="h-6 w-6 mr-1" />
                  </button>
                )}
                <button className={buttonStyling} onClick={() => {
                  setIsReverseOrder(prev => {
                    setCurrentEpisodes(prevEpisodes => prevEpisodes.reverse());
                    return !prev
                  });
                }}>
                  {isReverseOrder ? <ArrowUpIcon className="h-6 w-6" /> : <ArrowDownIcon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
          {/* Upload */}
          <div className="w-full flex justify-center items-center flex-col">
            {/*Show Upload Btn, Spinner, or Connect Btn*/}
            {address && address.length > 0 && !isUploadingEpisodes && (
              <>
                <UploadButton
                  disable={!userHasEnoughAR || isCalculating || !!retryEpisodes?.length || uploadedPages.includes(currentPage) }
                  width="w-[50%]"
                  click={startEpisodesUpload}
                />
                {!userHasEnoughAR && (
                  <p>{t("home.featured-modal.insufficient-balance")}</p>
                )}
              </>
            )}
            {address && address.length > 0 && isUploadingEpisodes && (
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
            <p className="mt-2 text-neutral-400">{t("uploadshow.uploadCost") + ": " + (Number(totalUploadCost)).toFixed(6) + " AR " + ``}</p>
          </div>
        </div>
        <div className="w-[25%]"></div>
      </div>
    </div>
  );
};


/*
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
*/

/*


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
*/




/*
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
    const retryEpisodeDownloadList = [];

    const maxEpisodes = rssEpisodes.slice(uploadedCount, uploadedCount + MAX_EPISODES_TO_UPLOAD_AT_ONCE);
    const rssLinks = maxEpisodes.filter((rssEpisode: rssEpisode) => !rssEpisode.length);
    if (!rssLinks.length) return maxEpisodes;
    const sizes = (await axios.post('/api/rss/get-headers', { rssLinks })).data.links;

    // splice rss episodes with content length
    const rssEpisodesFinal = maxEpisodes.map((rssEpisode: rssEpisode) => {
      const episode = sizes.find((ep: RssEpisodeContentLength) => ep.link === rssEpisode.link);
      if (!episode?.length) {
        retryEpisodeDownloadList.push(rssEpisode);
        return null;
      };
      return {
        ...rssEpisode,
        contentLength: episode?.length || '0'
      };
    }).filter((item: rssEpisode) => item !== null);
    setRetryEpisodes(retryEpisodeDownloadList);
    setCurrentEpisodes(rssEpisodesFinal);
    return rssEpisodesFinal;
  };
*/