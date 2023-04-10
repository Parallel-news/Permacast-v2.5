import axios from 'axios';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { FiFile } from 'react-icons/fi';
import { useRecoilState } from 'recoil';
import { arweaveAddress } from '../../atoms';
import { ValMsg } from '../reusables/formTools';
import { PermaSpinner } from '../reusables/PermaSpinner';
import { descContainerStyling, spinnerClass } from '../uploadShow/uploadShowTools';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../../constants/arconnect';
import { ArrowUpTrayIcon, XMarkIcon, WalletIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { getBundleArFee, upload2DMedia, upload3DMedia } from '../../utils/arseeding';
import { allFieldsFilled, byteSize, checkConnection, determineMediaType, handleError } from '../../utils/reusables';
import { ARSEED_URL, AR_DECIMALS, CONNECT_WALLET, EPISODE_DESC_MAX_LEN, EPISODE_DESC_MIN_LEN, EPISODE_NAME_MAX_LEN, EPISODE_NAME_MIN_LEN, EPISODE_UPLOAD_FEE, EVERPAY_EOA, FADE_IN_STYLE, FADE_OUT_STYLE, GIGABYTE, MINT_DURATION, MIN_UPLOAD_PAYMENT, SPINNER_COLOR, TOAST_DARK, TOAST_MARGIN, TOAST_POSITION, USER_SIG_MESSAGES } from '../../constants';
import { useTranslation } from 'next-i18next';
import { transferFunds } from '../../utils/everpay';
import { Podcast } from '../../interfaces';
import { MarkDownToolTip } from '../reusables/tooltip';
import router from 'next/router';

export default function uploadEpisode() {
    return false
}

// 1. Interfaces
interface SelectPodcastModalInter {
    isVisible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    setPid: (v: any) => void;
    shows: Podcast[];
}

interface PodcastOptionInter {
    imgSrc: string;
    title: string;
    disableClick: boolean;
}

interface UploadButtonInter {
    width?: string;
    disable: boolean;
    click?: () => void
}

interface EpisodeFormInter {
    shows: Podcast[]
    pid: string;
}

interface PodcastSelectOptionsInter {
    imgSrc: string;
    title: string;
    disable: boolean;
    pid: string;
    setPid: (v: any) => void;
}

interface SelectPodcastInter {
    pid: string;
    setPid: (v: any) => void
    shows: Podcast[]; 
}

interface EpisodeMediaInter {
    media: File | null;
    setMedia: (v: any) => void
}
  
// 2. Styling
export const trayIconStyling="h-5 w-5 mr-2"
export const dollarIconStyling="h-10 w-10 mr-2"
export const episodeTitleStyling = "text-white text-xl mt-4"
export const titleModalStyling = "flex justify-between w-full"
export const podcastSelectOptionsStyling = "h-fit w-full space-y-3"
export const inputEpisodeMediaStyling = "opacity-0 absolute z-[-1]"
export const hrPodcastStyling = "my-5 border-[1px] border-neutral-400/50"
export const xBtnModalStyling = "text-neutral-400/75 text-xl cursor-pointer"
export const episodeFaFileStyling = "w-7 h-6 cursor-pointer rounded-lg mx-2"
export const episodeMediaStyling = "bg-zinc-800 rounded-xl cursor-pointer w-full"
export const buttonColStyling = "w-full flex justify-center items-center flex-col"
export const selectPodcastModalStyling = "absolute inset-0 top-0 flex justify-center"
export const tipModalStyling = "absolute inset-0 bottom-0 flex justify-center items-center z-50 h-full"
export const podcastOptionsContainer = "w-full flex flex-col px-5 overflow-auto h-[120%] mb-[40px]"
export const podcastOptionBaseStyling = "w-full flex justify-start items-center space-x-4"
export const episodeFormStyling = "w-[90%] md:w-[75%] lg:w-[50%] flex flex-col justify-center items-center space-y-4"
export const showErrorTag = "flex justify-center items-center m-auto text-white font-semibold text-xl"
export const containerPodcastModalStyling = "w-[98%] sm:w-[75%] lg:w-[50%] h-[420px] bg-zinc-800 rounded-3xl flex flex-col z-10 mb-0"
export const uploadEpisodeStyling = "flex flex-col justify-center items-center m-auto space-y-3 relative pb-[250px]"
export const podcastOptionHoverStyling = "cursor-pointer hover:bg-zinc-600/30 transition duration-650 ease-in-out rounded-3xl p-3"
export const xMarkStyling = "h-5 w-5 mt-1 cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full"
export const uploadButtonStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8"
export const submitModalStyling = "btn btn-secondary transition duration-300 ease-in-out hover:text-white rounded-xl px-8 border-0 text-2xl absolute z-30"
export const selectPodcastStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8 w-full "
export const episodeNameStyling = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
export const labelEpisodeMediaStyling = "flex items-center text-zinc-400 transition duration-300 ease-in-out hover:text-white my-1 py-2 px-3 w-full cursor-pointer w-full"
export const episodeDescStyling =  "input input-secondary resize-none w-full h-28 pb-12 py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none"


// 3. Custom Functions

// 4. Components
export const EpisodeForm = (props: EpisodeFormInter) => {
    const { t } = useTranslation();
    const [submittingEp, setSubmittingEp] = useState<boolean>(false)
    const { address, ANS, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [arweaveAddress_, ] = useRecoilState(arweaveAddress)
    const [arseedCost, setArseedCost] = useState<Number>(0);
    const [uploadCost, setUploadCost] = useState<Number>(0);

    //Inputs
    const [pid, setPid] = useState<string>("")
    const [epName, setEpName] = useState<string>("")
    const [epDesc, setEpDesc] = useState<string>("")
    const [epMedia, setEpMedia] = useState(null)
    //Validation
    const [epNameMsg, setEpNameMsg] = useState<string>("")
    const [epDescMsg, setEpDescMsg] = useState<string>("")
    const validationObject = {
        "nameError": epNameMsg.length === 0,
        "descError": epDescMsg.length === 0,
        "name": epName.length > 0,
        "desc": epDesc.length > 0,
        "media": epMedia !== null,
        "pid": pid.length > 0,
    }

    //Pid Exist? 
    useEffect(() => {
        if(props.pid.length > 0) {
            setPid(props.pid)
        }
        // explainer: get arseed cost per gig
        // no one's going to legitimately upload a gig, so the cost will remain the same
        // some floating errors to be expeted but copable for now
        getBundleArFee(String(GIGABYTE)).then(setArseedCost);
    }, []);


    // Hook Calculating Upload Cost
    useEffect(() => {
        setUploadCost(0)
        
        async function calculateTotal() {
            const descBytes = byteSize(epDesc)
            const descFee = Number(arseedCost) * (descBytes / GIGABYTE);
            const mediaFee = Number(arseedCost) * (epMedia.size / GIGABYTE);
            return Number(descFee) + Number(mediaFee)
        };

        if(epDesc.length > 0 && epMedia !== null) {
            calculateTotal().then(async total => {
                const formattedTotal = total / AR_DECIMALS
                setUploadCost(formattedTotal+EPISODE_UPLOAD_FEE)
            })
        } else {
            setUploadCost(0)
        }
    }, [epDesc, epMedia])

    /**
     * Determines whether validation message should be placed within input field
     * @param {string|number - input from form} input 
     * @param {string - form type} type 
     * @returns Validation message || ""
     */
    const handleValMsg = (input: string, type: string) => {
        switch(type) {
            case 'epName':
            if((input.length > EPISODE_NAME_MAX_LEN || input.length < EPISODE_NAME_MIN_LEN)) {
                return `Name must be between ${EPISODE_NAME_MIN_LEN} and ${EPISODE_NAME_MAX_LEN} characters`;
            } else {
                return "";
            }
            case 'epDesc':
            if((input.length > EPISODE_DESC_MAX_LEN || input.length < EPISODE_DESC_MIN_LEN)) {
                return `Description must be between ${EPISODE_DESC_MIN_LEN} and ${EPISODE_DESC_MAX_LEN} characters`;
            } else {
                return "";
            }
        }
    }

    const createEpPayload = {
        "function": "addEpisode",
        "jwk_n": "",
        "pid": pid,
        "name": epName,
        "desc": "",
        "content": "",
        "mimeType": "",
        "sig": "",
        "txid": ""
    }

    const submitEpisode = async (epPayload: any) => {
        // Check Connection
        if (!checkConnection(arweaveAddress_)) {
            toast.error(CONNECT_WALLET, {style: TOAST_DARK, className:TOAST_MARGIN})
            return false
        }
        setSubmittingEp(true)
        const handleErr = handleError
        // Package EXM Call
        const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + await getPublicKey());
        epPayload["sig"] = await createSignature(data, defaultSignatureParams, "base64");
        epPayload["jwk_n"] = await getPublicKey()

        // Description to Arseeding
        const toastDesc = toast.loading(t("loadingToast.savingDesc"), {style: TOAST_DARK, className:TOAST_MARGIN, duration: 10000000});
        try {
            const description = await upload2DMedia(epDesc); epPayload["desc"] = description?.order?.itemId
            toast.dismiss(toastDesc); 
        } catch (e) {
            toast.dismiss(toastDesc);
            console.log(e); handleErr(t("errors.descUploadError"), setSubmittingEp); return;
        }

        // Media to Arseeding
        const toastCover = toast.loading(t("loadingToast.savingMedia"), {style: TOAST_DARK, className:TOAST_MARGIN, duration: 10000000});
        try {
            const media = await upload3DMedia(epMedia, epMedia.type); epPayload["content"] = media?.order?.itemId
            epPayload["mimeType"] = determineMediaType(epMedia.type)
            toast.dismiss(toastCover);
        } catch (e) {
            toast.dismiss(toastCover);
            console.log(e); handleErr(t("errors.mediaUploadError"), setSubmittingEp); return;
        }

        // Pay Upload Fee
        const toastFee = toast.loading(t("loadingToast.payingFee"), {style: TOAST_DARK, className:TOAST_MARGIN, duration: 10000000});
        try {
            const tx = await transferFunds("UPLOAD_EPISODE_FEE", EPISODE_UPLOAD_FEE, EVERPAY_EOA, address)
            //@ts-ignore - refusing to acknowledge everHash
            epPayload["txid"] = tx[1].everHash
            toast.dismiss(toastFee);
        } catch(e) {
            toast.dismiss(toastFee);
            console.log(e); handleErr(t("error.everpayError"), setSubmittingEp); return;
        }
        const toastSaving = toast.loading(t("loadingToast.savingChain"), {style: TOAST_DARK, className:TOAST_MARGIN, duration: 10000000});
        // EXM REDIRECT AND ERROR HANDLING NEEDED
        setTimeout(async function () {
            const result = await axios.post('/api/exm/write', createEpPayload);
            console.log("PAYLOAD: ", epPayload)
            console.log("exm res: ", result)
            setSubmittingEp(false)
            //EXM call, set timeout, then redirect. 
            toast.dismiss(toastSaving);
            toast.success(t("success.episodeUploaded"), {style: TOAST_DARK, className:TOAST_MARGIN})
            setTimeout(async function () {
                const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
                const { locale } = router;
                router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true })
            }, 3500)
        }, 4000)
    }

    //Submit Episode Function
    return(
        <div className={episodeFormStyling}>
            {/*Select Podcast*/}
            {address && (
                <SelectPodcast
                    pid={pid} 
                    setPid={setPid}
                    shows={props.shows}
                />
            )}
            {/*Episode Name*/}
            <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="episodeName" placeholder={t("uploadepisode.name")}
            onChange={(e) => {
                setEpNameMsg(handleValMsg(e.target.value, "epName"));
                setEpName(e.target.value);
            }}/>
            {epNameMsg.length > 0 && <ValMsg valMsg={epNameMsg} className="pl-2" />}
            {/*Episode Description*/}
            <div className={descContainerStyling}>
                <textarea className={"w-[93%] "+episodeDescStyling} required title="Between 1 and 5000 characters" name="episodeShowNotes" placeholder={t("uploadepisode.description")} 
                onChange={(e) => {
                    setEpDescMsg(handleValMsg(e.target.value, "epDesc"));
                    setEpDesc(e.target.value);
                }}/>
                <MarkDownToolTip 
                    placement="top"
                    size={40}
                />
            </div>
            {epNameMsg.length > 0 && <ValMsg valMsg={epDescMsg} className="pl-2" />}
            {/*Episode Media*/}
            <EpisodeMedia
                media={epMedia} 
                setMedia={setEpMedia}
            />
            {/*Upload Button*/}
            <div className={buttonColStyling}>
                {/*Show Upload Btn, Spinner, or Connect Btn*/}
                {address && address.length > 0 && !submittingEp && (
                <UploadButton 
                    width="w-[50%]"
                    disable={!allFieldsFilled(validationObject)}
                    click={() =>submitEpisode(createEpPayload)}
                />
                )}
                {address && address.length > 0 && submittingEp && (
                <PermaSpinner 
                    spinnerColor={SPINNER_COLOR}
                    size={10}
                    divClass={spinnerClass}
                />
                )}
                {!address && (
                    <ConnectButton 
                        width="w-[75%] md:w-[50%]"
                        disable={false}
                        click={() => connect()}
                    />
                )}
                {uploadCost !== 0 && epDesc.length > 0 && epMedia && (
                <p className="mt-2 text-neutral-400">{t("uploadepisode.feetext")} {(Number(uploadCost)).toFixed(6) +" AR"}</p>
                )}
            </div>
        </div>
    )
}

