import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useArconnect } from "react-arconnect";
import { useRecoilState } from "recoil";
import { Modal } from "@nextui-org/react";

import { HeartIcon, PlusIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { RssIcon } from "@heroicons/react/24/solid";

import MarkdownRenderer from "../markdownRenderer";

import { allANSUsersAtom } from "../../atoms";
import { RSS_FEED_URL } from "../../constants";
import { ButtonStyle } from "../reusables/track";
import { ANSMapped } from "../../interfaces";
import { queryMarkdownByTX } from "../../utils/markdown";
import {
    RGBAstringToObject,
    RGBobjectToString,
    RGBstringToObject,
    fetchDominantColor,
    getButtonRGBs,
    getCoverColorScheme
} from "../../utils/ui";

const TrackCreatorLink = React.lazy(() => import("../reusables/track").then(module => ({ default: module.TrackCreatorLink })));
const DescriptionButton = React.lazy(() => import("../reusables/buttons").then(module => ({ default: module.DescriptionButton })));

export interface PodcastInfoInter {
    title: string;
    imgSrc: string;
    description: string;
    color: string;
    owner?: string;
    episodes?: number;
    length?: number;
};

interface EpisodeInfoButtonsInter {
    color: string;
    setLoadTipModal: (v: any) => void;
    setLoadShareModal: (v: any) => void;
    podcastId?: string;
    mediaLink?: string;
    episodeName?: string;
    podcastOwner: string;
    playButton: JSX.Element;
};

const podcastInfoStyling = "items-center space-x-16 justify-start xl:justify-start hidden xl:flex xl:flex-row";
const podcastInfoTitleStyling = "text-4xl font-semibold select-text items-start justify-start text-white ";
const podcastButtonsStyling = "flex flex-row items-center space-x-6 justify-start";
const podcastInfoTitleDivStyling = "flex flex-col ml-0 m-0 pr-8";
const episodeIconStyling = "mr-2 w-4 h-4";

export const PodcastInfo = (props: PodcastInfoInter) => {

    const {
        title,
        imgSrc,
        description,
        color,
        owner,
        episodes,
        length,
    } = props;

    const [allANSUsers, setAllANSUsers] = useRecoilState(allANSUsersAtom);

    const [coverModalOpen, setCoverModalOpen] = useState<boolean>(false);
    const [descriptionModalOpen, setDescriptionModalOpen] = useState<boolean>(false);

    const [markdownText, setMarkdownText] = useState<string>('');
    const [coverColor, setCoverColor] = useState<string>('');
    const [uploader, setUploader] = useState<string>('');
    const [buttonStyles, setButtonStyles] = useState<ButtonStyle>({ backgroundColor: '', color: '' })

    useEffect(() => {
      const ANS = allANSUsers.find((user: ANSMapped) => user.address === owner);
      if (ANS) setUploader(ANS.primary + ".ar");
      else setUploader(owner);
    }, [])

    useEffect(() => {
      const fetchData = async () => {
        if (!imgSrc) return;
        const dominantColor = await fetchDominantColor(imgSrc.split('/')[3]);
        if (dominantColor.error) return;
        const [coverColor, textColor] = getCoverColorScheme(dominantColor.rgba);
        setCoverColor(coverColor);
        const { r, g, b } = RGBAstringToObject(coverColor);
        const RGBstring = RGBobjectToString({ r, g, b });
        const buttonStyles = getButtonRGBs(RGBstringToObject(RGBstring));
        setButtonStyles(buttonStyles);
        const markdown = (await queryMarkdownByTX(description));
        setMarkdownText(markdown);
      };
      fetchData();
    }, []);

    return (
        <div className={podcastInfoStyling}>
            <Modal open={coverModalOpen} onClose={() => setCoverModalOpen(false)} className={`bg-transparent text-white `}>
                <Image
                    src={imgSrc}
                    alt="Podcast Cover"
                    height={700}
                    width={700}
                    loading="eager"
                    priority
                    className="object-cover rounded-md width-[700px] height-[700px]"
                />
                <p className={podcastInfoTitleStyling + " mt-2"}>{title}</p>
            </Modal>
            <Modal open={descriptionModalOpen} onClose={() => setDescriptionModalOpen(false)} className={`bg-black rounded-lg text-white cursor-auto`}>
                <MarkdownRenderer markdownText={markdownText} color={'text-white bg-black/10 p-4 '} />
            </Modal>
            <button className="h-[200px] w-[200px] flex-shrink-0" onClick={() => setCoverModalOpen(true)}>
                <Image
                    src={imgSrc}
                    alt="Podcast Cover"
                    height={200}
                    width={200}
                    className="object-cover rounded-md cursor-pointer w-full h-full"
                />
            </button>
            <div className={podcastInfoTitleDivStyling}>
                <p className={podcastInfoTitleStyling}>{title}</p>
                <button onClick={() => setDescriptionModalOpen(true)} className="text-left">
                    <MarkdownRenderer markdownText={markdownText} color={'text-white line-clamp-3 '} />
                </button>
                <div className="max-w-max mt-3">
                    <TrackCreatorLink {...{ uploader, buttonStyles, coverColor }} />
                </div>
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
                className="object-cover rounded-md"
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
            {address === props.podcastOwner && (
            <Link href={`/edit-podcast/${props.podcastId}`}>
                <DescriptionButton
                    icon={<PlusIcon className={episodeIconStyling} />} 
                    text={t("edit")}
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


/*
Documentos

650,000  to runt  certificacion de comercio al banco

$700,000

balance de apertura para el banco y certificacion nacional accionaria  290,000 

certicacion accionaria - 



*/