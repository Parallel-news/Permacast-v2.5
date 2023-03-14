import Image from "next/image";
import { DescriptionButton } from "../../component/reusables/buttons";
import { 
    HeartIcon, 
    PlusIcon,
    PlayIcon 
} from '@heroicons/react/24/solid';
import { Episode, episodeIconStyling, EpisodeInfoButtonsInter } from "../episode/eidTools";

export default function pidTools() {
    return false
}

// 1. Interfaces
export interface PodcastInfoInter {
    title: string;
    imgSrc: string;
    description: string;
}

export interface PodcastBannerInter extends PodcastInfoInter {
    color: string;
}

interface Podcast {
    pid: string;
    label: string;
    contentType: string;
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
    maintainers: string[];
    cover: string;
    isVisible: boolean;
    episodes: Episode[];
}

// 2. Stylings
export const podcastInfoDescStyling = "text-neutral-400 text-[12px]"
export const podcastInfoStyling = "flex flex-row items-center space-x-16"
export const podcastInfoTitleStyling = "text-white text-2xl font-semibold"
export const podcastButtonsStyling = "flex flex-row items-center space-x-6"
export const podcastBannerStyling = "flex flex-row w-full justify-between px-24"
export const podcastInfoTitleDivStyling = "flex flex-col justify-start w-[60%] space-y-2"

// 3. Custom Functions

//4. Custom Components
export const PodcastInfo = (props: PodcastInfoInter) => {
    return (
        <div className={podcastInfoStyling}>
            <Image
                src={props.imgSrc}
                alt="Podcast Cover"
                height={25}
                width={150}
                className="object-cover rounded-3xl"
            />
            <div className={podcastInfoTitleDivStyling}>
                <p className={podcastInfoTitleStyling}>{props.title}</p>
                <p className={podcastInfoDescStyling}>{props.description}</p>
            </div>
        </div>
    )
}

export const PodcastButtons = (props: EpisodeInfoButtonsInter) => {
    const { color } = props
    return (
        <div className={podcastButtonsStyling}>
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
                icon={<PlusIcon className={episodeIconStyling} />} 
                text={"Add Episode"}
                color={color}
            />
        </div>
    )
}

export const PodcastBanner = (props: PodcastBannerInter) => {
    return (
        <div className={podcastBannerStyling}>
            <PodcastInfo 
                imgSrc={props.imgSrc}
                title={props.title}
                description={props.description}
            />
            <PodcastButtons 
                color={props.color}
            />
        </div>
    )
    //Hold Podcast Data and Podcast buttons
}