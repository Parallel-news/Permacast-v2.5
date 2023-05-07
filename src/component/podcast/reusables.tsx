import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import React, { FC, useEffect, useState } from "react";
import { useArconnect } from "react-arconnect";
import { useRecoilState } from "recoil";
import { Divider, Modal } from "@nextui-org/react";

import {
    CurrencyDollarIcon,
    PlusIcon,
    ArrowTopRightOnSquareIcon,
    ArrowsPointingOutIcon,
    RssIcon,
    HashtagIcon,
    LanguageIcon,
    AtSymbolIcon,
    PencilSquareIcon
} from "@heroicons/react/24/solid";

import MarkdownRenderer from "../markdownRenderer";
import { getCategoryInCurrentLanguage, useLanguageHook } from "../../utils/languages";

import { allANSUsersAtom, loadingPage } from "../../atoms";
import { RSS_FEED_URL } from "../../constants";
import { ButtonStyle } from "../reusables/track";
import { ANSMapped, Podcast } from "../../interfaces";
import { queryMarkdownByTX } from "../../utils/markdown";
import {
    RGBAstringToObject,
    RGBobjectToString,
    RGBstringToObject,
    fetchDominantColor,
    getButtonRGBs,
    getCoverColorScheme
} from "../../utils/ui";
import { getFormattedTimeStamp } from "../../utils/reusables";

const TrackCreatorLink = React.lazy(() => import("../reusables/track").then(module => ({ default: module.TrackCreatorLink })));
const DescriptionButton = React.lazy(() => import("../reusables/buttons").then(module => ({ default: module.DescriptionButton })));

