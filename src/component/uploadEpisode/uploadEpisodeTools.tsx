import Image from 'next/image';
import { FiFile } from 'react-icons/fi';
import { ArrowUpTrayIcon, XMarkIcon, WalletIcon } from '@heroicons/react/24/outline';
import { ARWEAVE_READ_LINK, EPISODE_DESC_MAX_LEN, EPISODE_DESC_MIN_LEN, EPISODE_NAME_MAX_LEN, EPISODE_NAME_MIN_LEN, EXM_READ_LINK, FADE_IN_STYLE, FADE_OUT_STYLE, SPINNER_COLOR, TOAST_DARK } from '../../constants';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../../constants/arconnect';
import { useArconnect } from 'react-arconnect';
import { arweaveAddress } from '../../atoms';
import { useRecoilState } from 'recoil';
import toast from 'react-hot-toast';
import { ValMsg } from '../reusables/formTools';
import { allFieldsFilled } from '../../utils/reusables';
import { PermaSpinner } from '../reusables/PermaSpinner';
import { spinnerClass } from '../uploadShow/uploadShowTools';

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
  
// 2. Styling
export const trayIconStyling="h-5 w-5 mr-2"
export const episodeTitleStyling = "text-white text-xl mt-4"
export const titleModalStyling = "flex justify-between w-full"
export const podcastOptionsContainer = "w-full flex flex-col px-5 overflow-auto h-[80%]"
export const inputEpisodeMediaStyling = "opacity-0 absolute z-[-1]"
export const hrPodcastStyling = "my-5 border-[1px] border-neutral-400/50"
export const xBtnModalStyling = "text-neutral-400/75 text-xl cursor-pointer"
export const episodeFaFileStyling = "w-7 h-6 cursor-pointer rounded-lg mx-2"
export const episodeMediaStyling = "bg-zinc-800 rounded-xl cursor-pointer w-full"
export const podcastSelectOptionsStyling = "h-fit w-full space-y-3"
export const podcastOptionBaseStyling = "w-full flex justify-start items-center space-x-4"
export const selectPodcastModalStyling = "absolute inset-0 top-0 flex justify-center"
export const episodeFormStyling = "w-[50%] flex flex-col justify-center items-center space-y-4"
export const showErrorTag = "flex justify-center items-center m-auto text-white font-semibold text-xl"
export const containerPodcastModalStyling = "w-[50%] h-[420px] bg-zinc-800 rounded-3xl flex flex-col z-10 p-6 mb-0"
export const uploadEpisodeStyling = "flex flex-col justify-center items-center m-auto space-y-3 relative pb-[250px]"
export const podcastOptionHoverStyling = "cursor-pointer hover:bg-zinc-600/30 transition duration-650 ease-in-out rounded-3xl p-3"
export const xMarkStyling = "h-5 w-5 mt-1 cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full"
export const uploadButtonStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8"
export const selectPodcastStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8 w-full"
export const episodeNameStyling = "input input-secondary w-full py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"
export const labelEpisodeMediaStyling = "flex items-center text-zinc-400 transition duration-300 ease-in-out hover:text-white my-1 py-2 px-3 w-full cursor-pointer w-full"
export const episodeDescStyling =  "input input-secondary resize-none w-full h-28 pb-12 py-3 px-5 bg-zinc-800 border-0 rounded-xl outline-none focus:ring-2 focus:ring-inset focus:ring-white"


// 3. Custom Functions
const onFileUpload = () => {
    return false
    //params e.target.files?.[0]
}


// 4. Components
export const EpisodeForm = (props: EpisodeFormInter) => {
    const [file, setFile] = useState<File | null>(null);
    const [mediaType, setMediaType] = useState<string>("")
    const [submittingEp, setSubmittingEp] = useState<boolean>(false)
    const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [arweaveAddress_, ] = useRecoilState(arweaveAddress)
    const [uploadCost, setUploadCost] = useState<Number>(0)
    const [yourShows, setYourShows] = useState<any>();

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

    const createEpPayload = {}

    const submitEpisode = (epPayload: any) => {
        return false
    }
    //Submit Episode Function
    return(
        <div className={episodeFormStyling}>
            {/*Select Podcast*/}
            <SelectPodcast
                pid={pid} 
                setPid={setPid}
                shows={props.shows}
            />
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
            <EpisodeMedia />
            {/*Upload Button*/}
            <div className="w-full flex justify-center items-center flex-col">
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

export const EpisodeMedia = () => {
    return (
        <div className={episodeMediaStyling}>
            <input className={inputEpisodeMediaStyling} id="file" required type="file" onChange={(e) => onFileUpload()} name="episodeMedia" />
            <label htmlFor="file" className={labelEpisodeMediaStyling}>
                <FiFile className={episodeFaFileStyling} />
                <div>
                    Episode Media
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

export const SelectPodcast = (props: SelectPodcastInter) => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [_arweaveAddress, _setArweaveAddress] = useRecoilState(arweaveAddress)
    const yourShows = props.shows.filter((item: Podcast) => item.owner === _arweaveAddress)

    let selectedShow;
    if(props.pid.length > 0) {
        selectedShow = yourShows.filter((item: Podcast) => item.pid === props.pid)
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
            <div className={`${containerPodcastModalStyling} ${showModal ? FADE_IN_STYLE :FADE_OUT_STYLE}`}>
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




