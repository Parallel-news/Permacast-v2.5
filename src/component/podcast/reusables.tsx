import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import React, { FC, useEffect, useState } from "react";
import { useArconnect } from "react-arconnect";
import { useRecoilState } from "recoil";

import { allANSUsersAtom, loadingPage } from "@/atoms/index";
import { RSS_FEED_URL } from "@/constants/index";

import { ANSMapped, Podcast } from "@/interfaces/index";
import { ButtonStyle } from "../reusables/track";

import { getCategoryInCurrentLanguage, useLanguageHook } from "@/utils/languages";
import { queryMarkdownByTX } from "@/utils/markdown";
import {
  RGBAstringToObject,
  RGBobjectToString,
  RGBstringToObject,
  fetchDominantColor,
  getButtonRGBs,
  getCoverColorScheme
} from "@/utils/ui";
import { getFormattedTimeStamp } from "@/utils/reusables";


// import MarkdownRenderer from "../markdownRenderer";
// import ModalShell from "../modalShell";
// import { NftButton } from "@/features/nft-mint";
import { Icon } from "../icon";
const NftButton = React.lazy(() => import("@/features/nft-mint").then(module => ({ default: module.NftButton })));
const ModalShell = React.lazy(() => import("../modalShell"));
const MarkdownRenderer = React.lazy(() => import("../markdownRenderer"));
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
const podcastInfoTitleStyling = `font-semibold select-text items-start justify-start text-white flexCenterGap break-all `;
const podcastTitlePreviewStyling = podcastInfoTitleStyling + ` text-4xl line-clamp-3 `;
const podcastTitleModalStyling = podcastInfoTitleStyling + ` text-xl mt-2 `;
const podcastButtonsStyling = "flex flex-row items-center space-x-6 justify-start";
const podcastInfoTitleDivStyling = "flex flex-col ml-0 m-0 pr-8";
const episodeIconSizeStyling = "h-7 w-7 ";
const episodeIconStyling = episodeIconSizeStyling + "ml-[4px] mt-[4px]";
const episodeBottomMargin = "h-7 w-7 mb-[2px]"
const episodeIconNoMargin = "h-7 w-7";
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
  const [allANSUsers,] = useRecoilState(allANSUsersAtom);

  const [coverModalOpen, setCoverModalOpen] = useState<boolean>(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState<boolean>(false);

  const [markdownText, setMarkdownText] = useState<string>('');
  const [coverColor, setCoverColor] = useState<string>('');
  const [uploader, setUploader] = useState<string>('');
  const [buttonStyles, setButtonStyles] = useState<ButtonStyle>({ backgroundColor: '', color: '' });
  const category = getCategoryInCurrentLanguage(categoriesArray, podcast.categories[0]);
  let adjCategory = undefined
  if (category) {
    adjCategory = category[1]
  }
  const language = languagesArray.find(item => item[0] === podcast.language)[1]
  const formattedDate = getFormattedTimeStamp(podcast.createdAt);

  const ExpandIcon = () => <Icon className="w-4 h-4 " icon="ARROWSOUT" strokeWidth="0.5" fill="currentColor" />;

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
    <>
      <ModalShell
        width="max-w-md"
        isOpen={coverModalOpen}
        setIsOpen={setCoverModalOpen}
      >
        <Image
          src={imgSrc}
          alt="Podcast Cover"
          height={700}
          width={700}
          loading="eager"
          priority
          className="object-cover width-[700px] height-[700px]"
        />
      </ModalShell>
      <ModalShell
        width="max-w-md"
        isOpen={descriptionModalOpen}
        setIsOpen={setDescriptionModalOpen}
      >
        <>
          <p className={podcastTitleModalStyling}>{title}</p>
          <div className="h-[1px] my-4 bg-white w-full rounded-full"></div>
          <MarkdownRenderer markdownText={markdownText} color={'text-white '} />
          <div className="h-[1px] my-4 bg-white w-full rounded-full"></div>
          <div className="flexColCenter">
            <div className="flexCenter gap-x-0.5">
              <Icon className="w-4 h-4 mt-0.5" icon="ATSYMBOL" strokeWidth="0" fill="currentColor" />
              {podcast?.email || "N/A"}
            </div>
            <div>{podcast?.episodes?.length} {t("episodes")}</div>
            {adjCategory && (
              <div className="flexCenter gap-x-0.5">
                <Icon className="w-4 h-4 " icon="HASHTAG" strokeWidth="0" fill="currentColor" />
                {adjCategory}
              </div>
            )}
            <div className="flexCenter gap-x-0.5">
              <Icon className="w-4 h-4 " icon="LANGUAGE" strokeWidth="0" fill="currentColor" />
              {language}
            </div>
          </div>
        </>
      </ModalShell>
      <div className={podcastInfoStyling}>
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
    </>
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
      <MarkdownRenderer markdownText={markdownText} color={props.color === "rgb(0, 0, 0)" ? 'text-black' : 'text-white'} align="text-left" />
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
          icon={<Icon className={episodeIconStyling} icon="DOLLAR" strokeWidth="0.5" fill="currentColor" />}
          text={""}
          color={color}
          onClick={props.setLoadTipModal}
        />
      )}
      {address === props.podcastOwner && <NftButton pid={props.podcastId} />}
      {address === props.podcastOwner && (
        <Link href={`/upload-episode?pid=${props.podcastId}`} onClick={() => _setLoadingPage(true)}>
          <DescriptionButton
            icon={<Icon className={episodeIconSizeStyling} icon="PLUS" strokeWidth="2" viewBox="0 0 24 24" fill="currentColor" />}
            text={""}
            color={color}
          />
        </Link>
      )}
      {address === props.podcastOwner && (
        <Link href={`/edit-podcast/${props.podcastId}`} onClick={() => _setLoadingPage(true)}>
          <DescriptionButton
            icon={<Icon className={episodeIconStyling} icon="PENCIL" strokeWidth="0" fill="currentColor" />}
            text={""}
            color={color}
          />
        </Link>
      )}
      <DescriptionButton
        icon={<Icon className={episodeIconStyling} icon="ARROWTOPSQUARE" strokeWidth="0" fill="currentColor" />}
        text={""}
        color={color}
        onClick={props.setLoadShareModal}
      />
      <a target="_blank" rel="noreferrer" href={RSS_FEED_URL + podcastId}>
        <DescriptionButton
          icon={<Icon className={episodeBottomMargin} icon="RSS" strokeWidth="0" fill="currentColor" />}
          text={""}
          color={color}
        />
      </a>
    </div>
  )
}
/*
            <Dialog open={coverModalOpen} onClose={() => setCoverModalOpen(false)} className={`bg-transparent text-white cursor-auto rounded-none `}>
                <Image
                    src={imgSrc}
                    alt="Podcast Cover"
                    height={700}
                    width={700}
                    loading="eager"
                    priority
                    className="object-cover width-[700px] height-[700px]"
                />
            </Dialog>



            <Dialog 
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
                        <Icon className="w-4 h-4 mt-0.5" icon="ATSYMBOL" strokeWidth="0" fill="currentColor"/>
                        {podcast?.email || "N/A"}
                    </div>
                    <div>{podcast?.episodes?.length} {t("episodes")}</div>
                    {adjCategory && (
                    <div className="flexCenter gap-x-0.5">
                        <Icon className="w-4 h-4 " icon="HASHTAG" strokeWidth="0" fill="currentColor"/>
                        {adjCategory}
                    </div>
                    )}
                    <div className="flexCenter gap-x-0.5">
                        <Icon className="w-4 h-4 " icon="LANGUAGE" strokeWidth="0" fill="currentColor"/>
                        {language}
                    </div>
                </div>
            </Dialog>

*/