export const EpisodeMedia = (props: EpisodeMediaInter) => {
    const { t } = useTranslation();

    return (
        <div className={episodeMediaStyling}>
            <input className={inputEpisodeMediaStyling} id="file" required type="file" onChange={(e) => props.setMedia(e.target.files?.[0])} name="episodeMedia" />
            <label htmlFor="file" className={labelEpisodeMediaStyling}>
                <FiFile className={episodeFaFileStyling} />
                <div>
                {props.media ? (props.media.name.length > 50 ? props.media.name.substring(0, 50) + "..." : props.media.name) : t("uploadepisode.file")}
                </div>
            </label>
        </div>
    )
}

export const UploadButton = (props: UploadButtonInter) => {
    const { t } = useTranslation();

    return (
        <button
            className={`${uploadButtonStyling} ${props.width}`}
            disabled={props.disable}
            onClick={props.click}
        >
            <ArrowUpTrayIcon className={trayIconStyling} />
            {t("uploadepisode.upload")}
      </button>
    )
}

export const ConnectButton = (props: UploadButtonInter) => {
    const { t, i18n } = useTranslation();

    return (
        <button
            className={`${uploadButtonStyling} ${props.width}`}
            disabled={props.disable}
            onClick={props.click}
        >
            <WalletIcon className={trayIconStyling} />
            {t("uploadshow.connect-wallet")}
      </button>
    )
}

