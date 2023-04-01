import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiFile } from 'react-icons/fi';
import { useRecoilState } from 'recoil';
import { arweaveAddress } from '../../atoms';
import { ValMsg } from '../reusables/formTools';
import { PermaSpinner } from '../reusables/PermaSpinner';
import { spinnerClass } from '../uploadShow/uploadShowTools';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../../constants/arconnect';
import { ArrowUpTrayIcon, XMarkIcon, WalletIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { getBundleArFee, upload2DMedia, upload3DMedia } from '../../utils/arseeding';
import { allFieldsFilled, byteSize, checkConnection, determineMediaType, handleError } from '../../utils/reusables';
import { ARWEAVE_READ_LINK, AR_DECIMALS, CONNECT_WALLET, DESCRIPTION_UPLOAD_ERROR, EPISODE_DESC_MAX_LEN, EPISODE_DESC_MIN_LEN, EPISODE_NAME_MAX_LEN, EPISODE_NAME_MIN_LEN, EPISODE_UPLOAD_FEE, EP_UPLOAD_SUCCESS, EVERPAY_BALANCE_ERROR, EVERPAY_EOA, EXM_READ_LINK, FADE_IN_STYLE, FADE_OUT_STYLE, MEDIA_UPLOAD_ERROR, MIN_UPLOAD_PAYMENT, SPINNER_COLOR, TOAST_DARK, USER_SIG_MESSAGES } from '../../constants';
import { useTranslation } from 'react-i18next';
import { transferFunds } from '../../utils/everpay';

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

export interface Podcast { 
    pid: string;
    label: string;
    createdAt: number;
    index: number;
    owner: string;
    podcastName: string;
    author: string;
    email: string;
    description: string;
    language: string;
    explicit: string;
    categories: string[];
    maintainers: any[]; // Replace 'any' with a specific type if you have more information about the maintainers' structure
    cover: string;
    minifiedCover: string;
    isVisible: boolean;
    episodes: any[]; // Replace 'any' with a specific type if you have more information about the episodes' structure
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
export const tipModalStyling = "absolute inset-0 top-0 flex justify-center items-center z-15"
export const podcastOptionsContainer = "w-full flex flex-col px-5 overflow-auto h-[80%]"
export const podcastOptionBaseStyling = "w-full flex justify-start items-center space-x-4"
export const episodeFormStyling = "w-[50%] flex flex-col justify-center items-center space-y-4"
export const showErrorTag = "flex justify-center items-center m-auto text-white font-semibold text-xl"
export const containerPodcastModalStyling = "w-[50%] h-[420px] bg-zinc-800 rounded-3xl flex flex-col z-10 mb-0"
export const uploadEpisodeStyling = "flex flex-col justify-center items-center m-auto space-y-3 relative pb-[250px]"
export const podcastOptionHoverStyling = "cursor-pointer hover:bg-zinc-600/30 transition duration-650 ease-in-out rounded-3xl p-3"
export const xMarkStyling = "h-5 w-5 mt-1 cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full"
export const uploadButtonStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8"
export const submitModalStyling = "btn btn-secondary transition duration-300 ease-in-out hover:text-white rounded-xl px-8 border-0 text-2xl"
export const selectPodcastStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8 w-full"
export const episodeNameStyling = "input input-secondary w-full py-3 pl-5 pr-10 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
export const labelEpisodeMediaStyling = "flex items-center text-zinc-400 transition duration-300 ease-in-out hover:text-white my-1 py-2 px-3 w-full cursor-pointer w-full"
export const episodeDescStyling =  "input input-secondary resize-none w-full h-28 pb-12 py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"


// 3. Custom Functions

// 4. Components
export const EpisodeForm = (props: EpisodeFormInter) => {
    const [submittingEp, setSubmittingEp] = useState<boolean>(false)
    const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [arweaveAddress_, ] = useRecoilState(arweaveAddress)
    const [uploadCost, setUploadCost] = useState<Number>(0)

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
    }, [])


    // Hook Calculating Upload Cost
    useEffect(() => {
        setUploadCost(0)
        
        async function calculateTotal() {
            const descBytes = byteSize(epDesc)
            const descFee = await getBundleArFee(String(descBytes))
            const mediaFee = await getBundleArFee(String(epMedia.size))
            return Number(descFee) + Number(mediaFee)
        }

        if(epDesc.length > 0 && epMedia !== null) {
            calculateTotal().then(async total => {
                const formattedTotal = total / AR_DECIMALS
                setUploadCost(formattedTotal+MIN_UPLOAD_PAYMENT)
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
            toast.error(CONNECT_WALLET, {style: TOAST_DARK})
            return false
        }
        setSubmittingEp(true)
        const handleErr = handleError
        // Package EXM Call
        const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + await getPublicKey());
        epPayload["sig"] = await createSignature(data, defaultSignatureParams, "base64");
        epPayload["jwk_n"] = await getPublicKey()

        // Description to Arseeding
        try {
            const description = await upload2DMedia(epDesc); epPayload["desc"] = description?.order?.itemId
        } catch (e) {
            console.log(e); handleErr(DESCRIPTION_UPLOAD_ERROR, setSubmittingEp); return;
        }
        
        // Media to Arseeding
        try {
            const media = await upload3DMedia(epMedia, epMedia.type); epPayload["content"] = media?.order?.itemId
            epPayload["mimeType"] = determineMediaType(epMedia.type)
        } catch (e) {
            console.log(e); handleErr(MEDIA_UPLOAD_ERROR, setSubmittingEp); return;
        }

        // Media to Arseeding
        try {
            const media = await upload3DMedia(epMedia, epMedia.type); epPayload["content"] = media?.order?.itemId
            epPayload["mimeType"] = determineMediaType(epMedia.type)
        } catch (e) {
            console.log(e); handleErr(MEDIA_UPLOAD_ERROR, setSubmittingEp); return;
        }

        // Pay Upload Fee
        try {
            const tx = await transferFunds("UPLOAD_EPISODE_FEE", EPISODE_UPLOAD_FEE, EVERPAY_EOA, address)
            //@ts-ignore - refusing to acknowledge everHash
            epPayload["txid"] = tx[1].everHash
        } catch(e) {
            console.log(e); handleErr(EVERPAY_BALANCE_ERROR, setSubmittingEp); return;
        }
        // EXM REDIRECT AND ERROR HANDLING NEEDED
        const result = await axios.post('/api/exm/write', createEpPayload);
        console.log("PAYLOAD: ", epPayload)
        console.log("exm res: ", result)
        setSubmittingEp(false)
        //EXM call, set timeout, then redirect. 
        toast.success(EP_UPLOAD_SUCCESS, {style: TOAST_DARK})
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
            <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="episodeName" placeholder={"Episode Name"}
            onChange={(e) => {
                setEpNameMsg(handleValMsg(e.target.value, "epName"));
                setEpName(e.target.value);
            }}/>
            {epNameMsg.length > 0 && <ValMsg valMsg={epNameMsg} className="pl-2" />}
            {/*Episode Description*/}
            <textarea className={episodeDescStyling} required title="Between 1 and 5000 characters" name="episodeShowNotes" placeholder={"Description"} 
            onChange={(e) => {
                setEpDescMsg(handleValMsg(e.target.value, "epDesc"));
                setEpDesc(e.target.value);
            }}/>
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
                        width="w-[50%]"
                        disable={false}
                        click={() => connect()}
                    />
                )}
                {uploadCost === 0 && epDesc.length > 0 && epMedia && (
                <p className="mt-2 text-neutral-400">Calculating Fee...</p> 
                )}
                {uploadCost !== 0 && epDesc.length > 0 && epMedia && (
                <p className="mt-2 text-neutral-400">{"Upload Cost: "+(Number(uploadCost)).toFixed(6) +" AR"}</p>
                )}
            </div>
        </div>
    )
}

