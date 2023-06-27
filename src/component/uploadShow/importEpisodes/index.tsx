import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react"

import toast from "react-hot-toast"
import { useRecoilState } from "recoil";

import useCrossChainAuth from '@/hooks/useCrossChainAuth';

import { loadingPage, podcastColorAtom } from "@/atoms/index";
import { CONNECT_WALLET, EPISODE_UPLOAD_FEE, EVERPAY_EOA, TOAST_DARK, USER_SIG_MESSAGES, EPISODE_SLIPPAGE, ERROR_TOAST_TIME, PERMA_TOAST_SETTINGS, EXTENDED_TOAST_TIME, SPINNER_COLOR, MAX_EPISODES_TO_UPLOAD_AT_ONCE } from "@/constants/index";
import { DEFAULT_THEME_COLOR } from "@/constants/ui";

import { upload2DMedia } from "@/utils/arseeding";
import { attemptIndexPodcastID } from '@/utils/filters';
import { checkConnection, determineMediaType, handleError } from "@/utils/reusables";
import { fetchDominantColor, getCoverColorScheme, sleep } from "@/utils/ui";
import { transferFunds, refetchEverpayARBalance, getEverpayARBalance, payStorageFee } from "@/utils/everpay";


import { rssEpisode, RSSEpisodeEstimate } from "@/interfaces/rss";
import { UploadEpisodeProps } from "@/interfaces/exm";

import { getPodcastData } from '@/features/prefetching';

// import { fetchARPriceInUSD } from "@/utils/redstone";
import { estimateUploadCost, fetchEpisodeSizes } from "@/utils/fileTools";
import { RSSFeedManager } from "@/utils/localstorage";
import { getGigabyteCost, calculateSizeCost } from "@/utils/arseeding";

import { ImgCover } from '@/component/uploadShow/reusables';
import { Icon } from '@/component/icon';
import { PermaSpinner } from '@/component/reusables';
import { ProgressBar } from '@/component/progressBar';
import { ConnectButton } from '@/component/uploadEpisode/reusables';
import { UploadButton } from '@/component/uploadEpisode/reusables';
import Pagination from '@/component/reusables/Pagination';
import CommonTooltip from '@/component/reusables/tooltip';
import EpisodesList from './components/episodesList';
import Spinner from "@/component/reusables/spinner";