export const SubmitTipButton = (props: UploadButtonInter) => {
    const { t } = useTranslation();
    return (
        <button
            className={`${submitModalStyling} ${props.width} cursor-pointer`}
            disabled={props.disable}
            onClick={props.click}
        >
            <CurrencyDollarIcon className={dollarIconStyling} />
            {t("tipModal.submitTip")}
      </button>
    )
}

export const SelectPodcast = (props: SelectPodcastInter) => {
    const { t } = useTranslation();

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { address,  } = useArconnect();
    const yourShows = props.shows.filter((item: Podcast) => item.owner === address)
    console.log("_arweaveAddress: ", address)
    let selectedShow;
    let selectedShowIndex;
    if(props.pid.length > 0) {
        selectedShow = yourShows.map((item: Podcast, index) => {
            if(item.pid === props.pid) {
                console.log("match found")
                selectedShowIndex = index
                return item
            }
        })
    }

    useEffect(() => {
        setIsVisible(false)
    }, [props.pid])

    return (
        <>
            {props.pid.length === 0 ? 
            <button className={selectPodcastStyling+ " relative"} onClick={() => setIsVisible(prev => !prev)}>
                {t("uploadepisode.select-show")}
            </button>
            :
            <div onClick={() => setIsVisible(true)}>
                <PodcastOption 
                    imgSrc={ARSEED_URL+selectedShow[selectedShowIndex].minifiedCover}
                    title={selectedShow[selectedShowIndex].podcastName}
                    disableClick={false}
                />
            </div>

            }
            {isVisible ?
                <SelectPodcastModal 
                    isVisible={isVisible}
                    setVisible={setIsVisible}
                    setPid={props.setPid}
                    shows={yourShows}
                />
            :
            ""
            }
        </>
    )
}

