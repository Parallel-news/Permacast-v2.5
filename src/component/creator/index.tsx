import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { FullEpisodeInfo, Podcast } from '../../interfaces';
import { dimColorString, hexToRGB, isTooLight, stringToHexColor } from '../../utils/ui';
import { currentThemeColorAtom } from '../../atoms';
import { useRecoilState } from 'recoil';
import FeaturedPodcast from '../home/featuredPodcast';
import Track from '../reusables/track';
import Link from 'next/link';
import TipButton from '../reusables/tip';
import { flexCenter } from './featuredCreators';
import Verification from '../reusables/Verification';
import { TipModal } from '../tipModal';
import { shortenAddress, useArconnect } from 'react-arconnect';


/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */

// 1. Interfaces

interface ProfileImageProps {
  currentLabel: string;
  avatar: string;
  address_color: string;
  size?: number;
  borderWidth?: number;
  squared?: boolean;
  linkToArPage?: boolean;
};

interface CreatorNamesProps {
  nickname: string;
  currentLabel: string;
  ANSuserExists?: boolean;
};

interface ViewANSButtonProps {
  currentLabel: string;
  ANSuserExists?: boolean;
};

interface FeaturedPodcastProps {
  podcasts: Podcast[];
};

interface LatestEpisodesProps {
  episodes: FullEpisodeInfo[];
};

interface CreatorPageComponentProps {
  ANSuserExists?: boolean;
  currentLabel: string;
  avatar: string;
  address_color: string;
  nickname: string;
  user: string;
  podcasts: Podcast[];
  episodes: FullEpisodeInfo[];
};

interface LinkButtonInterface {
  text: string;
  url: string;
};

interface CreatorTipModalInterface {
  ANSorAddress: string;
  recipientAddress: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};


// 2. Stylings
export const creatorHeaderStyling = `flex flex-col md:flex-row items-center justify-between`;
export const creatorNicknameStyling = `select-text text-3xl font-medium tracking-wide text-white`;
export const creatorLabelStyling = `select-text text-lg font-medium text-[#828282]`;
export const creatorNicknameSmallStyling = `select-text font-medium tracking-wide text-white`;
export const creatorLabelSmallStyling = `select-text text-sm font-medium text-[#828282]`;
export const WhiteLargeFont = `text-3xl font-bold text-white `;
export const podcastCarouselStyling = `w-full mt-8 carousel gap-x-12 py-3`;
export const flexCol = `flex flex-col`;
export const flexItemsCenter = `flex items-center `;
export const CreatorPageStyling = "mt-12 h-full pb-40";
export const hoverableLinkButton = "px-3 py-2 rounded-full text-sm ml-5 cursor-pointer hover:brightness-[3] default-animation";

// 3. Custom Functions

export const resolveArDomainToArpage = (currentLabel: string) => `https://${currentLabel}.ar.page`;


export const sortByDate = (episodes: FullEpisodeInfo[], descending = false): FullEpisodeInfo[] => {
  return episodes.sort((a, b) => {
    if (descending) {
      return b.episode.uploadedAt - a.episode.uploadedAt;
    } else {
      return a.episode.uploadedAt - b.episode.uploadedAt;
    };
  });
};

// 4. Reusable Components
export const ProfileImage: FC<ProfileImageProps> = ({ currentLabel, avatar, address_color, size, borderWidth, squared, linkToArPage }) => {
  const borderColor = address_color && isTooLight(hexToRGB(address_color), 0.6) ? "rgb(169, 169, 169)" : "rgb(255, 255, 255)";
  const hex = address_color && isTooLight(hexToRGB(address_color), 0.6) ? "#A9A9A9" : "#ffffff";
  const imageSize = size || 120;
  const squaredOuterBorderRadius = squared ? '12px' : '999px';
  const squaredInnerBorderRadius = squared ? '8px' : '999px';

  return (
    <Link
      href={linkToArPage ? resolveArDomainToArpage(currentLabel) : `/creator/${currentLabel}`}
      style={{ borderColor: borderColor, borderWidth: borderWidth || '4px', borderRadius: squaredOuterBorderRadius }}
    >
      {avatar && <Image width={imageSize} height={imageSize} alt={avatar} src={avatar} className="object-fit aspect-square" />}
      {!avatar && (
        <div style={{
          width: imageSize,
          height: imageSize,
          borderRadius: squaredInnerBorderRadius,
          background: `linear-gradient(225deg, ${hex} 10%, ${address_color} 30%)`,
        }}></div>
      )}
    </Link>
  );
};

