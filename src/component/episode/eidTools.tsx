import { 
    CurrencyDollarIcon, 
    ArrowDownTrayIcon, 
    ArrowTopRightOnSquareIcon, 
    PencilSquareIcon
} from '@heroicons/react/24/solid';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Track from "../reusables/track";
import { useRecoilState } from "recoil";
import { loadingPage } from "../../atoms";
import TextTruncate from "../TextTruncate";
import { useTranslation } from "next-i18next";
import { useArconnect } from "react-arconnect";
import { hexToRGB } from "../../utils/reusables";
import { FullEpisodeInfo } from "../../interfaces";
import { getTypeFromMime } from "../../utils/fileTools";
import { DescriptionButton } from "../reusables/buttons";
import { ARWEAVE_READ_LINK, STR_LEN_EPISODE_DESC } from "../../constants";

/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */

// 1. Interfaces 
export interface EpisodeNumberInter {
    episodeNum: string;
    color: string;
}

export interface DescriptionContainerInter {
    text: string;
}

export interface EpisodeInfoButtonsInter {
    color: string;
    setLoadTipModal: (v: any) => void;
    setLoadShareModal: (v: any) => void;
    podcastId?: string;
    episodeId?: string;
    mediaLink?: string;
    episodeName?: string;
    podcastOwner: string;
    playButton: JSX.Element;
    eid: string;
    pid: string;
}

export interface EpisodeInfoSubInter {
    date: string;
    color: string;
    episodeNum: string;
    podcastName: string;
    pid: string;
}

export interface EpisodeBannerInter extends EpisodeInfoInter {
    imgSrc: string;
    mediaLink: string;
    playButton: JSX.Element;
    
}

export interface EpisodeInfoInter extends EpisodeInfoSubInter {
    title: string;
    setLoadTipModal: () => void;
    setLoadShareModal: () => void;
    mediaLink: string;
    podcastOwner: string;
    eid: string;
    playButton: JSX.Element;

}

export interface CreatorTagInter {
    color: string;
    creator: string;
    imgSrc: string;
}

export interface EpisodeBoxTitleData {
    imgSrc: string;
    creator: string;
    color: string;
    title: string;
    eid: string;
    pid: string;
}

export interface EpisodeBoxInter {
    episode: Episode 
    imgSrc: string;
    color: string;
    podcastId: string;
}


export interface EpisodesInter {
    containerTitle: string;
    episodes: FullEpisodeInfo[]
    color: string; 
    imgSrc: string;
    podcastId: string;
}

export interface Episode {
  eid: string;
  episodeName: string;
  description: string;
  contentTx: string;
  size: number;
  type: string;
  uploader: string;
  uploadedAt: number;
  isVisible: boolean;
}

export interface ErrorTagInter {
    msg: string;
}

// 2. Stylings
export const episodeIconStyling = "w-[20px] h-[20px]"
export const creatorTagDivStyling = "flex flex-row space-x-3"
export const byStyling = "text-neutral-400 text-[12px] inline"
export const episodeInfoButtonsStyling = "flex flex-row items-center space-x-1 sm:space-x-3 md:space-x-6 xl:space-x-8 pt-3 sm:pt-0 w-full"
export const episodeBoxTitleDataImg = "object-cover h-12 rounded-xl"
export const errorTagStyle = "w-full flex justify-center items-center"
export const episodeDateStyling = "text-gray-500 text-[11px] font-bold"
export const creatorTagImgStyling = "object-cover h-4 rounded-full mr-1"
export const errorTagMsgStyle = "text-neutral-400 text-xl font-semibold"
export const episodeBoxTitleStyling = "text-lg text-white font-semibold"
export const episodeBannerStyling = "flex flex-col lg:flex-row w-full space-x-0 lg:space-x-16 space-y-4 lg:space-y-0 items-start justify-start"
export const episodeInfoStyling = "flex flex-col xl:flex-row justify-start items-start lg:items-center space-y-4 px-0 xl:px-2 xl:space-x-8"
export const episodeInfoSubStyling = "flex flex-row items-center space-x-3 justify-start xl:justify-start pb-2"
export const podcastIdStyling = "flex flex-col space-y-8 w-[100%] mb-[200px]"
export const creatorTagStyling = "flex flex-row items-center p-1.5 rounded-3xl"
export const episodeBoxTitleDataStyling = "flex flex-row items-center space-x-3 w-[30%]"
export const nextEpisodeTitleStyling = "text-2xl text-neutral-300/90 font-semibold"
export const episodeNumberStyling = "rounded-2xl bg-gray-400/30 p-2 py-1 text-[11px]"
export const episodeTitleStyling = "select-text text-[25px] md:text-[30px] xl:text-[35px] font-medium pb-0 flex items-end text-left md:text-center lg:text-start pb-0 xl:pb-4"
export const nextEpisodeStyling = "w-full flex flex-col space-y-6  overflow-auto overflow-x-hidden h-[425px]"
export const textTruncateButtonStyling = "text-gray-400 font-bold hover:text-blue-400 transition duration-400 ease-in-out"
export const episodeBoxStyling = "w-[98%] rounded-2xl border-2 border-gray-400/30 p-3 flex flex-row justify-between items-center bg-black"

// 3. Custom Functions

// 4. Components
export const EpisodeBanner = (props: EpisodeBannerInter) => { 
    return (    
        <div className={episodeBannerStyling}>
            <Image
                src={props.imgSrc}
                alt="Episode Cover"
                height={36} //25
                width={242} //225
                className="object-cover rounded-3xl"
            />
            <EpisodeInfo
                title={props.title} 
                color={props.color}
                episodeNum={props.episodeNum}
                date={props.date}
                setLoadTipModal={props.setLoadTipModal}
                setLoadShareModal={props.setLoadShareModal}
                mediaLink={props.mediaLink}
                podcastOwner={props.podcastOwner}
                playButton={props.playButton}
                podcastName={props.podcastName}
                pid={props.pid}
                eid={props.eid}
            />
        </div>
    )
}

