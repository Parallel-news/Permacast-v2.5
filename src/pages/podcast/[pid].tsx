import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { backgroundColor } from "../../atoms";
import { 
    episodeIconStyling,
    EpisodeInfoButtonsInter,
    episodeInfoButtonsStyling,
    NextEpisode,
    podcastIdStyling,
} from "../../component/episode/eidTools";
import Image from "next/image";
import { DescriptionButton } from "../../component/reusables/buttons";
import { 
    HeartIcon, 
    PlusIcon,
    PlayIcon 
} from '@heroicons/react/24/solid';

export default function PodcastId() {
    const [backgroundColor_, setBackgroundColor_] = useRecoilState(backgroundColor);
    //State Calls Here
    const color = "#818cf8"
    const imgSrc = "/aa.jpg"
    const title = "Ethereum: All Core Devs Meetings"
    const description = "This repository archives permanently the meetings of Ethereum core developers meetings."
    const descriptionLong = "This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings. This repository archives permanently the meetings of Ethereum core developers meetings."
    const creator = "@martonlederer"
    const episodeTitle = "American Rhetoric"
    const nextEpisodeTitle = "Episodes"

    return (
        <div className={podcastIdStyling}>
            <PodcastBanner 
                imgSrc={imgSrc}
                title={title}
                description={description}
                color={color}
            />
            {/*Next Episode*/}
            <NextEpisode 
                containerTitle={nextEpisodeTitle} 
                description={descriptionLong} 
                imgSrc={""}
                creator={creator}
                color={color}
                title={episodeTitle}
            />            
        </div>
    )
}

interface PodcastInfoInter {
    title: string;
    imgSrc: string;
    description: string;
}

interface PodcastBannerInter extends PodcastInfoInter {
    color: string;
}

export const podcastInfoDescStyling = "text-neutral-400 text-[12px]"
export const podcastInfoStyling = "flex flex-row items-center space-x-16"
export const podcastInfoTitleStyling = "text-white text-2xl font-semibold"
export const podcastButtonsStyling = "flex flex-row items-center space-x-6"
export const podcastBannerStyling = "flex flex-row w-full justify-between px-24"
export const podcastInfoTitleDivStyling = "flex flex-col justify-start w-[60%] space-y-2"

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

//Get ServerSide Props