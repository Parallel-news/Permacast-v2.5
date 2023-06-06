import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useArconnect } from 'react-arconnect';
import { FiFile } from 'react-icons/fi';

import { Podcast } from '@/interfaces/index';

import { ARSEED_URL, FADE_IN_STYLE, FADE_OUT_STYLE } from '@/constants/index';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '@/constants/arconnect';

import { Icon } from '@/component/icon';

interface EpisodeMediaInter {
    media: File | null;
    setMedia: (v: any) => void;
}

interface UploadButtonInter {
    width?: string;
    disable: boolean;
    click?: () => void
}

interface SelectPodcastInter {
    pid: string;
    setPid: (v: any) => void
    shows: Podcast[]; 
}

interface PodcastOptionInter {
    imgSrc: string;
    title: string;
    disableClick: boolean;
}

interface PodcastSelectOptionsInter {
    imgSrc: string;
    title: string;
    disable: boolean;
    pid: string;
    setPid: (v: any) => void;
}

interface SelectPodcastModalInter {
    isVisible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    setPid: (v: any) => void;
    shows: Podcast[];
}

const trayIconStyling="h-5 w-5 mr-2"
const dollarIconStyling="h-10 w-10 mr-2"
const titleModalStyling = "flex justify-between w-full"
const inputEpisodeMediaStyling = "opacity-0 absolute z-[-1]"
const podcastSelectOptionsStyling = "h-fit w-full space-y-3"
const hrPodcastStyling = "my-5 border-[1px] border-neutral-400/50"
const episodeFaFileStyling = "w-7 h-6 cursor-pointer rounded-lg mx-2"
const episodeMediaStyling = "bg-zinc-800 rounded-xl cursor-pointer w-full"
const selectPodcastModalStyling = "absolute inset-0 top-0 flex justify-center"
const podcastOptionBaseStyling = "w-full flex justify-start items-center space-x-4"
const podcastOptionsContainer = "w-full flex flex-col px-5 overflow-auto h-[120%] mb-[40px]"
const podcastOptionHoverStyling = "cursor-pointer hover:bg-zinc-600/30 transition duration-650 ease-in-out rounded-3xl p-3"
export const containerPodcastModalStyling = "w-[98%] sm:w-[75%] lg:w-[50%] h-[420px] bg-zinc-800 rounded-3xl flex flex-col z-10 mb-0 "
const xMarkStyling = "h-5 w-5 mt-1 cursor-pointer hover:text-red-400 hover:bg-red-400/10 transition duration-400 ease-in-out rounded-full"
const uploadButtonStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8"
const submitModalStyling = "btn btn-secondary transition duration-300 ease-in-out hover:text-white rounded-xl px-8 border-0 text-2xl absolute z-30"
const selectPodcastStyling = "btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8 w-full "
const labelEpisodeMediaStyling = "flex items-center text-zinc-400 transition duration-300 ease-in-out hover:text-white my-1 py-2 px-3 w-full cursor-pointer w-full"

export const EpisodeMedia = (props: EpisodeMediaInter) => {

    const { t } = useTranslation();
    return (
        <div className={episodeMediaStyling}>
            <input className={inputEpisodeMediaStyling} id="file" required type="file" accept="audio/*,video/*" onChange={(e) => props.setMedia(e.target.files?.[0])} name="episodeMedia" />
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
            <Icon className={trayIconStyling} icon={"ARROWUPTRAY"} strokeWidth='0' fill="currentColor"/>
            {t("uploadepisode.upload")}
      </button>
    )
}

export const ConnectButton = (props: UploadButtonInter) => {
    const { t } = useTranslation();

    return (
        <button
            className={`${uploadButtonStyling} ${props.width}`}
            disabled={props.disable}
            onClick={props.click}
        >
            <Icon className={trayIconStyling} icon="WALLET" strokeWidth='1.5'/>
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
            <Icon className={dollarIconStyling} icon="DOLLAR"/>
            {t("tipModal.submitTip")}
      </button>
    )
}

export const SelectPodcast = (props: SelectPodcastInter) => {
    const { t } = useTranslation();

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { address,  } = useArconnect();
    const yourShows = props.shows.filter((item: Podcast) => item.owner === address)

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

    const tx = selectedShow?.[selectedShowIndex]?.minifiedCover;
    return (
        <>
            {props.pid.length === 0 ? 
            <button className={selectPodcastStyling+ " relative"} onClick={() => setIsVisible(prev => !prev)}>
                {t("uploadepisode.select-show")}
            </button>
            :
            <div onClick={() => setIsVisible(true)}>
                <PodcastOption 
                    imgSrc={tx ? ARSEED_URL+tx : ''}
                    title={selectedShow?.[selectedShowIndex]?.podcastName}
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

    const { walletConnected, arconnectConnect } = useArconnect();
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
                    {/*Show Title*/}
                    <p className="text-white text-xl">{t("uploadepisode.select-show")}</p>
                    <Icon className={xMarkStyling} onClick={() => props.setVisible(false)} icon="XMARK"/>
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
                    {!walletConnected ? <p className="text-blue-400 mt-2 text-lg text-center cursor-pointer" onClick={connect}>{t("uploadshow.connect-wallet")}</p>: ""}
                </div>
            </div>
        </div>
    )
}