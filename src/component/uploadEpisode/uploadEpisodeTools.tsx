import axios from 'axios';
import router from 'next/router';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { Podcast } from '../../interfaces';
import { arweaveAddress } from '../../atoms';
import { useTranslation } from 'next-i18next';
import React, {  useEffect, useState } from 'react';
import { transferFunds } from '../../utils/everpay';
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../../constants/arconnect';
import { descContainerStyling, spinnerClass } from '../uploadShow/uploadShowTools';
import { getBundleArFee, upload2DMedia, upload3DMedia } from '../../utils/arseeding';
import { allFieldsFilled, byteSize, checkConnection, determineMediaType, handleError } from '../../utils/reusables';
import { ARSEED_URL, AR_DECIMALS, CONNECT_WALLET, EPISODE_DESC_MAX_LEN, EPISODE_DESC_MIN_LEN, EPISODE_NAME_MAX_LEN, EPISODE_NAME_MIN_LEN, EPISODE_UPLOAD_FEE, EVERPAY_EOA, GIGABYTE, SPINNER_COLOR, TOAST_DARK, TOAST_MARGIN, USER_SIG_MESSAGES } from '../../constants';
import { ValMsg } from '../reusables/formTools';
import { PermaSpinner } from '../reusables/PermaSpinner';
import { VisibleInput } from '../uploadShow/reusables';
import { createFileFromBlobUrl } from '../../utils/fileTools';

const CoverContainer = React.lazy(() => import('../uploadShow/reusables').then(module => ({ default: module.CoverContainer })));

