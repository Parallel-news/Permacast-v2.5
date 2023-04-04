import Image from "next/image";
import { DescriptionButton } from "../../component/reusables/buttons";
import { 
    HeartIcon, 
    PlusIcon,
    PlayIcon, 
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/solid';
import { Episode, episodeIconStyling, EpisodeInfoButtonsInter } from "../episode/eidTools";
import { useEffect, useState } from "react";
import MarkdownRenderer from "../markdownRenderer";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { loadTipModal } from "../../atoms";
import { useArconnect } from "react-arconnect";
import { useTranslation } from "next-i18next";
import { queryMarkdownByTX } from "../../utils/markdown";
import { RssIcon } from "@heroicons/react/24/solid";
import { PERMACAST_HELPER_URL, RSS_FEED_URL } from "../../constants";
import i18n from 'i18next';

export default function pidTools() {
    return false
}

// 1. Interfaces
export interface PodcastInfoInter {
    title: string;
    imgSrc: string;
    description: string;
    color: string;
}

export interface PodcastBannerInter extends PodcastInfoInter {
    color: string;
    setLoadTipModal: (v: any) => void;
    setLoadShareModal: (v: any) => void;
    podcastId: string;
    podcastOwner: string;
    playButton: JSX.Element;
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
export const podcastInfoStyling = "flex flex-row items-center space-x-16 select-text"
export const podcastInfoTitleStyling = "text-3xl font-semibold select-text"
export const podcastButtonsStyling = "flex flex-row items-center space-x-6"
export const podcastBannerStyling = "flex flex-row w-full justify-between px-24"
export const podcastInfoTitleDivStyling = "flex flex-col justify-start w-[60%] space-y-2"

// 3. Custom Functions

//4. Custom Components
export const PodcastInfo = (props: PodcastInfoInter) => {

    const [markdownText, setMarkdownText] = useState('');

    useEffect(() => {
        queryMarkdownByTX(props.description).then(setMarkdownText);
    }, []);

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
                <MarkdownRenderer markdownText={markdownText} color={props.color === "rgb(0, 0, 0)" ? 'text-black' : 'text-white'}/>
            </div>
        </div>
    )
}
//style={{color: props.color}}
export const PodcastButtons = (props: EpisodeInfoButtonsInter) => {
    const { t } = useTranslation();
    const { color, podcastId } = props
    const { address } = useArconnect()
    return (
        <div className={podcastButtonsStyling}>
            {props.playButton}

            <DescriptionButton
                icon={<HeartIcon className={episodeIconStyling} />} 
                text={t("tip")}
                color={color}
                onClick={props.setLoadTipModal} 
            />
            {address === props.podcastOwner && (
            <Link href={`/upload-episode?pid=${props.podcastId}`}>
                <DescriptionButton
                    icon={<PlusIcon className={episodeIconStyling} />} 
                    text={t("episode.number")}
                    color={color}
                />
            </Link>
            )}
            <DescriptionButton
                icon={<ArrowTopRightOnSquareIcon className={episodeIconStyling} />} 
                text={t("share.share")}
                color={color}
                onClick={props.setLoadShareModal}
            />
            <a target="_blank" rel="noreferrer" href={RSS_FEED_URL + podcastId}>
                <DescriptionButton
                    icon={<RssIcon className={episodeIconStyling} />}
                    text={"rss"}
                    color={color}
                />
            </a>
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
                color={props.color}
            />
            <PodcastButtons 
                color={props.color}
                setLoadTipModal={props.setLoadTipModal}
                podcastId={props.podcastId}
                podcastOwner={props.podcastOwner}
                setLoadShareModal={props.setLoadShareModal}
                playButton={props.playButton}
            />
        </div>
    )
    //Hold Podcast Data and Podcast buttons
}