export const EpisodeMedia = (props: EpisodeMediaInter) => {
    return (
        <div className={episodeMediaStyling}>
            <input className={inputEpisodeMediaStyling} id="file" required type="file" onChange={(e) => props.setMedia(e.target.files?.[0])} name="episodeMedia" />
            <label htmlFor="file" className={labelEpisodeMediaStyling}>
                <FiFile className={episodeFaFileStyling} />
                <div>
                    {props.media ? props.media.name : "Episode Media"}
                </div>
            </label>
        </div>
    )
}

export const UploadButton = (props: UploadButtonInter) => {
    return (
        <button
            className={`${uploadButtonStyling} ${props.width}`}
            disabled={props.disable}
            onClick={props.click}
        >
            <ArrowUpTrayIcon className={trayIconStyling} />
            Upload
      </button>
    )
}

export const ConnectButton = (props: UploadButtonInter) => {
    return (
        <button
            className={`${uploadButtonStyling} ${props.width}`}
            disabled={props.disable}
            onClick={props.click}
        >
            <WalletIcon className={trayIconStyling} />
            Connect Wallet
      </button>
    )
}

export const SubmitTipButton = (props: UploadButtonInter) => {
    const { t } = useTranslation();
    return (
        <button
            className={`${submitModalStyling} ${props.width}`}
            disabled={props.disable}
            onClick={props.click}
        >
            <CurrencyDollarIcon className={dollarIconStyling} />
            {t("tipModal.submitTip")}
      </button>
    )
}