export const EpisodeInfo = (props: EpisodeInfoInter) => {
    return (
        <div className={`${episodeInfoStyling} space-y-3 xl:space-y-0 w-full`}>
            <div className="space-y-3 xl:space-y-0 w-full xl:w-[85%]">
                <p className={episodeTitleStyling} style={{color: "rgb(255, 255, 255)"}}>{props.title}</p>
                <EpisodeInfoSub 
                    color={props.color}
                    episodeNum={props.episodeNum}
                    date={props.date}
                    podcastName={props.podcastName}
                    pid={props.pid}
                />
            </div>
            <EpisodeInfoButtons
                color={props.color}
                setLoadTipModal={props.setLoadTipModal}
                setLoadShareModal={props.setLoadShareModal}
                mediaLink={props.mediaLink}
                episodeName={props.title}
                podcastOwner={props.podcastOwner}
                playButton={props.playButton}
                eid={props.eid}
                pid={props.pid}
            />
        </div>
    )
}

export const EpisodeInfoSub = (props: EpisodeInfoSubInter) => {
    const [, _setLoadingPage] = useRecoilState(loadingPage)
    return(
        <>
            <div className={episodeInfoSubStyling}>
                <EpisodeNumber 
                    episodeNum={props.episodeNum}
                    color={props.color}
                />
                <p className={episodeDateStyling}>{props.date}</p>
            </div>
            <Link 
                href={`/podcast/${props.pid}`} 
                className="text-slate-300 text-[16px] font-semibold hover:text-white transition-colors duration-500 pt-2"
                onClick={() => _setLoadingPage(true)}
            >
                {props.podcastName}
            </Link>
        </>
    )
}

export const EpisodeInfoButtons = (props: EpisodeInfoButtonsInter) => {
    const { color, podcastOwner } = props
    const [downloading, setDownloading] = useState<boolean>(false)
    const [, _setLoadingPage] = useRecoilState(loadingPage)
    const { t } = useTranslation();
    const { address } = useArconnect()

    const downloadFile = async () => {
        setDownloading(true)
        const response = await fetch(props.mediaLink);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = props.episodeName+'.'+getTypeFromMime(blob.type);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloading(false)
    };

    return (
        <div className={episodeInfoButtonsStyling}>
            <>{props.playButton}</>
            {address !== podcastOwner && (
            <DescriptionButton
                icon={<CurrencyDollarIcon className={episodeIconStyling} />} 
                text={""}
                color={color} 
                onClick={props.setLoadTipModal}
            />
            )}
            {address === podcastOwner && (
            <Link href={`/edit-episode/${props.pid}/${props.eid}`} onClick={() => _setLoadingPage(true)}>
                <DescriptionButton
                    icon={<PencilSquareIcon className={episodeIconStyling} />} 
                    text={""}
                    color={color} 
                />
            </Link>
            )}
            {downloading ?
            <DescriptionButton
                icon={<span className="animate-ping absolute inline-flex h-[10px] w-[10px] rounded-full bg-white opacity-75"></span>} 
                text={""}
                color={color}
                onClick={() => ""}
            />
            :
            <DescriptionButton
                icon={<ArrowDownTrayIcon className={episodeIconStyling} />} 
                text={""}
                color={color}
                onClick={() => downloadFile()}
            />
            }

            <DescriptionButton
                icon={<ArrowTopRightOnSquareIcon className={episodeIconStyling} />} 
                text={""}
                color={color}
                onClick={props.setLoadShareModal}
            />
        </div>
    )
}

export const EpisodeNumber = (props: EpisodeNumberInter) => {
    const { t } = useTranslation();

    return (
        <p className={episodeNumberStyling} style={{color: props.color}}>{t("episode.number")+" "+props.episodeNum}</p>
    )
}

export const EpisodeDescription = (props: DescriptionContainerInter) => {
    return (
        <div className="w-[100%] md:w-[80%] lg:w-[75%] pt-3 lg:pt-10 text-start select-text">
            <TextTruncate 
                text={ARWEAVE_READ_LINK+props.text}
                limit={STR_LEN_EPISODE_DESC}
                textClass={`text-neutral-400`}
                buttonClass={textTruncateButtonStyling}
                isMarkDown={true}
            />
        </div>
    )
}

export const Episodes = (props: EpisodesInter) => {
    const episodeList = props.episodes
    return (
        <div className={nextEpisodeStyling}>
            <p className={nextEpisodeTitleStyling}>{props.containerTitle}</p>
            {/*Loop Episodes*/}
            {episodeList.length > 0 ?
                episodeList.map((episode: FullEpisodeInfo, index) => (
                    <Track {...{ episode }} includeDescription includePlayButton includeContentType key={index} />
                ))
            :
                <p className="text-neutral-400">None to Show.</p>
            }
        </div>
    )
}

export const CreatorTag = (props: CreatorTagInter) => {
    return (
        <div className={creatorTagStyling} style={{backgroundColor: hexToRGB(props.color, 0.3)}}>
            {props.imgSrc.length > 0 ?
                <Image 
                    src={props.imgSrc}
                    alt="Episode Cover"
                    height={6}
                    width={15}
                    className={creatorTagImgStyling}
                />
                :
                ""
            }
            <p className="text-[10px]" style={{color: props.color}}>{props.creator}</p>
        </div>
    )
}

export const ErrorTag = (props: ErrorTagInter) => {
    return (
        <div className={errorTagStyle}>
            <p className={errorTagMsgStyle}>{props.msg}</p>
        </div>
    )
}
