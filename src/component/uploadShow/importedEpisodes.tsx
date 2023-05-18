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
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@nextui-org/react";
import { fetchARPriceInUSD } from "../../utils/redstone";
import { RSSFeedManager } from "../../utils/localstorage";

const ConnectButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.ConnectButton })));
const UploadButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.UploadButton })));

const RSS_TESTING_URL = "https://permacast-bloodstone-helper.herokuapp.com/feeds/rss/T7HWHKp-AjIj69TQRvV4EZRVTY1J8J9zSgE668aOmC4";
const FULL_TESTING = 1;
const MAX_EPISODES_TO_UPLOAD_AT_ONCE = 5;

// 1. Interfaces
interface ImportedEpisodesProps {
  pid: string;
  coverUrl: string;
  rssEpisodes: rssEpisode[];
  redirect?: boolean;
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
export const buttonStyling = `hover:bg-zinc-900 bg-zinc-700 disabled:zinc-900 text-white disabled:text-gray-300 rounded-lg h-8 w-8 flexFullCenter `;
// 3. Custom Functions

// 4. Components


// Rube Goldberg would be proud
export const ImportedEpisodes: FC<ImportedEpisodesProps> = ({ pid, rssEpisodes, coverUrl, redirect }) => {

  // hooks
  const { t } = useTranslation();
  const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
  const router = useRouter();
  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

  const [arweaveAddress_,] = useRecoilState(arweaveAddress);
  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [, _setLoadingPage] = useRecoilState(loadingPage)

  const [totalUploadCost, setTotalUploadCost] = useState<number>(0);
  const [gigabyteCost, setGigabyteCost] = useState<number>(0);
  const [arPrice, setArPrice] = useState<number>(0);
  const [userHasEnoughAR, setUserHasEnoughAR] = useState<boolean>(false);
  const [isUploadingEpisodes, setIsUploadingEpisodes] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const [isReverseOrder, setIsReverseOrder] = useState<boolean>(false);
  const [currentEpisodes, setCurrentEpisodes] = useState<rssEpisode[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [uploadedPages, setUploadedPages] = useState<number[]>([]);
  const [retryEpisodes, setRetryEpisodes] = useState<rssEpisodeRetry[]>([]);
  const [uploadedCount, setUploadCount] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  const MAX_PAGES = Math.floor(rssEpisodes.length / MAX_EPISODES_TO_UPLOAD_AT_ONCE) + 1;

  useEffect(() => {
    const savedPIDpages = RSSFeedManager.getValueFromObject(pid);
    console.log(savedPIDpages);
    if (savedPIDpages) setUploadedPages(JSON.parse(savedPIDpages));
  }, []);

  useEffect(() => {
    setCurrentEpisodes(prev => prev.reverse());
  }, [isReverseOrder]);

  useEffect(() => {

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
      setIsCalculating(true);
      fetchARPriceInUSD().then(setArPrice);
      await fetchCover();
      await fetchGigabyteCosts().then(setGigabyteCost);
      const index = MAX_EPISODES_TO_UPLOAD_AT_ONCE * currentPage;
      const nextEpisodes = rssEpisodes.slice(
        currentPage === 1 ? 0 : MAX_EPISODES_TO_UPLOAD_AT_ONCE * (currentPage - 1),
        currentPage === 1 ? index : MAX_EPISODES_TO_UPLOAD_AT_ONCE + index
      );
      console.log(index);
      await calculateTotalAndSetEpisodes(nextEpisodes);
      setIsCalculating(false);
    };
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

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      "pid": pid,
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

    setIsUploadingEpisodes(true);

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
    RSSFeedManager.addValueToObject(pid, JSON.stringify([...uploadedPages, currentPage]));

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

  const RssEpisode: FC<RssEpisodeUI> = ({ title, length, gigabyteCost, number, uploaded }) => {
    const { t } = useTranslation();

    const size = getReadableSize(Number(length));
    const cost = (calculateARCost(Number(gigabyteCost), Number(length)) + EPISODE_SLIPPAGE).toFixed(2);

    return (
      <div className="bg-zinc-800 default-animation rounded-xl px-5 py-3 w-full text-white flex justify-between">
        <div className="line-clamp-2">{t("home.episode")} {number}: {title}</div>
        <div className="ml-4 flex gap-x-2">
          {uploaded ? <CheckIcon className="bg-green-500 rounded-full w-5 h-5 text-white" /> : ""}
          <div>{size || ""}</div>
          <div>{cost || "?"} AR</div>
        </div>
      </div>
    );
  };

  //TODO:
  // 1. Start uploading episodes from the last point if the upload fails
  // 4. Styles and text fixes
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
                <div className="text-center my-2">{t("home.estimation-failed")}</div>
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
                <button className="flexCenter gap-x-2" onClick={() => null}>
                  {t("home.retry-estimation")}
                  <Tooltip rounded color="invert" content={<div>{t("downloads are limited to 100mbs to prevent app crashes")}</div>}>
                    <span className="ml-2 mt-[2.5px] tooltip-button">
                      ?
                    </span>
                  </Tooltip>
                </button>
              </>
            )}
            <div className="text-center my-4 w-full">
              <div className="mb-2 font-medium">{uploadedCount} / {rssEpisodes.length} {t("downloaded")}</div>
              <div className="flexFullCenterGap justify-center">
                {MAX_PAGES >= 1 && (
                  <button
                    className={buttonStyling}
                    disabled={currentPage === 1 || isCalculating}
                  >
                    <ChevronLeftIcon className="h-6 w-6 mr-1" />
                  </button>
                )}
                {MAX_PAGES >= 1 && Array.from(Array(MAX_PAGES).keys()).slice(0, 4).map((page: number) => (
                  <button
                    key={page}
                    className={buttonStyling}
                    onClick={() => setCurrentPage(page + 1)}
                    disabled={page === 1 + currentPage || isCalculating}
                  >
                    {page + 1}
                  </button>
                ))}
                {MAX_PAGES >= 4 && (
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
                <button className={buttonStyling} onClick={() => setIsReverseOrder(prev => !prev)}>
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
                  disable={!userHasEnoughAR || isCalculating || uploadedPages.includes(currentPage) }
                  width="w-[50%]"
                  click={startEpisodesUpload}
                />
                {!userHasEnoughAR && (
                  <p>{t("home.insufficient-balance")}</p>
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