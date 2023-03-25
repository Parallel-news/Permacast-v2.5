import Image from 'next/image';
import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { FullEpisodeInfo, PodcastDev } from '../../interfaces';
import { dimColorString, hexToRGB, isTooLight } from '../../utils/ui';
import { currentThemeColorAtom } from '../../atoms';
import { useRecoilState } from 'recoil';
import FeaturedPodcast from '../home/featuredPodcast';
import Track from '../reusables/track';
import Link from 'next/link';


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
  squared?: boolean;
  linkToArPage?: boolean;
};

interface CreatorNamesProps {
  nickname: string;
  currentLabel: string;
};

interface ViewANSButtonProps {
  currentLabel: string;
};

interface FeaturedPodcastProps {
  podcasts: PodcastDev[];
};

interface LatestEpisodesProps {
  episodes: FullEpisodeInfo[];
}

// 2. Stylings
export const creatorHeaderStyling = `flex flex-col md:flex-row items-center justify-between`;
export const creatorFlexCenteredStyling = `flex items-center gap-x-7`;
export const creatorNicknameStyling = `select-text text-3xl font-medium tracking-wide text-white`;
export const creatorLabelStyling = `select-text text-lg font-medium text-[#828282]`;
export const creatorNicknameSmallStyling = `select-text font-medium tracking-wide text-white`;
export const creatorLabelSmallStyling = `select-text text-sm font-medium text-[#828282]`;
export const creatorTextHeaderTextStyling = `text-3xl font-bold text-white`;
export const podcastCarouselStyling = `w-full mt-8 carousel gap-x-12 py-3`;
export const flexCol = `flex flex-col`;

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
export const ProfileImage: FC<ProfileImageProps> = ({ currentLabel, avatar, address_color, size, squared, linkToArPage }) => {
  const borderColor = address_color && isTooLight(hexToRGB(address_color), 0.6) ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
  const hex = address_color && isTooLight(hexToRGB(address_color), 0.6) ? "#000000" : "#ffffff";
  const imageSize = size || 120;
  const squaredOuterBorderRadius = squared ? '12px' : '999px';
  const squaredInnerBorderRadius = squared ? '8px' : '999px';

  return (
    <Link
      href={linkToArPage ? resolveArDomainToArpage(currentLabel) : `/creator/${currentLabel}`}
      style={{ borderColor: borderColor, borderWidth: '4px', borderRadius: squaredOuterBorderRadius }}
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

export const CreatorNames: FC<CreatorNamesProps> = ({ nickname, currentLabel }) => (
  <div className={flexCol}>
    <div className={creatorNicknameStyling}>{nickname}</div>
    <div className={creatorLabelStyling}>@{currentLabel}</div>
  </div>
);

export const ViewANSButton: FC<ViewANSButtonProps> = ({ currentLabel }) => {
  const { t } = useTranslation();

  const [currentThemeColor, setCurrentThemeColor] = useRecoilState(currentThemeColorAtom);

  return (
    <a
      className="px-3 py-2 rounded-full text-sm ml-5 cursor-pointer"
      href={`https://${currentLabel}.ar.page`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: dimColorString(currentThemeColor, 0.1),
        color: currentThemeColor,
      }}
    >
      {t('creator.ans')}
    </a>
  );
};

export const FeaturedPodcasts: FC<FeaturedPodcastProps> = ({ podcasts }) => {

  const { t } = useTranslation();

  return (
    <div className="mt-8">
      <div className={creatorTextHeaderTextStyling + " mb-8"}>{t("creator.podcasts")}</div>
      <div>
        {podcasts.length > 0 ? (
          <div className={podcastCarouselStyling}>
            {podcasts.map((podcast: PodcastDev, index: number) =>
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
      <div className={creatorTextHeaderTextStyling}>{t("creator.latestepisodes")}</div>
      <div className="mt-6">
        {episodes.map((episode: FullEpisodeInfo, episodeNumber: number) => (
          <div className="mb-4" key={episodeNumber}>
            <Track {...{ episode, episodeNumber }} includeDescription includePlayButton />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Creator404: FC<{ address: string }> = ({ address }) => {
  const { t } = useTranslation();

  return <div>{address} PLACEHOLDER, will add loading here later as well</div>
};
