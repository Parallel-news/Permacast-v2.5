import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { episodeDescStyling, episodeNameStyling } from "../uploadEpisode/uploadEpisodeTools";
import { categories_en } from "../../utils/languages";

import { ARSEED_URL, AR_DECIMALS, CONNECT_WALLET, EVERPAY_AR_TAG, EVERPAY_EOA, MIN_UPLOAD_PAYMENT, PODCAST_AUTHOR_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_DESC_MAX_LEN, PODCAST_DESC_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_NAME_MIN_LEN, SPINNER_COLOR, TOAST_DARK, USER_SIG_MESSAGES } from "../../constants";
import { isValidEmail } from "../reusables/formTools";
import { getBundleArFee, upload2DMedia, upload3DMedia } from "../../utils/arseeding";
import { createFileFromBlobUrl, minifyPodcastCover, createFileFromBlob } from "../../utils/fileTools";
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { APP_LOGO, APP_NAME, PERMISSIONS } from "../../constants/arconnect";
import { allFieldsFilled, byteSize, checkConnection, handleError, validateLabel} from "../../utils/reusables";
import Everpay, { ChainType } from "everpay";
import { useRecoilState } from "recoil";
import { arweaveAddress, loadingPage, podcastColorAtom } from "../../atoms";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { Podcast } from "../../interfaces";
import { useRouter } from "next/router";
import toast from "react-hot-toast"
import React from "react";
import { VisibleInput } from "./reusables";
import { fetchDominantColor, getCoverColorScheme } from "../../utils/ui";
import ProgressBar from "../reusables/progressBar";

const MarkDownToolTip = React.lazy(() => import("../reusables/tooltip").then(module => ({ default: module.MarkDownToolTip })));
const CoverContainer = React.lazy(() => import("./reusables").then(module => ({ default: module.CoverContainer })));
const ExplicitInput = React.lazy(() => import("./reusables").then(module => ({ default: module.ExplicitInput })));
const SelectDropdownRow = React.lazy(() => import("./reusables").then(module => ({ default: module.SelectDropdownRow })));
const ConnectButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.ConnectButton })));
const UploadButton = React.lazy(() => import("../uploadEpisode/reusables").then(module => ({ default: module.UploadButton })));
const ValMsg = React.lazy(() => import("../reusables/formTools").then(module => ({default: module.ValMsg})))
const SelectPodcast = React.lazy(() => import("../../component/uploadEpisode/reusables").then(module => ({default: module.SelectPodcast})));

export default function uploadShowTools() {
    return false
}

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
export const spinnerClass = "w-full flex justify-center mt-4"
export const showFormStyling = "w-full flex flex-col justify-center items-center space-y-2"
export const descContainerStyling = "w-[100%] h-32 rounded-xl bg-zinc-800 flex flex-row justify-start items-start focus-within:ring-white focus-within:ring-2 default-animation "

// 3. Custom Functions
/**
 * Determines whether validation message should be placed within input field
 * @param {string|number - input from form} input 
 * @param {string - form type} type 
 * @returns Validation message || ""
 */

export const handleValMsg = (input: string, type: string, input2: any ="") => {
    switch(type) {
        case 'podName':
        if((input.length > PODCAST_NAME_MAX_LEN || input.length < PODCAST_NAME_MIN_LEN)) {
            return "uploadshow.validation.name"//, { minLength: PODCAST_NAME_MIN_LEN, maxLength: PODCAST_NAME_MAX_LEN });
        } else {
            return "";
        }
        case 'podDesc':
        if((input.length > PODCAST_DESC_MAX_LEN || input.length < PODCAST_DESC_MIN_LEN)) {
            return "uploadshow.validation.description"//, { minLength: PODCAST_DESC_MIN_LEN, maxLength: PODCAST_DESC_MAX_LEN });
        } else {
            return "";
        }
        case 'podAuthor':
        if((input.length > PODCAST_AUTHOR_MAX_LEN || input.length < PODCAST_AUTHOR_MIN_LEN)) {
            return "uploadshow.validation.author"//, { minLength: PODCAST_AUTHOR_MIN_LEN, maxLength: PODCAST_AUTHOR_MAX_LEN };
        } else {
            return "";
        }
        case 'podEmail':
        if(isValidEmail(input)) {
            return "";
        } else {
            return "uploadshow.validation.email";
        }
        case 'podLabel':
        if(validateLabel(input, input2).res) {
            return "";
        } else {
            return validateLabel(input, input2).msg
        }   
    }
}
  
