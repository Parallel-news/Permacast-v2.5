import axios from "axios";
import Everpay, { ChainType } from "everpay";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import toast from "react-hot-toast"
import { useRecoilState } from "recoil";

import { VisibleInput } from "./reusables";
import { episodeDescStyling, episodeNameStyling } from "../uploadEpisode/uploadEpisodeTools";
import { categories_en } from "@/utils/languages";

import { ARSEED_URL, AR_DECIMALS, CONNECT_WALLET, ERROR_TOAST_TIME, EVERPAY_AR_TAG, EVERPAY_EOA, EXTENDED_TOAST_TIME, GIGABYTE, MIN_UPLOAD_PAYMENT, PERMA_TOAST_SETTINGS, PODCAST_AUTHOR_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_DESC_MAX_LEN, PODCAST_DESC_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_NAME_MIN_LEN, SPINNER_COLOR, TOAST_DARK, USER_SIG_MESSAGES } from "@/constants/index";
import { calculateARCost, getBundleArFee, upload2DMedia, upload3DMedia } from "@/utils/arseeding";
import { createFileFromBlobUrl, minifyPodcastCover, createFileFromBlob } from "@/utils/fileTools";
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { allFieldsFilled, byteSize, checkConnection, handleError, validateLabel } from "../../utils/reusables";
import { loadingPage, podcastColorAtom } from "../../atoms";

import { Podcast } from "../../interfaces";
import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import { ProgressBar } from "../progressBar";
import { EditPodcastProps, UploadPodcastProps } from "../../interfaces/exm";
import { handleValMsg } from "@/utils/validation/podcast";

const MarkDownToolTip = React.lazy(() => import("../reusables/tooltip").then(module => ({ default: module.MarkDownToolTip })));
const CoverContainer = React.lazy(() => import("./reusables").then(module => ({ default: module.CoverContainer })));
const ExplicitInput = React.lazy(() => import("./reusables").then(module => ({ default: module.ExplicitInput })));
const SelectDropdownRow = React.lazy(() => import("./reusables").then(module => ({ default: module.SelectDropdownRow })));
const ConnectButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.ConnectButton })));
const UploadButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.UploadButton })));
const ValMsg = React.lazy(() => import("../reusables/formTools").then(module => ({ default: module.ValMsg })))
const SelectPodcast = React.lazy(() => import("../../component/uploadEpisode/reusables").then(module => ({ default: module.SelectPodcast })));

// 1. Interfaces
interface ShowFormInter {
    podcasts: Podcast[];
    edit: boolean;
    redirect: boolean;
    //optional
    allowSelect?: boolean;
    selectedPid?: string;
    rssData?: Podcast[];
    submitted?: Dispatch<SetStateAction<boolean>>;
    returnedPodcasts?: Dispatch<SetStateAction<Podcast[]>>;
    setUploadedPID?: Dispatch<SetStateAction<string>>;
    // tempfix
    setUploadedIndex?: Dispatch<SetStateAction<number>>;
}

// 2. Stylings
const showFormStyling = "w-full flexColFullCenter space-y-2"
const descContainerStyling = "w-[100%] h-32 rounded-xl bg-zinc-800 flex justify-start items-start focus-within:ring-white focus-within:ring-2 default-animation "

// 3. Custom Functions

