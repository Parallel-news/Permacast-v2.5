import Image from 'next/image';
import { FiFile } from 'react-icons/fi';
import { ArrowUpTrayIcon, XMarkIcon, WalletIcon } from '@heroicons/react/24/outline';
import { FADE_IN_STYLE, FADE_OUT_STYLE } from '../../constants';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../../constants/arconnect';
import { useArconnect } from 'react-arconnect';
import { arweaveAddress } from '../../atoms';
import { useRecoilState } from 'recoil';

export default function uploadEpisode() {
    return false
}

// 1. Interfaces
interface SelectPodcastModalInter {
    isVisible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
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

// 2. Styling
export const trayIconStyling="h-5 w-5 mr-2"
export const episodeTitleStyling = "text-white text-xl mt-4"
export const titleModalStyling = "flex justify-between w-full"
export const podcastOptionsContainer = "w-full flex flex-col px-5"
export const inputEpisodeMediaStyling = "opacity-0 absolute z-[-1]"
export const hrPodcastStyling = "my-5 border-[1px] border-neutral-400/50"
export const xBtnModalStyling = "text-neutral-400/75 text-xl cursor-pointer"
export const episodeFaFileStyling = "w-7 h-6 cursor-pointer rounded-lg mx-2"
export const episodeMediaStyling = "bg-zinc-800 rounded-xl cursor-pointer w-full"
export const podcastSelectOptionsStyling = "h-[280px] w-full overflow-auto space-y-3"
export const podcastOptionBaseStyling = "w-full flex justify-start items-center space-x-4"
export const selectPodcastModalStyling = "absolute inset-0 flex justify-center items-center"
export const episodeFormStyling = "w-[50%] flex flex-col justify-center items-center space-y-4"
export const uploadEpisodeStyling = "flex flex-col justify-center items-center m-auto space-y-3 relative pb-[250px]"
export const containerPodcastModalStyling = "w-[50%] h-[100%] bg-zinc-800 rounded-3xl flex flex-col z-10 p-6"
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
export const EpisodeForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [mediaType, setMediaType] = useState<string>("")
    const [submittingEp, setSubmittingEp] = useState<boolean>(false)
    const { address, getPublicKey, createSignature, arconnectConnect } = useArconnect();
    const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    const [arweaveAddress_, ] = useRecoilState(arweaveAddress)
    const [uploadCost, setUploadCost] = useState<Number>(0)

    //Inputs
    const [pid, setPid] = useState<string>("")
    const [epName, setEpName] = useState<string>("")
    const [epDesc, setDescName] = useState<string>("")
    const [epMedia, setEpMedia] = useState(null)
    //Validation

    //Submit Episode Function
    return(
        <div className={episodeFormStyling}>
            {/*Select Podcast*/}
            <SelectPodcast />
            {/*Episode Name*/}
            <input className={episodeNameStyling} required pattern=".{3,500}" title="Between 3 and 500 characters" type="text" name="episodeName" placeholder={"Episode Name"} />
            {/*Episode Description*/}
            <textarea className={episodeDescStyling} required title="Between 1 and 5000 characters" name="episodeShowNotes" placeholder={"Description"}></textarea>
            {/*Episode Media*/}
            <EpisodeMedia />
            {/*Upload Button*/}
            <UploadButton 
                disable={false}
            />
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

export const SelectPodcast = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    return (
        <>
            <button className={selectPodcastStyling+ " relative"} onClick={() => setIsVisible(prev => !prev)}>
                Select Podcast
            </button>
            {isVisible ?
                <SelectPodcastModal 
                    isVisible={isVisible}
                    setVisible={setIsVisible}
                />
            :
            ""
            }
        </>
    )
}

export const PodcastSelectOptions = () => {
    return (
        <div className={podcastSelectOptionsStyling}>
            <PodcastOption 
                imgSrc="/aa.jpg"
                title="American Rhetoric"
                disableClick={false}
            />
                        <PodcastOption 
                imgSrc="/aa.jpg"
                title="American Rhetoric"
                disableClick={false}
            />
                        <PodcastOption 
                imgSrc="/aa.jpg"
                title="American Rhetoric"
                disableClick={false}
            />
                        <PodcastOption 
                imgSrc="/aa.jpg"
                title="American Rhetoric"
                disableClick={false}
            />
                        <PodcastOption 
                imgSrc="/aa.jpg"
                title="American Rhetoric"
                disableClick={false}
            />
                        <PodcastOption 
                imgSrc="/aa.jpg"
                title="American Rhetoric"
                disableClick={false}
            />
                        <PodcastOption 
                imgSrc="/aa.jpg"
                title="American Rhetoric"
                disableClick={false}
            />
                        <PodcastOption 
                imgSrc="/aa.jpg"
                title="American Rhetoric"
                disableClick={false}
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
                    <PodcastSelectOptions />
                </div>
            </div>
        </div>
    )
}




