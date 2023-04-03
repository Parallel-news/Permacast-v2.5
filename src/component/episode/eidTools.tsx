import Image from "next/image";
import { DescriptionButton } from "../reusables/buttons";
import { 
    HeartIcon, 
    ArrowDownTrayIcon, 
    ArrowTopRightOnSquareIcon, 
    PlayIcon 
} from '@heroicons/react/24/solid';
import TextTruncate from "../TextTruncate";
import { formatStringByLen, hexToRGB } from "../../utils/reusables";
import { ARWEAVE_READ_LINK, STR_LEN_EPISODE_BOX, STR_LEN_EPISODE_DESC, ARSEED_URL } from "../../constants";
import { useState } from "react";
import { getTypeFromMime } from "../../utils/fileTools";
import { useTranslation } from "react-i18next";
import FeaturedPodcastPlayButton from "../home/featuredPodcastPlayButton";


export default function eidTools() {
    return false
}

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
    mediaLink?: string;
    episodeName?: string;
    podcastOwner: string;
    playButton: JSX.Element;
}

export interface EpisodeInfoSubInter {
    date: string;
    color: string;
    episodeNum: string;
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
    episodes: Episode[]
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
export const episodeIconStyling = "mr-2 w-4 h-4"
export const creatorTagDivStyling = "flex flex-row space-x-3"
export const byStyling = "text-neutral-400 text-[12px] inline"
export const episodeInfoButtonsStyling = "flex flex-row space-x-6"
export const episodeBoxTitleDataImg = "object-cover h-12 rounded-xl"
export const errorTagStyle = "w-full flex justify-center items-center"
export const episodeDateStyling = "text-gray-500 text-[11px] font-bold"
export const creatorTagImgStyling = "object-cover h-4 rounded-full mr-1"
export const errorTagMsgStyle = "text-neutral-400 text-xl font-semibold"
export const episodeBoxTitleStyling = "text-lg text-white font-semibold"
export const episodeBannerStyling = "flex flex-row w-full h-60 space-x-16"
export const episodeInfoStyling = "flex flex-col justify-center space-y-4"
export const episodeInfoSubStyling = "flex flex-row items-center space-x-3"
export const podcastIdStyling = "flex flex-col space-y-8 w-[95%] mb-[200px]"
export const creatorTagStyling = "flex flex-row items-center p-1.5 rounded-3xl"
export const episodeBoxTitleDataStyling = "flex flex-row items-center space-x-3 w-[30%]"
export const nextEpisodeTitleStyling = "text-2xl text-neutral-300/90 font-semibold"
export const episodeNumberStyling = "rounded-2xl bg-gray-400/30 p-2 py-1 text-[11px]"
export const episodeTitleStyling = "text-[40px] font-medium pb-0 flex items-end"
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
                height={25}
                width={225}
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
            />
        </div>
    )
}

export const EpisodeInfo = (props: EpisodeInfoInter) => {
    return (
        <div className={episodeInfoStyling}>
            <p className={episodeTitleStyling} style={{color: props.color}}>{props.title}</p>
            <EpisodeInfoSub 
                color={props.color}
                episodeNum={props.episodeNum}
                date={props.date}
            />
            <EpisodeInfoButtons
                color={props.color}
                setLoadTipModal={props.setLoadTipModal}
                setLoadShareModal={props.setLoadShareModal}
                mediaLink={props.mediaLink}
                episodeName={props.title}
                podcastOwner={props.podcastOwner}
                playButton={props.playButton}
            />
        </div>
    )
}

export const EpisodeInfoSub = (props: EpisodeInfoSubInter) => {
    return(
        <div className={episodeInfoSubStyling}>
            <EpisodeNumber 
                episodeNum={props.episodeNum}
                color={props.color}
            />
            <p className={episodeDateStyling}>{props.date}</p>
        </div>
    )
}

export const EpisodeInfoButtons = (props: EpisodeInfoButtonsInter) => {
    const { color } = props
    const [downloading, setDownloading] = useState<boolean>(false)
    const { t } = useTranslation();

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
            {props.playButton}
            <DescriptionButton
                icon={<HeartIcon className={episodeIconStyling} />} 
                text={t("tip")}
                color={color} 
                onClick={props.setLoadTipModal}
            />
            {downloading ?
            <DescriptionButton
                icon={<ArrowDownTrayIcon className={episodeIconStyling} />} 
                text={"Fetching"}
                color={color}
                onClick={() => ""}
            />
            :
            <DescriptionButton
                icon={<ArrowDownTrayIcon className={episodeIconStyling} />} 
                text={"Download"}
                color={color}
                onClick={() => downloadFile()}
            />
            }

            <DescriptionButton
                icon={<ArrowTopRightOnSquareIcon className={episodeIconStyling} />} 
                text={"Share"}
                color={color}
                onClick={props.setLoadShareModal}
            />
        </div>
    )
}

export const EpisodeNumber = (props: EpisodeNumberInter) => {
    const { t } = useTranslation();

    return (
        <p className={episodeNumberStyling} style={{color: props.color}}>{"Episode"+" "+props.episodeNum}</p>
    )
}

export const EpisodeDescription = (props: DescriptionContainerInter) => {
    return (
        <div className="w-full pt-10">
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
    const { t } = useTranslation()
    return (
        <div className={nextEpisodeStyling}>
            <p className={nextEpisodeTitleStyling}>{props.containerTitle}</p>
            {/*Loop Episodes*/}
            {episodeList.length > 0 ?
                episodeList.map((item, index) => (
                    <EpisodeBox
                        key={index}
                        episode={item}
                        imgSrc={props.imgSrc}
                        color={props.color}
                        podcastId={props.podcastId}
                    />
                ))
            :
                <p className="text-neutral-400">None to Show.</p>
            }
        </div>
    )
}

export const EpisodeBox = (props: EpisodeBoxInter) => {
    const uploader = props.episode.uploader
    return  (
        <div className={episodeBoxStyling}>
            {/*Title Data*/}
            <EpisodeBoxTitleData 
                imgSrc={props.imgSrc}
                creator={uploader.length > 15 ? formatStringByLen(uploader, 4, 4) : uploader}
                color={props.color}
                title={props.episode.episodeName}
                eid={props.episode.eid}
                pid={props.podcastId}
            />
            {/*Episode Description*/}
            <div className="w-[50%]">
                <TextTruncate 
                    text={ARSEED_URL+props.episode.description}
                    limit={STR_LEN_EPISODE_BOX}
                    textClass="text-neutral-400 text-[12px]"
                    buttonClass={textTruncateButtonStyling+" text-[13px]"}
                    isMarkDown={true}
                />
            </div>
            {/*Play Button*/}
            <DescriptionButton 
                icon={<PlayIcon className="w-6 h-6" />}
                text={""}
                color={props.color}
            />
        </div>
    )
}

export const EpisodeBoxTitleData = (props: EpisodeBoxTitleData) => {
    const { t } = useTranslation();
    return (
        <div className={episodeBoxTitleDataStyling}>
            <Image 
                src={props.imgSrc}
                alt="Episode Cover"
                height={30}
                width={50}
                className={episodeBoxTitleDataImg}
            />
            <div className="flex flex-col">
                <a href={`/episode/${props.pid}/${props.eid}`} className={episodeBoxTitleStyling+" mb-1"}>{props.title}</a>
                <div className={creatorTagDivStyling}>
                    <p className={byStyling}>{"by"}</p>
                    <CreatorTag color={props.color} creator={props.creator} imgSrc={props.imgSrc}/>
                </div>
            </div>
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
