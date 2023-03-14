import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { backgroundColor } from "../../atoms";
import { 
    podcastIdStyling,
} from "../../component/episode/eidTools";
import Image from "next/image";

export default function PodcastId() {
    const [backgroundColor_, setBackgroundColor_] = useRecoilState(backgroundColor);
    //State Calls Here
    return (
        <div className={podcastIdStyling}>
            <PodcastBanner 
                imgSrc="/aa.jpg"
                title="Ethereum: All Core Devs Meetings"
                description="This repository archives permanently the meetings of Ethereum core developers meetings."
            />
        </div>
    )
}

interface PodcastInfoInter {
    title: string;
    imgSrc: string;
    description: string;
}

interface PodcastBannerInter extends PodcastInfoInter {}

export const podcastInfoDescStyling = "text-neutral-400 text-[12px]"
export const podcastInfoStyling = "flex flex-row items-center space-x-16"
export const podcastInfoTitleStyling = "text-white text-2xl font-semibold"
export const podcastBannerStyling = "flex flex-row w-full justify-between px-12"
export const podcastInfoTitleDivStyling = "flex flex-col justify-start w-[60%] space-y-2"

export const PodcastBanner = (props: PodcastBannerInter) => {
    return (
        <div className={podcastBannerStyling}>
            <PodcastInfo 
                imgSrc={props.imgSrc}
                title={props.title}
                description={props.description}
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

//Get ServerSide Props