// 1. Interfaces
interface ImportedEpisodesProps {
  pid: string;
  RSSLink: string;
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


// 2. Stylings
const spinnerClass = "w-full flexXCcenter mt-4"
const showFormStyling = "w-full flexColFullCenter space-y-2 pb-20"
const descContainerStyling = "w-[100%] h-32 rounded-xl bg-zinc-800 flex justify-start items-start focus-within:ring-white focus-within:ring-2"
const buttonBaseColorStyling = `bg-zinc-800 hover:bg-zinc-600 default-animation disabled:hover:bg-black disabled:bg-black text-white disabled:text-gray-500 flexFullCenter gap-x-1 rounded-lg `;
const buttonStyling = buttonBaseColorStyling + `h-10 w-10 `;

// 3. Custom Functions

// Rube Goldberg would be proud
function ImportedEpisodes({ pid, RSSLink, rssEpisodes, coverUrl, index, redirect }: ImportedEpisodesProps) {

  // hooks
  const { t } = useTranslation();
  const router = useRouter();
  const { walletConnected, address, nameService: ANS, getPublicKey, packageEXM } = useCrossChainAuth();

  const podcastQuery = getPodcastData();
  const { data: GIGABYTE_COST } = getGigabyteCost();
  const balanceQuery = getEverpayARBalance(address);
  const userBalance = Number(balanceQuery.data || 0);
  console.log('userBalance', userBalance)

  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [, _setLoadingPage] = useRecoilState(loadingPage);

  const [realPid, setRealPid] = useState<string>('');
  const [totalUploadCost, setTotalUploadCost] = useState<number>(0);

  const [isUploadingEpisodes, setIsUploadingEpisodes] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const [isReverseOrder, setIsReverseOrder] = useState<boolean>(false);
  const [currentEpisodes, setCurrentEpisodes] = useState<rssEpisode[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [uploadedEpisodesLinks, setUploadedEpisodesLinks] = useState<string[]>([]);
  const [retryEpisodes, setRetryEpisodes] = useState<rssEpisode[]>([]);
  const [uploadedCount, setUploadCount] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  const MAX_PAGES = Math.floor((rssEpisodes?.length || 0) / MAX_EPISODES_TO_UPLOAD_AT_ONCE);
  
  const fetchCoverColor = async () => {
    if (!coverUrl) return;
    const dominantColor = await fetchDominantColor(coverUrl, false, false);
    if (dominantColor.error) return;
    const [coverColor, _] = getCoverColorScheme(dominantColor.rgba);
    setPodcastColor(coverColor);
  };

  const calculateTotalAndSetEpisodes = async (episodes: rssEpisode[]) => {
    const { knownEpisodeSizes, unknownEpisodeSizes } = await fetchEpisodeSizes(episodes);
    console.log('knownEpisodeSizes', knownEpisodeSizes)
    console.log('unknownEpisodeSizes', unknownEpisodeSizes)
    setCurrentEpisodes(knownEpisodeSizes);
    setRetryEpisodes(unknownEpisodeSizes);
    const total = knownEpisodeSizes.map((rssEpisode: rssEpisode) =>
      calculateSizeCost(GIGABYTE_COST, Number(rssEpisode.length)) + EPISODE_SLIPPAGE
    );
    console.log('total', total)
    const totalCost = total.reduce((a, b) => a + b, 0);
    console.log('totalCost', totalCost)
    setTotalUploadCost(totalCost);
  };

  const asyncs = async () => {
    if (!rssEpisodes) return;
    setIsCalculating(true);
    await fetchCoverColor();

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
    const asyncFn = async () => {
      if (!realPid) {
        const result = await attemptIndexPodcastID(index, pid);
        setRealPid(result);
      };
      const savedEpisodeLinksValue = RSSFeedManager.getValueFromObject(realPid + '/' + RSSLink);
      console.log('savedEpisodeLinksValue', savedEpisodeLinksValue);
      if (savedEpisodeLinksValue) {
        const parsedLinks = JSON.parse(savedEpisodeLinksValue);
        setUploadedEpisodesLinks(parsedLinks);
        setUploadCount(parsedLinks.length);
        setCurrentPage(Math.ceil(parsedLinks.length / MAX_EPISODES_TO_UPLOAD_AT_ONCE) + 1);
      } else {
        RSSFeedManager.addValueToObject(realPid + '/' + RSSLink, JSON.stringify([]));
        setUploadedEpisodesLinks([]);
        setUploadCount(0);
      };
    };
    asyncFn();
  }, [realPid, podcastQuery.data]);

  useEffect(() => {
    if (GIGABYTE_COST) asyncs();
  }, [currentPage, GIGABYTE_COST]);

  const tryDescriptionUpload = async (description: string) => {
    try {
      const descriptionTX = await upload2DMedia(description);
      const tx = descriptionTX?.order?.itemId || '';
      return tx;
    } catch (e) {
      console.log(e);
      return '';
    };
  };

  const tryFeePayment = async () => {
    try {
      const tx = await transferFunds("UPLOAD_EPISODE_FEE", EPISODE_UPLOAD_FEE, EVERPAY_EOA, address);
      //@ts-ignore - refusing to acknowledge everHash
      const everHash = tx[1].everHash;
      return everHash;
    } catch (e) {
      console.log(e);
      return;
    };
  };

  const uploadEpisode = async (link: string, number: number): Promise<uploadEpisodeInter> => {
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

  const saveEpisodeToEXM = async (rssEpisode: rssEpisode, uploadPaymentTX: string, count: number) => {
    console.log('Uploading to EXM, ', rssEpisode);
    const { link, description, title, fileType } = rssEpisode;
    const percentPerEpisode = (100 / currentEpisodes.length);

    const uploadEpisodePayload: UploadEpisodeProps = {
      "function": "addEpisode",
      "jwk_n": "",
      "pid": realPid,
      "name": title,
      "desc": "",
      "sig": "",
      "txid": "",
      "isVisible": "yes",
      "thumbnail": "",
      "content": uploadPaymentTX,
      "mimeType": determineMediaType(fileType),
    };

    // Description to Arseeding
    const descriptionTx = await tryDescriptionUpload(description);
    console.log(descriptionTx);
    // @ts-ignore
    uploadEpisodePayload["desc"] = descriptionTx;

    // Pay Permacast's Episode Upload Fee
    const feeTX = await tryFeePayment();
    console.log(feeTX);
    // @ts-ignore
    uploadEpisodePayload["txid"] = feeTX;

    const finalPayload = await packageEXM(uploadEpisodePayload, USER_SIG_MESSAGES[0] + await getPublicKey());

    try {
      const result = await axios.post('/api/exm/write', finalPayload);
      console.log('write result: ', result.data);
      // we need to save the episode link to the RSSFeedManager
      // the key is podcast's PID + RSSLink
      // the value is an array of all the already uploaded episode links
      const prev = JSON.parse(RSSFeedManager.getValueFromObject(realPid + '/' + RSSLink));
      const newList = [...prev, link];
      RSSFeedManager.addValueToObject(realPid + '/' + RSSLink, JSON.stringify(newList));
      setUploadedEpisodesLinks(newList);
      setUploadCount(prev => prev + 1);
    } catch (e) {
      console.log('error: ', e);
      return '';
    };
    setProgress(prev => prev + percentPerEpisode);
    return link;
  };

  const startEpisodesUpload = async () => {

    // Check Wallet Connection
    if (!checkConnection(address)) {
      toast.error(CONNECT_WALLET, PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
      return false;
    };

    if (userBalance < totalUploadCost) {
      toast.error("Not enough AR to upload", PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
      return false;
    };

    setIsUploadingEpisodes(true);

    // EXM sometimes returns fake PID and that will cause issues
    // This fix guarantees to get the real PID
    if (!realPid) {
      const attemptPid = await attemptIndexPodcastID(index, pid);
      if (!attemptPid) {
        toast.error("Podcast not found, wait a little and try again", { style: TOAST_DARK });
        console.log('FAILED TO DOWNLOAD: ', pid);
        setIsUploadingEpisodes(false);
        return false;
      };
    };

    const toastSaving = toast.loading("Downloading Episodes...", PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));

    const paymentTXes = [];
    for (let i = 0; i < currentEpisodes.length; i++) {
      const tx = await payStorageFee(Number(currentEpisodes[i].length), i, address);
      paymentTXes.push(tx);
      await sleep(1000);
    };
    console.log('currentEpisodes', currentEpisodes);

    const contentTXPromises = currentEpisodes.map((episode: rssEpisode, number: number) => uploadEpisode(episode.link, number));

    const contentTXResults = (
      await Promise.all(contentTXPromises)
    ).sort((a: uploadEpisodeInter, b: uploadEpisodeInter) => a.number - b.number);
    console.log('contentTXResults', contentTXResults);
    toast.dismiss(toastSaving);
    const savingBlockchainToast = toast.loading(t("loadingToast.savingChain"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));

    const uploadedEpisodesLinks = [];
    for (let i = 0; i < contentTXResults.length; i++) {
      const episode = contentTXResults[i];
      if (!episode.tx) {
        toast.dismiss(toastSaving);
        console.log('Failed to upload episode: ', episode);
        continue;
      };
      console.log({ currentEpisode: currentEpisodes[i], episode });
      const EXMUpload = await saveEpisodeToEXM(currentEpisodes[i], episode.tx, i);
      uploadedEpisodesLinks.push(EXMUpload);
      await sleep(100);
    };
    console.log(uploadedEpisodesLinks);

    setIsUploadingEpisodes(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);

    let totalUploadedCount = uploadedCount + uploadedEpisodesLinks.length;
    // setUploadCount(totalUploadedCount);

    console.log(uploadedCount);
    toast.dismiss(savingBlockchainToast);
    console.log(currentPage);
    console.log(MAX_PAGES);

    if (currentPage === MAX_PAGES) {
      setCurrentPage(MAX_PAGES - 1);
    } else setCurrentPage(prev => prev + 1);

    if (totalUploadedCount >= rssEpisodes.length) {
      setTimeout(async function () {
        toast.success(t("success.showUploaded"), PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME));
        const identifier = ANS?.currentLabel ? ANS?.currentLabel : address;
        const { locale } = router;
        router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true });
      }, 3500);
    };
  };