export const PodcastSelectOptions = (props: PodcastSelectOptionsInter) => {
    return (
        <div className={podcastSelectOptionsStyling} onClick={() => props.setPid(props.pid)}>
            <PodcastOption 
                imgSrc={ARSEED_URL+props.imgSrc}
                title={props.title}
                disableClick={props.disable}
            />
        </div>
    )
}

export const PodcastOption = (props: PodcastOptionInter) => {
    return (
        <div className={`${podcastOptionBaseStyling}  ${props.disableClick ? "" : podcastOptionHoverStyling}`}>
            <Image
                src={props.imgSrc}
                alt="Podcast Cover"
                height={32}
                width={60}
                className="rounded-xl object-cover"
            />
            <p className="text-lg text-neutral-300">{props.title}</p>
        </div>
    )
}   

export const SelectPodcastModal = (props: SelectPodcastModalInter) => {
    const { t } = useTranslation();

    const [showModal, setShowModal] = useState<boolean>(false)
    const [_arweaveAddress, _setArweaveAddress] = useRecoilState(arweaveAddress)
    const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowModal(prev => !prev);
        }, 100);
    
        return () => {
            clearTimeout(timeoutId);
        };
    }, [props.isVisible])
    console.log("BEN LOOK HERE: ", props.shows)
    return(
        <div className={selectPodcastModalStyling}>
            <div className={`${containerPodcastModalStyling + " p-6"} ${showModal ? FADE_IN_STYLE :FADE_OUT_STYLE}`}>
                {/*Header*/}
                <div className={titleModalStyling}>
                    <div></div>
                    {/*Show Title*/}
                    <p className="text-white text-xl">{t("uploadepisode.select-show")}</p>
                    <XMarkIcon className={xMarkStyling} onClick={() => props.setVisible(false)} />
                </div>
                <hr className={hrPodcastStyling}/>
                {/*Options*/}
                <div className={podcastOptionsContainer}>
                    {props.shows && props.shows.map((item, index) => (
                        <PodcastSelectOptions 
                            imgSrc={item.cover}
                            title={item.podcastName}
                            disable={false}
                            setPid={props.setPid}
                            pid={item.pid}
                            key={index}
                        />
                    ))}
                    {props.shows.length === 0 && <p className="text-white text-lg text-center">{t("uploadepisode.no-shows")}</p>}
                    {_arweaveAddress.length === 0 && <p className="text-blue-400 mt-2 text-lg text-center cursor-pointer" onClick={connect}>{t("uploadshow.connect-wallet")}</p>}
                </div>
            </div>
        </div>
    )
}