const UploadButton = React.lazy(() => import('./reusables').then(module => ({ default: module.UploadButton })));
const EpisodeMedia = React.lazy(() => import('./reusables').then(module => ({ default: module.EpisodeMedia })));
const SelectPodcast = React.lazy(() => import('./reusables').then(module => ({ default: module.SelectPodcast })));
const ConnectButton = React.lazy(() => import('./reusables').then(module => ({ default: module.ConnectButton })));
const MarkDownToolTip = React.lazy(() => import('../reusables/tooltip').then(module => ({ default: module.MarkDownToolTip })))

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
export const episodeNameStyling = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
    const [epThumbnail, setEpThumbnail] = useState(null)

    //For Edits
    const [epThumbnailUrl, setEpThumbnailUrl] = useState(null)
    const [visible, setVisible] = useState<boolean>(true)
    //Validation
    const [epNameMsg, setEpNameMsg] = useState<string>("")
    const [epDescMsg, setEpDescMsg] = useState<string>("")
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
                const episode = podcast[0]?.episodes.filter((episode, ) => episode.eid === props.eid)
                const ep = episode[0]
                setEpName(ep.episodeName)
                const description = (await axios.get(ARSEED_URL + ep.description)).data;
                setEpDesc(description)
                setEpThumbnailUrl(ep?.thumbnail ? ep?.thumbnail : "")
                setVisible(ep.isVisible)
            }
            restoreSavedData()
            //loading modal NEEDED
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

    const createEpPayload = {
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

        // Thumbnail to Arseeding
        if(epThumbnail) {
            const toastCover = toast.loading(t("loadingToast.savingCover"), {style: TOAST_DARK, duration: 10000000});
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
            const toastCover = toast.loading(t("loadingToast.savingMedia"), {style: TOAST_DARK, className:TOAST_MARGIN, duration: 10000000});
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
    console.log("epThumbnailUrl :", epThumbnailUrl)
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
                {/*Is Visible Input*/}
                {props.edit && (
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

/*
{
    "function": "editEpisodeMetadata",
    "jwk_n": "lHogurZNFhu_xnTV4HDHpDNhUNbZUL14pJUlBlzydgY8SwNMGTZCEGwJIuzLC5t8S8WfHqAvy5wRG5qu0fKE1SAMdhFFe4-jpesBGmfh9VyF43AQuM_3B5Hl-cjes9-C1PA8Ql25X4aJ2Ln-pfUBZe7oe9PAykEvF5wLb-zBNVfBdvLCj_oBrILe-YOvvqp2NPzcoOecbBNjpM4wCPmd41_tvN1qSfw3znPE0HbK5Ukzs9ETlqEzvOMJYAQ2WFd6lA5Zx3kDYKm68-VNA8vrTHp5yNldrXk8GJW8gsHru2fv2_MrBmdi30CSHNC-rDIh3BQQbcaHQ3W8Fx8RZsKsnZHZBsqiD2zJcTmXuRQDrh8Kw_2mtVYvDh7PWsSNPI_izm45lYNSxw7Wjr2SO9JbpWe_57PgU3eUWbMYHWAMkbneTiGvgDpinYdltEtpA9-Im4I_pCq1FXvWCea4sc5IcP30V8boMsQ6xw-y-07UcCogr9krVTDMdGYEVHkIfObt8d6ZzpcigPVIQLqDEAx6EKeC3I_6dP_G8axSKebdK_5IhZYot39biqPKzWZnZaz5D7zHpBjp1gRDHOJ5cV-XKjPcDvoTKbsFWdno0r6Nutaac6ksP_YPneZvP6Qxxq6To3ieVQyq4sFUMHR5UvslYoDASlE8VDnDu2EZfZhvfI8",
    "pid": "671ab527a71cded3500cf3b4ad3919a729a6660386ec5fe51f78888c30626da37507e549be9d3dbf801793a6345fc396e2134825cbc977d02e5ba7dcf69cd11f",
    "name": "Fancy Streets2",
    "desc": "rySx2WKQyjp2GTUZmgGtMfPWujYK0K2_ReF1y-ifrM8",
    "sig": "inQzfpOQsr8D6RAX1+eBJvo5uL3JelvJLP5GdAEYRzTI8EOzCxS9J44Rlg/C49d3BAfyCd6nCEcanAbo9ugsGwbouDHoMt7haU1wSh6VI9gUlZSYRQd3Osn2YzDLGrwyjEU61RoR9lpYAg6BYUw3aBYTVZPDu2sXC0LcmCO2RfT6ZeF3sx0XW0bJeR62BkeLHlC/IEHQrKZ+98vQPJK9WfRM9xHMOZrPLcLiFjEjILIAOSZz2r7ajeG4ESb9xbc2/ydD7jexgHf9EB3GTYbmEweINrAV+e1U04GGkzE92InWL+fgfZMcJbE2K15dx/f2XgaHYnKn+K7Ms+hV/OPOWmkBENPUsGkUV4vFMhLbNg1Ap94sAVB2v0ntUq1YVx/AgCck6p71xceAPkeYo2s4CwXwopJj2I1R4K+BZ5xmyoDA+aAL2PcnBILBm07HGDbDkBjrKLLPcWVxZTuRfUGsh3mLGUo9MiyD/kX6hOUzBYw3luFUG/PTSmbRWppapT3BvBglTSkWAp50+IymgKsa03p8IzP3/2tVLwmoQy8aCgw0wysqfMIzSKi4vG4K9bGEVX8H8Pt3ibQoqKDz7xqrIXfFKdrxQOj2BaYe+0UunHernoODgwhnRLGli/uG+1usnA8Ppgb8Yg/EZ+nk3EqiBR28ACtitDWB5TaAjVdfEhw=",
    "txid": "",
    "isVisible": false,
    "thumbnail": "qSSTDA_iIlorslnxi22KoFzAgj4YpitI02VB-Wpc1m0",
    "content": "",
    "mimeType": "",
    "eid": "f12d4503b251e66968ea82b24ade99768232022b9f8b4676f675fc586572e175f4ef544c66f055f4c3f5d01fec453dab1fe26c55872d4474531cb04ec20fe215"
}


*/