export const SelectPodcast = (props: SelectPodcastInter) => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { address,  } = useArconnect();
    const yourShows = props.shows.filter((item: Podcast) => item.owner === address)
    console.log("_arweaveAddress: ", address)
    let selectedShow;
    if(props.pid.length > 0) {
        selectedShow = yourShows.map((item: Podcast, index) => {
            if(item.pid === props.pid) {
                console.log("match found")
                return item
            }
        })
        console.log("selectedShow: ", selectedShow)
    }

    useEffect(() => {
        setIsVisible(false)
    }, [props.pid])

    return (
        <>
            {props.pid.length === 0 ? 
            <button className={selectPodcastStyling+ " relative"} onClick={() => setIsVisible(prev => !prev)}>
                Select Show
            </button>
            :
            <div onClick={() => setIsVisible(true)}>
                <PodcastOption 
                    imgSrc={ARWEAVE_READ_LINK+selectedShow[0].minifiedCover}
                    title={selectedShow[0].podcastName}
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
                imgSrc={ARWEAVE_READ_LINK+props.imgSrc}
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

    return(
        <div className={selectPodcastModalStyling}>
            <div className={`${containerPodcastModalStyling + " p-6"} ${showModal ? FADE_IN_STYLE :FADE_OUT_STYLE}`}>
                {/*Header*/}
                <div className={titleModalStyling}>
                    <div></div>
                    <p className="text-white text-xl">Select Podcast</p>
                    <XMarkIcon className={xMarkStyling} onClick={() => props.setVisible(false)} />
                </div>
                <hr className={hrPodcastStyling}/>
                {/*Options*/}
                <div className={podcastOptionsContainer}>
                    {props.shows && props.shows.map((item) => (
                        <PodcastSelectOptions 
                            imgSrc={item.minifiedCover}
                            title={item.podcastName}
                            disable={false}
                            setPid={props.setPid}
                            pid={item.pid}
                        />
                    ))}
                    {props.shows.length === 0 && <p className="text-white text-lg text-center">No Shows In Your Account</p>}
                    {_arweaveAddress.length === 0 && <p className="text-blue-400 mt-2 text-lg text-center cursor-pointer" onClick={connect}>Connect Wallet</p>}
                </div>
            </div>
        </div>
    )
}
/*
{
    "function": "createPodcast",
    "name": "Zoophilia at its Finest!",
    "desc": "eog0KRdoVQUgUrBl1zLPRWTt_dDjxfZJhP6Hy2XXgiA",
    "author": "Sebs Steele",
    "lang": "en",
    "isExplicit": "no",
    "categories": "art",
    "email": "s@s.com",
    "cover": "t5PClo_A8BUfDjXx3Po8wI4v2kGRTTs8Jum-ScBLRwM",
    "minifiedCover": "2utNxqNZWnzpbIjlECWk4H6TMaZ3K7Nisvtl_QmeBkQ",
    "label": "sebs",
    "jwk_n": "vBxHYO9sFsPi2FsLpz5AGPC79TrsmBg6nh7x-8wUE3jRF6-km81nfN7-8e9z9xC8WbPQ9GgdpL8JyfcTZK4WCXo692TfYrZCl-nzK6535xVr_zRyVCquotN9dRdKrfteTahFCSnDqjR10CccF8BloJBogXXx9ygAHnySw6gDH_e0ih2KWCRYEBGz8kylQ7vsKFD_UrtcljHMoFv0P9W1kNHFcG1ONlDt-rOEkk-yboVo4safzKh9DaiW9n__vRNpvT7Zz2EG3bTp__NZ_CfzvOEkY2QOKtLOOOvGfDqaRpODMwjzd5gZTEk-et9Zm4FZ8yv05gOHu9zjagNUMJW86sooL3SD1GqWDGQL0meCxRz2YT8I-0ShrhLFR3NTGdgBApZz5VxvaQyN-e6auQY0zAXjvp7uSJ3G1hOAlaeKHbFdQc-k_VCbcj7tqlM004kfNlUdlI4xkN7wJHq4r34TA9GW3Xjl6pg1lqnNDBuCnxCHbkjCUSVubLNCaKrDb-0Bdq9AqXuN4IhCsLey35JD4mbFdkIeQPheAVsPj_XWu8HSn08GSX9SL-IRNVPP4gykL35LVQugcjHVN_UWMkORz3x6ER5k9GmnHKvriQgv_fJPt9AyrMj7KSjFufGD8iH0I-Qz5p-12piyPS9iep0i9c_IGU6SNGHvVmmueR7gNO8",
    "txid": "0xd93c839c2502cd83ed968d1c7080eb24911558e34282f273e72ffed8ec2e4303",
    "sig": "GUeHf4eMTFJGsfH3USJnP9FiM7v4jsU1ZlxrzFnq/UZ47ISTZRW5IWEanAdba0BOzOA3iIE+gm/lvXTgZ87o04Kj6YMtfgItNBg4Fp0SK9DfdUZZT1Bdfb+xdGgdkTQ+iZj/JpW8O8Wr8Rwq0mDzXEG4JLxv25BNIlmciuk4JzICFt/To82umudB3WWZColF/giE07SBodGBNmnSvZll1Ex3oXwKvCc9HErykfh8ZxLmNdFoT0aVG10SXGgcPFHT2dlSW6vG0l2xaziN5rI+g+K6j9Dm76yrKPJfr0kkuKiydSmqqcZQbUhvL/+J0o5SlWHejsWLmXZ6j3Xkk2A8NHb+CHow4o8oigxvMkuHyfHeguH4bWJ4R4o2WUp90BVDsMPfKbtfswHLSwCOAcAJ+JQUbwtGtAWj/bLwNcqnY4nI+zFSX/vGJK8Hv217b50sl+NMjkr8zvQHc+RNrgsVF8D5xyofPJ1qzTFCr7+RAgoTO1Z2NbkRgXcUu6/n/KSM0snS/5McPmEI9uUJwSvVszG2k5pspVqj+JLu9ake6jCGoGRUOdnlPIeTxRbmaaR1YUrzBCbRRy0jdjXtY+snOZJ9kjTbNTHXB90XNy3zpB2PZx2nM43DAbpxwxv65mZJZ2jx6iFgfT13uUToIKKJZGjimFLU08/0HvsfrWnZ8rU="
}
*/