export interface PodcastInfoInter {
    podcast?: Podcast;
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
const podcastInfoTitleStyling = `font-semibold select-text items-start justify-start text-white flexCenterGap `;
const podcastTitlePreviewStyling = podcastInfoTitleStyling + ` text-4xl line-clamp-3 `;
const podcastTitleModalStyling = podcastInfoTitleStyling + ` text-xl mt-2 `;
const podcastButtonsStyling = "flex flex-row items-center space-x-6 justify-start";
const podcastInfoTitleDivStyling = "flex flex-col ml-0 m-0 pr-8";
const episodeIconStyling = "w-[20px] h-[20px]";
const coloredButtonPaddingStying = `rounded-full px-2 py-0.5 `;

export const PodcastInfo: FC<PodcastInfoInter> = ({
    podcast,
    title,
    imgSrc,
    description,
    owner
}) => {
    const { t } = useTranslation();
    const [languagesArray, categoriesArray] = useLanguageHook();
    const [allANSUsers, setAllANSUsers] = useRecoilState(allANSUsersAtom);

    const [coverModalOpen, setCoverModalOpen] = useState<boolean>(false);
    const [descriptionModalOpen, setDescriptionModalOpen] = useState<boolean>(false);

    const [markdownText, setMarkdownText] = useState<string>('');
    const [coverColor, setCoverColor] = useState<string>('');
    const [uploader, setUploader] = useState<string>('');
    const [buttonStyles, setButtonStyles] = useState<ButtonStyle>({ backgroundColor: '', color: '' });
    const category = getCategoryInCurrentLanguage(categoriesArray, podcast.categories[0]);
    let adjCategory = undefined
    if(category) {
        adjCategory = category[1]
    }
    const language = languagesArray.find(item => item[0] === podcast.language)[1]
    const formattedDate = getFormattedTimeStamp(podcast.createdAt);

    const ExpandIcon = () => <ArrowsPointingOutIcon className="w-4 h-4 " />;

    useEffect(() => {
      const ANS = allANSUsers.find((user: ANSMapped) => user.address === owner);
      if (ANS) setUploader(ANS.primary + ".ar");
      else setUploader(owner);
    }, [allANSUsers]);

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
            <Modal open={coverModalOpen} onClose={() => setCoverModalOpen(false)} className={`bg-transparent text-white cursor-auto rounded-none `}>
                <Image
                    src={imgSrc}
                    alt="Podcast Cover"
                    height={700}
                    width={700}
                    loading="eager"
                    priority
                    className="object-cover width-[700px] height-[700px]"
                />
            </Modal>
            <Modal 
                open={descriptionModalOpen}
                onClose={() => setDescriptionModalOpen(false)}
                className={`bg-zinc-900 rounded-lg text-white cursor-auto flexColCenter p-4 `}
            >
                <p className={podcastTitleModalStyling}>{title}</p>
                <Divider className="h-0.5 my-4 bg-white" />
                <MarkdownRenderer markdownText={markdownText} color={'text-white '} />
                <Divider className="h-0.5 my-4 bg-white" />
                <div className="flexColCenter">
                    <div className="flexCenter gap-x-0.5">
                        <AtSymbolIcon className="w-4 h-4 mt-0.5" />
                        {podcast?.email || "N/A"}
                    </div>
                    <div>{podcast?.episodes?.length} {t("episodes")}</div>
                    {adjCategory && (
                    <div className="flexCenter gap-x-0.5">
                        <HashtagIcon className="w-4 h-4 " />
                        {adjCategory}
                    </div>
                    )}
                    <div className="flexCenter gap-x-0.5">
                        <LanguageIcon className="w-4 h-4 " />
                        {language}
                    </div>
                </div>
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
                <h1 className={podcastTitlePreviewStyling}>
                    {title}
                </h1>
                <MarkdownRenderer markdownText={markdownText} color={'line-clamp-3 text-white text-sm '} />
                {(buttonStyles.backgroundColor && buttonStyles.color) && (
                    <div className="flexCenterGap mt-3 flex-wrap gap-2">
                        <div className="max-w-max">
                            <TrackCreatorLink {...{ uploader, buttonStyles, coverColor, fontSize: 16 }} />
                        </div>
                        <div className={coloredButtonPaddingStying} style={buttonStyles}>
                            {formattedDate}
                        </div>
                        {/* <div className={coloredButtonPaddingStying} style={buttonStyles}>
                            {t("episodes")}: {podcast?.episodes?.length}
                        </div> */}
                    
                        <button
                            onClick={() => setDescriptionModalOpen(true)}
                            className={`flexCenterGap brighten-animation ` + coloredButtonPaddingStying}
                            style={buttonStyles}
                        >
                            {t("textTruncate.showMore")}
                            <ExpandIcon />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

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
    const [, _setLoadingPage] = useRecoilState(loadingPage)

    return (
        <div className={podcastButtonsStyling}>
            {props.playButton}
            {address !== props.podcastOwner && (
            <DescriptionButton
                icon={<CurrencyDollarIcon className={episodeIconStyling} />} 
                text={""}
                color={color}
                onClick={props.setLoadTipModal} 
            />
            )}
            {address === props.podcastOwner && (
            <Link href={`/upload-episode?pid=${props.podcastId}`} onClick={() => _setLoadingPage(true)}>
                <DescriptionButton
                    icon={<PlusIcon className={episodeIconStyling} />} 
                    text={""}
                    color={color}
                />
            </Link>
            )}
            {address === props.podcastOwner && (
            <Link href={`/edit-podcast/${props.podcastId}`} onClick={() => _setLoadingPage(true)}>
                <DescriptionButton
                    icon={<PencilSquareIcon className={episodeIconStyling} />} 
                    text={""}
                    color={color}
                />
            </Link>
            )}
            <DescriptionButton
                icon={<ArrowTopRightOnSquareIcon className={episodeIconStyling} />} 
                text={""}
                color={color}
                onClick={props.setLoadShareModal}
            />
            <a target="_blank" rel="noreferrer" href={RSS_FEED_URL + podcastId}>
                <DescriptionButton
                    icon={<RssIcon className={episodeIconStyling} />}
                    text={""}
                    color={color}
                />
            </a>
        </div>
    )
}

