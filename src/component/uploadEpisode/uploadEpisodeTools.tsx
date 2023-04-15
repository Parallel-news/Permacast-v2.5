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
import { AR_DECIMALS, CONNECT_WALLET, EPISODE_DESC_MAX_LEN, EPISODE_DESC_MIN_LEN, EPISODE_NAME_MAX_LEN, EPISODE_NAME_MIN_LEN, EPISODE_UPLOAD_FEE, EVERPAY_EOA, GIGABYTE, SPINNER_COLOR, TOAST_DARK, TOAST_MARGIN, USER_SIG_MESSAGES } from '../../constants';
import { ValMsg } from '../reusables/formTools';
import { PermaSpinner } from '../reusables/PermaSpinner';

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
}

// 2. Styling
export const xBtnModalStyling = "text-neutral-400/75 text-xl cursor-pointer"
export const buttonColStyling = "w-full flex justify-center items-center flex-col"
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