// 4. Components
export const ShowForm = (props: ShowFormInter) => {

    // hooks
    const { t } = useTranslation();
    const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
    const [submittingShow, setSubmittingShow] = useState<boolean>(false);
    const [arseedCostPerGig, setArseedCostPerGig] = useState<number>(0);
    const [uploadCost, setUploadCost] = useState<number>(0);
    const router = useRouter();

    // inputs
    const [podcastDescription_, setPodcastDescription_] = useState("");
    const [podcastAuthor_, setPodcastAuthor_] = useState("");
    const [podcastEmail_, setPodcastEmail_] = useState("");
    const [podcastCategory_, setPodcastCategory_] = useState<number>(0);
    const [podcastName_, setPodcastName_] = useState("");
    const [podcastCover_, setPodcastCover_] = useState(null);
    const [coverUrl, setCoverUrl] = useState<string>("")
    const [podcastLanguage_, setPodcastLanguage_] = useState('en');
    const [podcastExplicit_, setPodcastExplicit_] = useState(false);
    const [podcastLabel_, setPodcastLabel_] = useState("");
    const [isVisible, setIsVisible] = useState<string>("yes")

    // Validations
    const [podNameMsg, setPodNameMsg] = useState("");
    const [podDescMsg, setPodDescMsg] = useState("");
    const [podAuthMsg, setPodAuthMsg] = useState("");
    const [podEmailMsg, setPodEmailMsg] = useState("");
    const [labelMsg, setLabelMsg] = useState("");
    const [progress, setProgress] = useState(0)
    const [, _setLoadingPage] = useRecoilState(loadingPage)
    const validationObject = {
        "nameError": podNameMsg.length === 0,
        "descError": podDescMsg.length === 0,
        "authError": podAuthMsg.length === 0,
        "emailError": podEmailMsg.length === 0,
        "labelError": labelMsg.length === 0,
        "name": podcastName_.length > 0,
        "desc": podcastDescription_.length > 0,
        "auth": podcastAuthor_.length > 0,
        "email": podcastEmail_.length > 0,
        "lang": podcastLanguage_.length > 0,
        "cat": true, // default is 0 which always defaults to Arts
        "cover": podcastCover_ !== null
    };

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

    useEffect(() => {getBundleArFee(String(GIGABYTE)).then(setArseedCostPerGig)}, []);

    // Hook Calculating Upload Cost
    useEffect(() => {
        setUploadCost(0);

        async function calculateTotal() {
            const descBytes = byteSize(podcastDescription_)
            const convertedCover = await createFileFromBlobUrl(podcastCover_, "cov.txt");
            const minCover = await minifyPodcastCover(podcastCover_);
            const fileMini = createFileFromBlob(minCover, "miniCov.jpeg");

            const descFee = calculateARCost(arseedCostPerGig, descBytes);
            const coverFee =  calculateARCost(arseedCostPerGig, convertedCover.size);
            const miniFee = calculateARCost(arseedCostPerGig, fileMini.size);

            return descFee + coverFee + miniFee;
        }
        if (podcastDescription_.length > 0 && podcastCover_ !== null) {
            calculateTotal().then(async total => {
                const formattedTotal = total / AR_DECIMALS
                setUploadCost(props.edit ? formattedTotal : formattedTotal + MIN_UPLOAD_PAYMENT)
            })
        } else {
            setUploadCost(0)
        }
    }, [podcastDescription_, podcastCover_, coverUrl])

    //EXM 
    const createShowPayload: UploadPodcastProps | EditPodcastProps = {
        "function": (props.edit && props.rssData.length === 0) ? "editPodcastMetadata" : "createPodcast",
        "parsed": true, // To receive data parsed as json
        "name": podcastName_,
        "desc": "",
        "author": podcastAuthor_,
        "lang": podcastLanguage_,
        "isExplicit": podcastExplicit_ ? "yes" : "no",
        "categories": categories_en[podcastCategory_],
        "email": podcastEmail_,
        "cover": podcastCover_,
        "minifiedCover": "",
        "label": podcastLabel_,
        "jwk_n": "",
        "txid": "",
        "sig": "",
        "isVisible": isVisible,
        "pid": props.edit ? props.selectedPid : ""
    }

    async function submitShow(payloadObj: any) {
        // Check Connection
        console.log()
        if (!checkConnection(address)) {
            toast.error(CONNECT_WALLET, PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
            return false
        }

        setSubmittingShow(true)

        const handleErr = handleError
        // Package EXM Call

        const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + await getPublicKey());
        payloadObj["sig"] = await createSignature(data, defaultSignatureParams, "base64");
        payloadObj["jwk_n"] = await getPublicKey()
        // Description to Arseeding
        const toastDesc = toast.loading(t("loadingToast.savingDesc"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
        setProgress(props.edit ? 25 : 20)
        try {
            const description = await upload2DMedia(podcastDescription_); payloadObj["desc"] = description?.order?.itemId
            toast.dismiss(toastDesc);
        } catch (e) {
            toast.dismiss(toastDesc);
            console.log(e); handleErr(t("errors.descUploadError"), setSubmittingShow); return;
        }

        // Covers to Arseeding
        const toastCover = toast.loading(t("loadingToast.savingCover"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
        setProgress(props.edit ? 50 : 40)
        try {
            const convertedCover = await createFileFromBlobUrl(podcastCover_, "cov.txt")
            const cover = await upload3DMedia(convertedCover, convertedCover.type); payloadObj["cover"] = cover?.order?.itemId
            const minCover = await minifyPodcastCover(podcastCover_); const fileMini = createFileFromBlob(minCover, "miniCov.jpeg");
            const miniCover = await upload3DMedia(fileMini, fileMini.type); payloadObj["minifiedCover"] = miniCover?.order?.itemId
            toast.dismiss(toastCover);
        } catch (e) {
            toast.dismiss(toastCover);
            console.log(e); handleErr(t("errors.coverUploadError"), setSubmittingShow); return;
        }

        // Fee to Everpay
        if (!props.edit || props.rssData.length > 0) { //Upload Mode or RSS Mode
            const toastFee = toast.loading(t("loadingToast.payingFee"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
            setProgress(60)
            try {
                const everpay = new Everpay({ account: address, chainType: ChainType.arweave, arJWK: 'use_wallet', });
                const transaction = await everpay.transfer({
                    tag: EVERPAY_AR_TAG,
                    amount: String(MIN_UPLOAD_PAYMENT),
                    to: EVERPAY_EOA,
                    data: { action: "createPodcast", name: podcastName_, }
                })
                payloadObj["txid"] = transaction?.everHash
                toast.dismiss(toastFee);
            } catch (e) {
                toast.dismiss(toastFee);
                console.log(e); handleErr(t("error.everpayError"), setSubmittingShow); return;
            }
        }
        //Error handling and timeout needed for this to complete redirect
        const toastSaving = toast.loading(t("loadingToast.savingChain"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
        setProgress(props.edit ? 80 : 75)
        setTimeout(async function () {
            console.log("createShowPayload: ", createShowPayload);
            const uploadRes = (await axios.post('/api/exm/write', createShowPayload)).data;
            console.log("uploadRES: ", uploadRes)
            const podcasts = uploadRes.data.execution.state.podcasts;
            const podcast = podcasts[podcasts.length - 1];
            if (podcasts.length > 0 && props.setUploadedPID) {
                props?.setUploadedPID(podcast.pid);
                props?.setUploadedIndex(podcasts.length - 1);
            };
            props?.returnedPodcasts && props?.returnedPodcasts(podcasts);
            //EXM call, set timeout, then redirect.
            setTimeout(async function () {
                toast.dismiss(toastSaving); 
                setProgress(100)
                toast.success(t("success.showUploaded"), PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
                const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
                if (props.redirect) {
                    const { locale } = router;
                    router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true })
                }
                props?.submitted && props?.submitted(true);
            }, 7000)
        }, 2000)
    }

    // Inserts Editting Info
    useEffect(() => {
        if (props.edit && props.rssData.length === 0) {
            
            const restoreSavedData = async () => {
            
                const podcast = props.podcasts.filter((podcast,) => podcast.pid === props.selectedPid)
                const p = podcast[0]
                console.log("t: ", p)
                //Set all state variables
                setPodcastName_(p.podcastName)
                const description = (await axios.get(ARSEED_URL + p.description)).data;
                setPodcastDescription_(description)
                setPodcastAuthor_(p.author)
                setPodcastEmail_(p.email)

                //Recreate Cover for Upload
                fetch(ARSEED_URL + p.cover)
                    .then((rs) => rs.blob())
                    .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        setCoverUrl(p.cover)
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
                setPodcastEmail_(p.email)

                //Recreate Cover for Upload
                fetch(p.cover)
                    .then((rs) => rs.blob())
                    .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        setPodcastCover_(url);
                        setCoverUrl(p.cover);
                    })
                    .catch((err) => 
                        toast.error(t("errors.mediaDownloadError"), PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
                    );
                setPodcastLanguage_(p.language)
                setPodcastCategory_(categories_en.findIndex(cat => cat === p.categories[0]))
                setPodcastExplicit_(p.explicit === "no" ? false : true)
                _setLoadingPage(false)
            }
            restoreSavedData()
        } else {
            _setLoadingPage(false)
        };
    }, []);

    const editCover = (props.edit && !props.rssData.length) ? ARSEED_URL + coverUrl : coverUrl;
    console.log("isVIs: ", isVisible)
    return (
        <div className={showFormStyling + (props?.allowSelect ? " pb-20" : "")}>
            {/*First Row*/}
            <div className="flex flex-col justify-center items-center lg:items-start lg:flex-row w-full">
                {/*
                    Cover
                */}
                {/* <p className="text-white">{podcastName_}</p> */}
                <div className="w-[25%] flex justify-center mb-4 lg:mb-0">
                    <CoverContainer
                        setCover={setPodcastCover_}
                        isEdit={props.edit || props.rssData.length > 0}
                        editCover={editCover}
                    />
                </div>
                <div className="flex flex-col w-[95%] md:w-[75%] lg:w-[50%] space-y-3">
                    {/*
                        Episode Name
                    */}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="showName" placeholder={t("uploadshow.name")} value={podcastName_}
                        onChange={(e) => {
                            setPodNameMsg(handleValMsg(e.target.value, "podName"));
                            setPodcastName_(e.target.value);
                        }} />
                    <ValMsg valMsg={podNameMsg} className="pl-2" />

                    {/*
                        Episode Description
                    */}
                    <div className={descContainerStyling}>
                        <textarea className={"w-[93%] " + episodeDescStyling + " h-32 "} required title="Between 1 and 5000 characters" name="showShowNotes" placeholder={t("uploadshow.description")} value={podcastDescription_}
                            onChange={(e) => {
                                setPodDescMsg(handleValMsg(e.target.value, "podDesc"));
                                setPodcastDescription_(e.target.value);
                            }}></textarea>
                        <MarkDownToolTip
                            placement="top"
                            size={40}
                        />
                    </div>
                    <ValMsg valMsg={podDescMsg} className="pl-2" />

                    {/*
                        Author
                    */}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Author" type="text" name="showName" placeholder={t("uploadshow.author")} value={podcastAuthor_}
                        onChange={(e) => {
                            setPodAuthMsg(handleValMsg(e.target.value, "podAuthor"));
                            setPodcastAuthor_(e.target.value);
                        }} />
                    <ValMsg valMsg={podAuthMsg} className="pl-2" />

                    {/*
                        Email
                    */}
                    <input className={episodeNameStyling} required pattern=".{3,500}" title="Email" type="text" name="showName" placeholder={t("uploadshow.email")} value={podcastEmail_}
                        onChange={(e) => {
                            setPodEmailMsg(handleValMsg(e.target.value, "podEmail"));
                            setPodcastEmail_(e.target.value);
                        }} />
                    <ValMsg valMsg={podEmailMsg} className="pl-2" />

                    {/*
                        Genre and Language
                    */}
                    <SelectDropdownRow
                        setLanguage={setPodcastLanguage_}
                        setCategory={setPodcastCategory_}
                        setLabel={setPodcastLabel_}
                        labelValue={podcastLabel_}
                        setLabelMsg={setLabelMsg}
                        labelMsg={labelMsg}
                        podcasts={props.podcasts}
                        categoryIndex={podcastCategory_}
                        languageCode={podcastLanguage_}
                    />
                    {/*
                        Explicit & Is Visible
                    */}
                    <div className="flexYCenter justify-between">
                        <ExplicitInput
                            setExplicit={setPodcastExplicit_}
                            explicit={podcastExplicit_}
                        />
                        {props.edit && (
                            <VisibleInput
                                setVisible={setIsVisible}
                                visible={isVisible}
                            />
                        )}
                    </div>
                    {/*
                        Upload
                    */}
                    <div className="w-full flexColFullCenter">
                        {/*Show Upload Btn, Spinner, or Connect Btn*/}
                        {address && address.length > 0 && !submittingShow && (
                            <UploadButton
                                width="w-[50%]"
                                disable={!allFieldsFilled(validationObject)}
                                click={() => submitShow(createShowPayload)}
                            />
                        )}
                        {address && address.length > 0 && submittingShow && (
                            <ProgressBar
                                progress={String(progress)}
                                colorHex="#FFFF00"
                            />
                        )}
                        {!address && (
                            <ConnectButton
                                width="w-[75%] md:w-[50%]"
                                disable={false}
                                click={() => connect()}
                            />
                        )}
                        {uploadCost === 0 && podcastDescription_.length > 0 && podcastCover_ && (
                            <p className="mt-2 text-neutral-400">{t("uploadshow.calculatingFee")}</p>
                        )}
                        {uploadCost !== 0 && podcastDescription_.length > 0 && podcastCover_ && (
                            <p className="mt-2 text-neutral-400">{t("uploadshow.uploadCost") + ": " + (Number(uploadCost)).toFixed(6) + " AR"}</p>
                        )}

                        {/* Show Podcasts for selection */}
                        {props?.allowSelect && (
                            <div className="w-full mt-4 pb-20">
                                <div className="my-1 border-t-[2px] border-white rounded-full"></div>
                                <div className='text-center mb-2'>{t("rss.or")}</div>
                                <SelectPodcast
                                    pid={props.selectedPid}
                                    setPid={(pid) => {
                                        props?.setUploadedPID && props.setUploadedPID(pid);
                                    }}
                                    shows={props?.podcasts || []}
                                />
                            </div>
                        )}

                    </div>
                </div>
                <div className={`w-[25%]`}></div>
            </div>
        </div>
    )
}
