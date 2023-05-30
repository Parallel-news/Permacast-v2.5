import axios from 'axios';
import router from 'next/router';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { Podcast } from '../../interfaces';
import { useTranslation } from 'next-i18next';
import { ValMsg } from '../reusables/formTools';
import ProgressBar from '../reusables/progressBar';
import { transferFunds } from '../../utils/everpay';
import React, {  useEffect, useState } from 'react';
import { VisibleInput } from '../uploadShow/reusables';
import { arweaveAddress, loadingPage } from '../../atoms';
import { createFileFromBlobUrl } from '../../utils/fileTools';
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../../constants/arconnect';
import { descContainerStyling, spinnerClass } from '../uploadShow/uploadShowTools';
import { getBundleArFee, upload2DMedia, upload3DMedia } from '../../utils/arseeding';
import { allFieldsFilled, byteSize, checkConnection, determineMediaType, generateAuthentication, handleError } from '../../utils/reusables';
import { EditEpisodeProps, UploadEpisodeProps } from '../../interfaces/exm';
import { ARSEED_URL, AR_DECIMALS, CONNECT_WALLET, EPISODE_DESC_MAX_LEN, EPISODE_DESC_MIN_LEN, EPISODE_NAME_MAX_LEN, EPISODE_NAME_MIN_LEN, EPISODE_UPLOAD_FEE, ERROR_TOAST_TIME, EVERPAY_EOA, EXTENDED_TOAST_TIME, GIGABYTE, PERMA_TOAST_SETTINGS, SPINNER_COLOR, TOAST_DARK, TOAST_MARGIN, USER_SIG_MESSAGES } from '../../constants';
import { getPodcastData } from '../../features/prefetching';


const UploadButton = React.lazy(() => import('./reusables').then(module => ({ default: module.UploadButton })))
const EpisodeMedia = React.lazy(() => import('./reusables').then(module => ({ default: module.EpisodeMedia })))
const SelectPodcast = React.lazy(() => import('./reusables').then(module => ({ default: module.SelectPodcast })))
const ConnectButton = React.lazy(() => import('./reusables').then(module => ({ default: module.ConnectButton })))
const MarkDownToolTip = React.lazy(() => import('../reusables/tooltip').then(module => ({ default: module.MarkDownToolTip })))
const CoverContainer = React.lazy(() => import('../uploadShow/reusables').then(module => ({ default: module.CoverContainer })))

export default function uploadEpisode() {
    return false
}

// 1. Interfaces
interface EpisodeFormInter {
    shows: Podcast[]
    pid: string;
    eid: string;
    edit: boolean;
}

// 2. Styling
export const xBtnModalStyling = "text-neutral-400/75 text-xl cursor-pointer"
export const buttonColStyling = "w-full flex justify-center items-center relative"
export const tipModalStyling = "absolute inset-0 bottom-0 flex justify-center items-center z-50 h-full"
export const episodeFormStyling = "w-[90%] md:w-[75%] lg:w-[50%] flex flex-col justify-center items-center space-y-4"
export const episodeNameStyling = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white default-animation "
export const episodeDescStyling =  "input input-secondary resize-none w-full h-28 pb-12 py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none default-animation "

// 3. Custom Functions

