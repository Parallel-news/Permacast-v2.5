import Image from "next/image";
import React, { useEffect, useState } from "react";
import { 
    HeartIcon, 
    PlusIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/solid';
import { RssIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "next-i18next";
import { RSS_FEED_URL } from "../../constants";
import Link from "next/link";
import { useArconnect } from "react-arconnect";
import { queryMarkdownByTX } from "../../utils/markdown";
import MarkdownRenderer from "../markdownRenderer";

const DescriptionButton = React.lazy(() => import("../reusables/buttons").then(module => ({ default: module.DescriptionButton })));

export interface PodcastInfoInter {
    title: string;
    imgSrc: string;
    description: string;
    color: string;
}

interface EpisodeInfoButtonsInter {
    color: string;
    setLoadTipModal: (v: any) => void;
    setLoadShareModal: (v: any) => void;
    podcastId?: string;
    mediaLink?: string;
    episodeName?: string;
    podcastOwner: string;
    playButton: JSX.Element;
}

const podcastInfoStyling = "items-center space-x-16 justify-start xl:justify-start hidden xl:flex xl:flex-row"
const podcastInfoTitleStyling = "text-3xl font-semibold select-text items-start justify-start"
const podcastButtonsStyling = "flex flex-row items-center space-x-6 justify-start"
const podcastInfoTitleDivStyling = "flex flex-col ml-0 m-0 mr-[64px]"
const episodeIconStyling = "mr-2 w-4 h-4"

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
export const PodcastInfoMobile = (props: PodcastInfoInter) => {

    const [markdownText, setMarkdownText] = useState('');

    useEffect(() => {
        queryMarkdownByTX(props.description).then(setMarkdownText);
    }, []);

    return (
        <div className="flex flex-col justify-start items-start px-0 xl:px-4 xl:hidden space-y-6">
            <Image
                src={props.imgSrc}
                alt="Podcast Cover"
                height={25}
                width={150}
                className="object-cover rounded-3xl"
            />
            <p className="text-3xl text-white select-text flex items-start justify-start">{props.title}</p>
            <MarkdownRenderer markdownText={markdownText} color={props.color === "rgb(0, 0, 0)" ? 'text-black' : 'text-white'} align="text-left"/>
        </div>
    )
}

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