export const CreatorNamesSmall: FC<CreatorNamesProps> = ({ nickname, currentLabel }) => (
  <div className={flexCol}>
    <div className={creatorNicknameSmallStyling}>{nickname}</div>
    <div className={creatorLabelSmallStyling}>@{currentLabel}</div>
  </div>
);

export const CreatorNames: FC<CreatorNamesProps> = ({ nickname, currentLabel, ANSuserExists }) => (
  <div className={flexCenter}>
    <div className={flexCol}>
      <div className={creatorNicknameStyling}>{shortenAddress(nickname)}</div>
      {currentLabel && (<div className={creatorLabelStyling}>@{currentLabel}</div>)}
    </div>
    <div className="ml-6">
      <Verification {...{ANSuserExists}} includeText />
    </div>
  </div>
);

export const LinkButton: FC<LinkButtonInterface> = ({ url, text }) => {
  const [currentThemeColor, setCurrentThemeColor] = useRecoilState(currentThemeColorAtom);

  return (
    <a
      className={hoverableLinkButton}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: dimColorString(currentThemeColor, 0.1),
        color: currentThemeColor,
      }}
    >
      {text}
    </a>
  );
};

export const ViewANSButton: FC<ViewANSButtonProps> = ({ currentLabel, ANSuserExists }) => {
  const { t } = useTranslation();

  if (!ANSuserExists) return (<></>)

  return <LinkButton url={`https://${currentLabel}.ar.page`} text={t('creator.ans')} />
};

export const FeaturedPodcasts: FC<FeaturedPodcastProps> = ({ podcasts }) => {

  const { t } = useTranslation();

  return (
    <div className="mt-8">
      <div className={WhiteLargeFont + " mb-8"}>{t("creator.podcasts")}</div>
      <div>
        {podcasts.length !== 0 ? (
          <div className={podcastCarouselStyling}>
            {podcasts.map((podcast: Podcast, index: number) =>
              <FeaturedPodcast {...podcast} key={index} />
            )}
          </div>
        ) : <>{t("creator.nopodcasts")}</>}
      </div>
    </div>
  );
};

export const LatestEpisodes: FC<LatestEpisodesProps> = ({ episodes }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-12">
      <div className={WhiteLargeFont}>{t("creator.latestepisodes")}</div>
      <div className="mt-6">
        {episodes.map((episode: FullEpisodeInfo, index: number) => (
          <div className="mb-4" key={index}>
            <Track {...{ episode }} includeDescription includePlayButton />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CreatorTipModal: FC<CreatorTipModalInterface> = ({ ANSorAddress, recipientAddress, isOpen, setIsOpen }) => {
  if (isOpen) {
    return (
      <>
        <TipModal
          to={ANSorAddress}
          toAddress={recipientAddress} 
          isVisible={isOpen}
          setVisible={setIsOpen}
        />
      </>
    );
  } else {
    return <></>
  };
};

export const CreatorPageComponent: FC<{ creator: CreatorPageComponentProps }> = ({ creator }) => {

  const { ANSuserExists, currentLabel, avatar, address_color, nickname, user, podcasts, episodes } = creator;

  const { address } = useArconnect();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const tipModalArgs = { ANSorAddress: ANSuserExists ? currentLabel : user, recipientAddress: user, isOpen, setIsOpen };

  return (
    <div className={CreatorPageStyling}>
      <CreatorTipModal {...tipModalArgs} />
      <div className={creatorHeaderStyling}>
        <div className={flexItemsCenter + "gap-x-7"}>
          <ProfileImage {...{ currentLabel, avatar, address_color }} linkToArPage={ANSuserExists} />
          <CreatorNames {...{ nickname, currentLabel, ANSuserExists }} />
        </div>
        <div className={flexItemsCenter + " mr-3"}>
          <ViewANSButton {...{ currentLabel, ANSuserExists }} />
          {address !== user && <TipButton openModalCallback={() => setIsOpen(prev => !prev)} />}
        </div>
      </div>
      <FeaturedPodcasts {...{ podcasts }} />
      <LatestEpisodes {...{ episodes }} />
    </div>
  );
};

export const Creator404: FC<{ address: string }> = ({ address }) => {

  const [user, currentLabel, nickname] = Array(3).fill(shortenAddress(address, 10));
  const address_color = stringToHexColor(address || 'rgb');

  const creator: CreatorPageComponentProps = {ANSuserExists: false, user, currentLabel, address_color, podcasts: [], episodes: [], avatar: '', nickname};

  return <CreatorPageComponent {...{ creator }} />;
};
