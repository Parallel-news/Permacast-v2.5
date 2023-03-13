import Image from "next/image";
import { DescriptionButton } from "../reusables/buttons";
import { 
    HeartIcon, 
    ArrowDownTrayIcon, 
    ArrowTopRightOnSquareIcon, 
    PlayIcon 
} from '@heroicons/react/24/solid';
import TextTruncate from "../TextTruncate";
import { hexToRGB } from "../../utils/reusables";

export default function pidTools() {
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
}

export interface EpisodeInfoSubInter {
    date: string;
    color: string;
    episodeNum: string;
}

export interface EpisodeBannerInter extends EpisodeInfoInter {
    imgSrc: string;
}

export interface EpisodeInfoInter extends EpisodeInfoSubInter {
    title: string;
}

// 2. Stylings
export const episodeIconStyling = "mr-2 w-4 h-4"
export const podcastIdStyling = "flex flex-col space-y-8 w-[75%]"
export const nextEpisodeStyling = "w-full flex flex-col space-y-6"
export const episodeInfoButtonsStyling = "flex flex-row space-x-6"
export const episodeDateStyling = "text-gray-500 text-[11px] font-bold"
export const episodeBannerStyling = "flex flex-row w-full h-60 space-x-16"
export const episodeInfoStyling = "flex flex-col justify-center space-y-4"
export const episodeInfoSubStyling = "flex flex-row items-center space-x-3"
export const creatorTagStyling = "flex flex-row items-center p-1.5 rounded-3xl"
export const nextEpisodeTitleStyling = "text-2xl text-neutral-300/90 font-semibold"
export const episodeNumberStyling = "rounded-2xl bg-gray-400/30 p-2 py-1 text-[11px]"
export const episodeBoxStyling = "w-full rounded-2xl border-2 border-gray-400/30 h-fit p-3"
export const episodeTitleStyling = "text-white text-[40px] font-medium pb-0 flex items-end"
export const textTruncateButtonStyling = "text-gray-400 font-bold hover:text-blue-400 transition duration-400 ease-in-out"


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
            />
        </div>
    )
}

export const EpisodeInfo = (props: EpisodeInfoInter) => {
    return (
        <div className={episodeInfoStyling}>
            <p className={episodeTitleStyling}>{props.title}</p>
            <EpisodeInfoSub 
                color={props.color}
                episodeNum={props.episodeNum}
                date={props.date}
            />
            <EpisodeInfoButtons
                color={props.color}
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
    return (
        <div className={episodeInfoButtonsStyling}>
            <DescriptionButton 
                icon={<PlayIcon className="w-6 h-6" />}
                text={""}
                color={color}
            />
            <DescriptionButton
                icon={<HeartIcon className={episodeIconStyling} />} 
                text={"Tip"}
                color={color} 
            />
            <DescriptionButton
                icon={<ArrowDownTrayIcon className={episodeIconStyling} />} 
                text={"Download"}
                color={color}
            />
            <DescriptionButton
                icon={<ArrowTopRightOnSquareIcon className={episodeIconStyling} />} 
                text={"Share"}
                color={color}
            />
        </div>
    )
}

export const EpisodeNumber = (props: EpisodeNumberInter) => {
    return (
        <p className={episodeNumberStyling} style={{color: props.color}}>Episode {props.episodeNum}</p>
    )
}

export const EpisodeDescription = (props: DescriptionContainerInter) => {
    return (
        <div className="w-full">
            <TextTruncate 
                text={props.text}
                limit={400}
                textClass="text-neutral-400"
                buttonClass={textTruncateButtonStyling}
            />
        </div>
    )
}

export const NextEpisode = () => {
    return (
        <div className={nextEpisodeStyling}>
            <p className={nextEpisodeTitleStyling}>Next Episode</p>
            <EpisodeBox />
        </div>
    )
}

export const EpisodeBox = () => {
    return  (
        <div className={episodeBoxStyling}>
            <EpisodeBoxTitleData />
        </div>
    )
}

export const EpisodeBoxTitleData = () => {
    return (
        <div className="flex flex-row items-center space-x-3">
            <Image 
                src="/aa.jpg"
                alt="Episode Cover"
                height={30}
                width={50}
                className="object-cover h-12 rounded-xl"
            />
            <div className="flex flex-col">
                <p className="text-lg text-white font-semibold">American Rhetoric</p>
                <div className="flex flex-row space-x-3">
                    <p className="text-neutral-400 text-[12px] inline">by</p>
                    <CreatorTag color={"#c084fc"} creator={"@martonlederer"} imgSrc={"/aa.jpg"}/>
                </div>
            </div>
        </div>
    )
}

interface CreatorTagInter {
    color: string;
    creator: string;
    imgSrc: string;
}
export const CreatorTag = (props: CreatorTagInter) => {
    return (
        <div className={} style={{backgroundColor: hexToRGB(props.color, 0.3)}}>
            {props.imgSrc.length > 0 ?
                <Image 
                    src={props.imgSrc}
                    alt="Episode Cover"
                    height={6}
                    width={15}
                    className="object-cover h-4 rounded-full mr-1"
                />
                :
                ""
            }
            <p className="text-[10px]" style={{color: props.color}}>{props.creator}</p>
        </div>
    )
}