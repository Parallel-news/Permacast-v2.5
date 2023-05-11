import axios from "axios";
import Everpay, { ChainType } from "everpay";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import toast from "react-hot-toast"
import { useRecoilState } from "recoil";

import { episodeDescStyling, episodeNameStyling } from "../uploadEpisode/uploadEpisodeTools";
import { categories_en } from "../../utils/languages";

import { ARSEED_URL, AR_DECIMALS, CONNECT_WALLET, EPISODE_UPLOAD_FEE, EVERPAY_AR_TAG, EVERPAY_EOA, EVERPAY_EOA_UPLOADS, GIGABYTE, MIN_UPLOAD_PAYMENT, PODCAST_AUTHOR_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_DESC_MAX_LEN, PODCAST_DESC_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_NAME_MIN_LEN, SPINNER_COLOR, TOAST_DARK, TOAST_MARGIN, USER_SIG_MESSAGES } from "../../constants";
import { isValidEmail } from "../reusables/formTools";
import { getBundleArFee, upload2DMedia, upload3DMedia } from "../../utils/arseeding";
import { createFileFromBlobUrl, minifyPodcastCover, createFileFromBlob } from "../../utils/fileTools";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { allFieldsFilled, byteSize, checkConnection, determineMediaType, handleError, validateLabel } from "../../utils/reusables";
import { arweaveAddress, loadingPage, podcastColorAtom } from "../../atoms";

import { Podcast, rssEpisode } from "../../interfaces";

import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import ProgressBar from "../reusables/progressBar";
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
}

// 2. Stylings
export const spinnerClass = "w-full flex justify-center mt-4"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-2"
export const descContainerStyling = "w-[100%] h-32 rounded-xl bg-zinc-800 flex flex-row justify-start items-start focus-within:ring-white focus-within:ring-2"

// 3. Custom Functions

// 4. Components
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

      const CONTENT_COST = Number(gigabyteCost) * (Number(contentLength) / GIGABYTE);
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
              <div className="w-40 text-white">
                {rssEpisode.title}
              </div>
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
  )
}


/*
  useEffect(() => {
    const fetchData = async () => {
      if (!podcastCover_) return;
      const dominantColor = await fetchDominantColor(podcastCover_, false, false);
      if (dominantColor.error) return;
      const [coverColor, _] = getCoverColorScheme(dominantColor.rgba);
      setPodcastColor(coverColor);
    };
    fetchData();
  }, [podcastCover_]);

  // Hook Calculating Upload Cost
  useEffect(() => {
    setUploadCost(0)

    async function calculateTotal() {
      const descBytes = byteSize(podcastDescription_)
      const convertedCover = await createFileFromBlobUrl(podcastCover_, "cov.txt");
      const minCover = await minifyPodcastCover(podcastCover_);
      const fileMini = createFileFromBlob(minCover, "miniCov.jpeg");

      const descFee = await getBundleArFee(String(descBytes))
      const coverFee = await getBundleArFee(String(convertedCover.size))
      const miniFee = await getBundleArFee(String(fileMini.size))

      return Number(descFee) + Number(coverFee) + Number(miniFee)
    }
    if (podcastDescription_.length > 0 && podcastCover_ !== null) {
      calculateTotal().then(async total => {
        const formattedTotal = total / AR_DECIMALS  
        setUploadCost(props.edit ? formattedTotal : formattedTotal + MIN_UPLOAD_PAYMENT)
      })
    } else {
      setUploadCost(0)
    }
  }, [podcastDescription_, podcastCover_])


  async function uploadEpisodes(uploadEpisodePayload: any) {
  }

  // Inserts Editting Info
  useEffect(() => {
    if (props.edit && props.rssData.length === 0) {
      const restoreSavedData = async () => {
        console.log("Edit capability executed")
        const podcast = props.podcasts.filter((podcast,) => podcast.pid === props.selectedPid)
        const p = podcast[0]
        //Set all state variables
        setPodcastName_(p.podcastName)
        const description = (await axios.get(ARSEED_URL + p.description)).data;
        setPodcastDescription_(description)
        setPodcastAuthor_(p.author)
        setPodcastEmail_(p.email)

        //Recreate Cover for Upload
        setCoverUrl(p.cover)
        fetch(ARSEED_URL + p.cover)
          .then((rs) => rs.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setPodcastCover_(url);
          });
        setPodcastLanguage_(p.language)
        setPodcastCategory_(categories_en.findIndex(cat => cat === p.categories[0]))
        setPodcastExplicit_(p.explicit === "no" ? false : true)
        setPodcastLabel_(p.label ? p.label : "")
        _setLoadingPage(false)
      }
      restoreSavedData()
      //loading modal NEEDED
    } else {
      _setLoadingPage(false)
    }
  }, [])

  // Inserts Editting Info
  useEffect(() => {
    if (props.rssData.length > 0) {
      const restoreSavedData = async () => {
        const p = props.rssData[0]
        //Set all state variables
        setPodcastName_(p.podcastName)
        setPodcastDescription_(p.description)
        setPodcastAuthor_(p.author)

        //Recreate Cover for Upload
        setCoverUrl(p.cover)
        fetch(p.cover)
          .then((rs) => rs.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setPodcastCover_(url);
          });
        setPodcastLanguage_(p.language)
        setPodcastCategory_(categories_en.findIndex(cat => cat === p.categories[0]))
        setPodcastExplicit_(p.explicit === "no" ? false : true)
        _setLoadingPage(false)
      }
      restoreSavedData()
    } else {
      _setLoadingPage(false)
    }
  }, [])

*/