  const startEstimating = async () => {
    const toastEstimating = toast.loading(t("loadingToast.estimating"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
    setIsCalculating(true);
    try {
      const result = await estimateUploadCost(retryEpisodes);
      const nonZeroResults = result.filter((ep: RSSEpisodeEstimate) => Number(ep.size) > 0);
      if (nonZeroResults.length === 0) {
        toast.dismiss(toastEstimating);
        toast.error(t("errors.failedToEstimate"), PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME));
        setIsCalculating(false);
        return false;
      };
      const newEpisodes = retryEpisodes.map((episode: rssEpisode, index: number) => {
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

  //TODO:
  // Trigger balance update after upload

  const EstimateUploadButton = () => (
    <button className={buttonBaseColorStyling + "py-3 px-4 "} onClick={() => startEstimating()}>
      {isCalculating && (
        <div style={{ color: DEFAULT_THEME_COLOR }}>
          <PermaSpinner
            spinnerColor={SPINNER_COLOR}
            size={5}
          />
        </div>
      )}
      <div className="text-bold">{t("rss.retry-estimation")}</div>
      <CommonTooltip
        id="rssSizeTip"
        tooltipClass="helper-tooltip-inherit-color w-5 h-5"
        tooltipJSX={t("rss.limited-size")}
      />
    </button>
  );

  const SkipEpisodesDownloadButton = () => (
    <button
      className={buttonBaseColorStyling + "py-3 px-4 "}
      disabled={currentPage === MAX_PAGES}
      onClick={() => {
        setRetryEpisodes([]);
        setCurrentPage(prev => prev + 1);
      }
    }>
      {t("rss.skip-failed")}
      <Icon strokeWidth="1.5" icon="CHEVRON_DOUBLE_RIGHT" />
    </button>
  );

  const RetryEpisodesComponent = () => {
    if (!retryEpisodes?.length) return <></>;
    return (
      <>
        <EpisodesList
          {...{ uploadedCount, episodes: retryEpisodes, uploadedEpisodesLinks }}
        />
        <div className="flexCenter justify-between mt-2">
          <EstimateUploadButton />
          <SkipEpisodesDownloadButton />
        </div>
      </>
    );
  };

  const ReverseOrderButton = () => {
    if (!currentEpisodes?.length && currentEpisodes.length < 2) return <></>;
    return (
      <button className={buttonStyling} onClick={() => {
        setIsReverseOrder(prev => {
          setCurrentEpisodes(prevEpisodes => prevEpisodes.reverse());
          return !prev
        });
      }}>
        <Icon className="h-6 w-6" icon={isReverseOrder ? "ARROWUP" : "ARROWDOWN"} />
      </button>
    );
  };

  const Progress = () => {
    if (!isUploadingEpisodes) return <></>;
    return (
      <ProgressBar
        progress={String(progress)}
        colorHex="#FFFF00"
      />
    );
  };

  const LoadingSpinner = () => (
    <div className="text-zinc-700 flexFullCenter w-full h-60">
      <Spinner />
    </div>
  );

  const TotalCost = () => (
    <p className="mt-2 text-zinc-300">{t("uploadshow.uploadCost") + ": " + (Number(totalUploadCost)).toFixed(6) + " AR"}</p>
  );

  useEffect(() => {
    console.log("userBalance:", userBalance);
    console.log("totalUploadCost:", totalUploadCost);
    console.log("isCalculating:", isCalculating);
    console.log("retryEpisodes:", retryEpisodes);
    console.log("balanceQuery.isLoading:", balanceQuery.isLoading);
  }, [userBalance, totalUploadCost, isCalculating, retryEpisodes, balanceQuery.isLoading])

  return (
    <div className={showFormStyling}>
      {/*First Row*/}
      <div className="flexColFullCenter lg:items-start lg:flex-row w-full">
        {/*Cover*/}
        <div className="w-[25%] flexXCenter mb-4 lg:mb-0">
          <ImgCover img={coverUrl} />
        </div>
        <div className="flexCol w-[95%] md:w-[75%] lg:w-[50%] space-y-3">
          {/* Preview */}
          <div className="flexCol gap-y-2">
            {isCalculating ? (<LoadingSpinner />) : (
              <>
                <EpisodesList {...{ uploadedCount, uploadedEpisodesLinks, episodes: currentEpisodes }} />
                <RetryEpisodesComponent />
              </>
            )}
            <div className="text-center mt-4 mb-2 font-medium">{uploadedCount} / {rssEpisodes?.length || 0} {t("rss.downloaded")}</div>
            <Pagination
              currentPage={currentPage}
              totalPages={MAX_PAGES}
              setCurrentPage={setCurrentPage}
              limitPagination={3}
              extraJSX={<ReverseOrderButton />}
            />
          </div>
          {/* Upload */}
          <div className="w-full flexColFullCenter">
          <div className="w-full flexColFullCenter">
            {walletConnected && !isUploadingEpisodes && (
              <>
                <UploadButton
                  disable={Number(userBalance) < totalUploadCost || isCalculating || !!retryEpisodes?.length || balanceQuery.isLoading}
                  width="w-[50%]"
                  click={startEpisodesUpload}
                />
                {Number(userBalance) < totalUploadCost && (
                  <p>{t("home.featured-modal.insufficient-balance")}</p>
                )}
              </>
            )}
            <ConnectButton className="w-[75%] md:w-[50%]" />
          </div>

            <Progress />
            <TotalCost />
          </div>
        </div>
        <div className="w-[25%] "></div>
      </div>
    </div>
  );
};

export default ImportedEpisodes;