// 4. Components
export const ShowForm = (props: ShowFormInter) => {
    
    // hooks
    const { t } = useTranslation();
    const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [arweaveAddress_, ] = useRecoilState(arweaveAddress);
    const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
    const [submittingShow, setSubmittingShow] = useState<boolean>(false);
    const [uploadCost, setUploadCost] = useState<Number>(0);
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
    const [isVisible, setIsVisible] = useState<boolean>(true)

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

    // Hook Calculating Upload Cost
    useEffect(() => {
        setUploadCost(0)
        
        async function calculateTotal() {
            const descBytes = byteSize(podcastDescription_)
            const convertedCover = await createFileFromBlobUrl(podcastCover_, "cov.txt")
            const minCover = await minifyPodcastCover(podcastCover_); 
            const fileMini = createFileFromBlob(minCover, "miniCov.jpeg");

            const descFee = await getBundleArFee(String(descBytes))
            const coverFee = await getBundleArFee(String(convertedCover.size))
            const miniFee = await getBundleArFee(String(fileMini.size))

            return Number(descFee) + Number(coverFee) + Number(miniFee)
        }
        if(podcastDescription_.length > 0 && podcastCover_ !== null) {
            calculateTotal().then(async total => {
                const formattedTotal = total / AR_DECIMALS
                setUploadCost(props.edit ? formattedTotal : formattedTotal+MIN_UPLOAD_PAYMENT)
            })
        } else {
            setUploadCost(0)
        }
    }, [podcastDescription_, podcastCover_])

    //EXM 
    const createShowPayload = {
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
        // props.setUploadedPID("b4fa345dd57b6a006353fbb94f38b0b274eef55093fcd75079ebe804ccb66ac1f51c5afc41be124c3599f001c04e4a6fd60a7fa63cb83c9aaa02209e4deaa988");
        // return;
        if (!checkConnection(arweaveAddress_)) {
            toast.error(CONNECT_WALLET, {style: TOAST_DARK})
            return false
        }

        setSubmittingShow(true)

        const handleErr = handleError
        // Package EXM Call

        const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + await getPublicKey());
        payloadObj["sig"] = await createSignature(data, defaultSignatureParams, "base64");
        payloadObj["jwk_n"] = await getPublicKey()


        // Description to Arseeding
        const toastDesc = toast.loading(t("loadingToast.savingDesc"), {style: TOAST_DARK, duration: 10000000});
        setProgress(props.edit ? 25 : 20)
        try {
            const description = await upload2DMedia(podcastDescription_); payloadObj["desc"] = description?.order?.itemId
            toast.dismiss(toastDesc);
        } catch (e) {
            toast.dismiss(toastDesc);
            console.log(e); handleErr(t("errors.descUploadError"), setSubmittingShow); return;
        }

        // Covers to Arseeding
        const toastCover = toast.loading(t("loadingToast.savingCover"), {style: TOAST_DARK, duration: 10000000});
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
        if(!props.edit || props.rssData.length > 0) { //Upload Mode or RSS Mode
            const toastFee = toast.loading(t("loadingToast.payingFee"), {style: TOAST_DARK, duration: 10000000});
            setProgress(60)
            try {
                const everpay = new Everpay({account: address, chainType: ChainType.arweave, arJWK: 'use_wallet',});
                const transaction = await everpay.transfer({
                    tag: EVERPAY_AR_TAG,
                    amount: String(MIN_UPLOAD_PAYMENT),
                    to: EVERPAY_EOA,
                    data: {action: "createPodcast", name: podcastName_,}
                })
                payloadObj["txid"] = transaction?.everHash
                toast.dismiss(toastFee);
            } catch (e) {
                toast.dismiss(toastFee);
                console.log(e); handleErr(t("error.everpayError"), setSubmittingShow); return;
            }
        }
        //Error handling and timeout needed for this to complete redirect
        const toastSaving = toast.loading(t("loadingToast.savingChain"), {style: TOAST_DARK, duration: 10000000});
        setProgress(props.edit ? 80: 75)
        setTimeout(async function () {
            console.log("createShowPayload: ", createShowPayload)
            const uploadRes = (await axios.post('/api/exm/write', createShowPayload)).data;
            const podcasts = uploadRes.data.execution.state.podcasts;
            const podcast = podcasts[podcasts.length - 1];
            console.log('uploaded podcast', podcast);
            if(podcasts.length > 0 && props.setUploadedPID) {
                props?.setUploadedPID(podcast.pid);
                props?.setUploadedIndex(podcasts.length - 1);
            };
            props?.returnedPodcasts && props?.returnedPodcasts(podcasts);
            //EXM call, set timeout, then redirect.
            toast.dismiss(toastSaving); 
            setProgress(100)
            toast.success(t("success.showUploaded"), {style: TOAST_DARK})
            setTimeout(async function () {
                const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
                if(props.redirect) {
                    const { locale } = router;
                    router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true })
                }
                props?.submitted && props?.submitted(true);
            }, 2500)
        }, 5000)
    }

    // Inserts Editting Info
    useEffect(() => {
        if(props.edit && props.rssData.length === 0) {
            const restoreSavedData = async () => {
                console.log("Edit capability executed")
                const podcast = props.podcasts.filter((podcast, ) => podcast.pid === props.selectedPid)
                const p = podcast[0]
                //Set all state variables
                setPodcastName_(p.podcastName)
                const description = (await axios.get(ARSEED_URL + p.description)).data;
                setPodcastDescription_(description)
                setPodcastAuthor_(p.author)
                setPodcastEmail_(p.email)
                
                //Recreate Cover for Upload
                setCoverUrl(p.cover)
                fetch(ARSEED_URL+p.cover)
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
        if(props.rssData.length > 0) {
            const restoreSavedData = async () => {
                const p = props.rssData[0]
                //Set all state variables
                setPodcastName_(p.podcastName)
                setPodcastDescription_(p.description)
                setPodcastAuthor_(p.author)
                setPodcastEmail_(p.email)

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
        };
    }, []);

    return (
        <div className={showFormStyling + (props?.allowSelect ? " pb-20": "")}>
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
                        editCover={(props.edit && !props.rssData.length) ? ARSEED_URL+coverUrl : coverUrl}
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
                    }}/>
                    <ValMsg valMsg={podNameMsg} className="pl-2" />

                    {/*
                        Episode Description
                    */}
                    <div className={descContainerStyling}>
                        <textarea className={"w-[93%] "+episodeDescStyling + " h-32 "} required title="Between 1 and 5000 characters" name="showShowNotes" placeholder={t("uploadshow.description")} value={podcastDescription_}                     
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
                    }}/>
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
                    <div className="flex flex-row justify-between items-center">
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

                    {/* Allow Select */}
                    {props?.allowSelect && (
                        <div>
                            <div className="my-1 border-t-[2px] border-white rounded-full"></div>
                            <div className='text-center mb-2'>or</div>
                            <SelectPodcast
                                pid={props.selectedPid}
                                setPid={(pid) => {
                                    props?.setUploadedPID && props.setUploadedPID(pid);
                                }}
                                shows={props?.podcasts || []}
                            />
                        </div>
                    )}

                    {/*
                        Upload
                    */}
                    <div className="w-full flex justify-center items-center flex-col">
                        {/*Show Upload Btn, Spinner, or Connect Btn*/}
                        {address && address.length > 0 && !submittingShow && (
                        <UploadButton 
                            width="w-[50%]"
                            disable={!allFieldsFilled(validationObject)}
                            click={() =>submitShow(createShowPayload)}
                        />
                        )}
                        {address && address.length > 0 && submittingShow && (
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
                        {uploadCost === 0 && podcastDescription_.length > 0 && podcastCover_ && (
                        <p className="mt-2 text-neutral-400">{t("uploadshow.calculatingFee")}</p> 
                        )}
                        {uploadCost !== 0 && podcastDescription_.length > 0 && podcastCover_ && (
                        <p className="mt-2 text-neutral-400">{t("uploadshow.uploadCost")+": "+(Number(uploadCost)).toFixed(6) +" AR"}</p>
                        )}
                    </div>
                </div>
                <div className={`w-[25%]`}></div>
            </div>
        </div>
    )
}
