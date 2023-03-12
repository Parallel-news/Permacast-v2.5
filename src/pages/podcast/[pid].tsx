import Image from "next/image"
import { DescriptionButton } from "../../component/reusables/buttons"
import { 
    HeartIcon, 
    ArrowDownTrayIcon, 
    ArrowTopRightOnSquareIcon, 
    PlayIcon 
} from '@heroicons/react/24/solid';
import { 
    DescriptionContainerInter,
    EpisodeInfoButtonsInter,
    EpisodeInfoSubInter,
    EpisodeNumberInter,
    EpisodeInfoInter,
    EpisodeBannerInter,
    episodeDateStyling,
    episodeIconStyling,
    episodeInfoStyling,
    episodeInfoSubStyling,
    episodeNumberStyling, 
    episodeTitleStyling,
    podcastIdStyling,
    episodeBannerStyling,
    episodeInfoButtonsStyling
} from "./pidTools";

export default function PodcastId() {
    //State Calls Here
    const DummyDesc = `The All-American Rejects are an American rock band from Stillwater, Oklahoma, formed in 1999.[4] The band consists of lead vocalist and bassist Tyson Ritter, lead guitarist and backing vocalist Nick Wheeler, rhythm guitarist and backing vocalist Mike Kennerty, and drummer Chris Gaylor. Wheeler and Ritter serve as the band's songwriters; Wheeler is the primary composer and Ritter is the primary lyricist. Although Kennerty and Gaylor are not founding members, they have appeared in all of the band's music videos and on all studio releases except for the band's self-titled debut.`
    const title = "All Core Devs: Meeting 9"
    const imgSrc = "/aa.jpg"
    const color = "#818cf8"
    const episodeNum = "1"
    const date = "May 10, 2022"
    
    return (
        <div className={podcastIdStyling}>
            {/*Episode Cover & Info*/}
            <EpisodeBanner 
                title={title}
                imgSrc={imgSrc}
                color={color}
                episodeNum={episodeNum}
                date={date}
            />
            {/*Episode Description*/}
            <EpisodeDescription 
                text={DummyDesc} 
            />
        </div>
    )
}

const EpisodeBanner = (props: EpisodeBannerInter) => { 
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

const EpisodeInfo = (props: EpisodeInfoInter) => {
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

const EpisodeInfoSub = (props: EpisodeInfoSubInter) => {
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

const EpisodeInfoButtons = (props: EpisodeInfoButtonsInter) => {
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

const EpisodeNumber = (props: EpisodeNumberInter) => {
    return (
        <p className={episodeNumberStyling} style={{color: props.color}}>Episode {props.episodeNum}</p>
    )
}

const EpisodeDescription = (props: DescriptionContainerInter) => {
    return (
        <div className="w-full">
            <p className="text-neutral-400">{props.text}</p>
        </div>
    )
}