// 4. Components
export const EpisodeForm = (props: EpisodeFormInter) => {

    const queryPodcastData = getPodcastData()
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
    const [epThumbnail, setEpThumbnail] = useState(null)
    const [progress, setProgress] = useState(0)

    //For Edits
    const [epThumbnailUrl, setEpThumbnailUrl] = useState(null)
    const [visible, setVisible] = useState<boolean>(true)
    //Validation
    const [epNameMsg, setEpNameMsg] = useState<string>("")
    const [epDescMsg, setEpDescMsg] = useState<string>("")
    const [, _setLoadingPage] = useRecoilState(loadingPage)
    const validationObject = {
        "nameError": epNameMsg.length === 0,
        "descError": epDescMsg.length === 0,
        "name": epName.length > 0,
        "desc": epDesc.length > 0,
        "media": epMedia !== null || props.edit,
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

    //Enable Editting
    useEffect(() => {
        if(props.edit) {
            const restoreSavedData = async () => {
                const podcast = props.shows.filter((podcast, ) => podcast.pid === props.pid)
                console.log("podcast: ", podcast)
                console.log("eid: ", props.eid)
                const episode = podcast[0]?.episodes.filter((episode, ) => episode.eid === props.eid)
                console.log("episode: ", episode)
                if(episode && episode.length) {
                    console.log("episode: ", episode)
 
                    const ep = episode[0]
                    setEpName(ep.episodeName)
                    const description = (await axios.get(ARSEED_URL + ep.description)).data;
                    setEpDesc(description)
                    setEpThumbnailUrl(ep?.thumbnail ? ep?.thumbnail : "")
                    setVisible(ep.isVisible)
                    _setLoadingPage(false)
                }
            } 
            restoreSavedData()
            //loading modal NEEDED
        } else {
            _setLoadingPage(false)
        }
    }, [])

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
                    return `uploadepisode.validation.name`;
                } else {
                    return "";
                }
            case 'epDesc':
                if((input.length > EPISODE_DESC_MAX_LEN || input.length < EPISODE_DESC_MIN_LEN)) {
                    return `uploadepisode.validation.description`;
                } else {
                    return "";
                }
        }
    }

    const createEpPayload: UploadEpisodeProps | EditEpisodeProps = {
        "function": props.edit ? "editEpisodeMetadata" : "addEpisode",
        "jwk_n": "",
        "pid": pid,
        "name": epName,
        "desc": "",
        "sig": "",
        "txid": "",
        "isVisible": visible,
        "thumbnail": "",
        "content": "",
        "mimeType": "",
        "eid": props.edit ? props.eid : ""
    };

    const submitEpisode = async (epPayload: any) => {
        // Check Connection
        if (!checkConnection(arweaveAddress_)) {
            toast.error(CONNECT_WALLET, PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
            return false
        }
        setSubmittingEp(true)
        const handleErr = handleError
        // Package EXM Call
        const { sig, jwk_n } = await generateAuthentication({getPublicKey, createSignature})
        epPayload["sig"] = sig
        epPayload["jwk_n"] = jwk_n 

        // Description to Arseeding
        const toastDesc = toast.loading(t("loadingToast.savingDesc"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
        setProgress(props.edit ? 25 : 16)
        try {
            const description = await upload2DMedia(epDesc); epPayload["desc"] = description?.order?.itemId
            toast.dismiss(toastDesc); 
        } catch (e) {
            toast.dismiss(toastDesc);
            console.log(e); handleErr(t("errors.descUploadError"), setSubmittingEp); return;
        }

        // Thumbnail to Arseeding
        if(epThumbnail) {
            const toastCover = toast.loading(t("loadingToast.savingCover"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
            setProgress(props.edit ? 50 : 32)
            try {
                const convertedCover = await createFileFromBlobUrl(epThumbnail, "thumbnail.txt")
                const cover = await upload3DMedia(convertedCover, convertedCover.type); epPayload["thumbnail"] = cover?.order?.itemId
                toast.dismiss(toastCover);
            } catch (e) {
                toast.dismiss(toastCover);
                console.log(e); handleErr(t("errors.coverUploadError"), setSubmittingEp); return;
            }
        }

        // Media to Arseeding
        if(!props.edit) {
            const toastCover = toast.loading(t("loadingToast.savingMedia"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
            setProgress(48)
            try {
                const media = await upload3DMedia(epMedia, epMedia.type); epPayload["content"] = media?.order?.itemId
                epPayload["mimeType"] = determineMediaType(epMedia.type)
                toast.dismiss(toastCover);
            } catch (e) {
                toast.dismiss(toastCover);
                console.log(e); handleErr(t("errors.mediaUploadError"), setSubmittingEp); return;
            }
        }


        // Pay Upload Fee
        if(!props.edit) {
            const toastFee = toast.loading(t("loadingToast.payingFee"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
            setProgress(66)
            try {
                const tx = await transferFunds("UPLOAD_EPISODE_FEE", EPISODE_UPLOAD_FEE, EVERPAY_EOA, address)
                //@ts-ignore - refusing to acknowledge everHash
                epPayload["txid"] = tx[1].everHash
                toast.dismiss(toastFee);
            } catch(e) {
                toast.dismiss(toastFee);
                console.log(e); handleErr(t("error.everpayError"), setSubmittingEp); return;
            }
        }
        const toastSaving = toast.loading(t("loadingToast.savingChain"), PERMA_TOAST_SETTINGS(EXTENDED_TOAST_TIME));
        setProgress(props.edit ? 75 : 82)
        // EXM REDIRECT AND ERROR HANDLING NEEDED
        setTimeout(async function () {
            const result = await axios.post('/api/exm/write', createEpPayload);
            console.log("EXM RES: ", result)
            //EXM call, set timeout, then redirect. 
            setTimeout(async function () {
                toast.dismiss(toastSaving);
                toast.success(t("success.episodeUploaded"), PERMA_TOAST_SETTINGS(ERROR_TOAST_TIME))
                setProgress(100)
                queryPodcastData.refetch()
                const identifier = ANS?.currentLabel ? ANS?.currentLabel : address
                const { locale } = router;
                router.push(`/creator/${identifier}`, `/creator/${identifier}`, { locale: locale, shallow: true })
            }, 6500)
        }, 2000)
    }
    //Submit Episode Function
    return(
        <div className={episodeFormStyling + " pb-10"}>
            <div className="w-[25%] flex justify-center mb-4 lg:mb-0">
                <CoverContainer 
                    setCover={setEpThumbnail}
                    isEdit={props.edit}
                    editCover={epThumbnailUrl ? ARSEED_URL+epThumbnailUrl : ""}
                />
            </div>
            {/*Select Podcast*/}
            {(address && !props.edit) && (
                <SelectPodcast
                    pid={pid} 
                    setPid={setPid}
                    shows={props.shows}
                />
            )}

            {/*Episode Name*/}
            <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="episodeName" placeholder={t("uploadepisode.name")} value={epName}
            onChange={(e) => {
                setEpNameMsg(handleValMsg(e.target.value, "epName"));
                setEpName(e.target.value);
            }}/>
            {epNameMsg.length > 0 && <ValMsg valMsg={epNameMsg} className="pl-2" />}
            {/*Episode Description*/}
            <div className={descContainerStyling}>
                <textarea className={"w-[93%] "+episodeDescStyling} required title="Between 1 and 5000 characters" name="episodeShowNotes" placeholder={t("uploadepisode.description")} value={epDesc} 
                onChange={(e) => {
                    setEpDescMsg(handleValMsg(e.target.value, "epDesc"));
                    setEpDesc(e.target.value);
                }}/>
                <MarkDownToolTip 
                    placement="top" 
                    size={40}
                />
            </div>
            {epDescMsg.length > 0 && <ValMsg valMsg={epDescMsg} className="pl-2" />}
            {/*Episode Media*/}
            {!props.edit && (
                <EpisodeMedia
                    media={epMedia} 
                    setMedia={setEpMedia}
                />
            )}
            {/*Upload Button  */}
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
                {/*Is Visible Input*/}
                {props.edit && !submittingEp && (
                    <div className="absolute right-0"> 
                        <VisibleInput 
                            setVisible={setVisible}
                            visible={visible}
                        />
                    </div>
                )}
            </div>
            <div className="flex justify-center items-center">
                {uploadCost !== 0 && epDesc.length > 0 && epMedia && (
                    <p className="mt-2 text-neutral-400">{t("uploadepisode.feetext")} {(Number(uploadCost)).toFixed(6) +" AR"}</p>
                )}
            </div>
        </div>
    )
}  


