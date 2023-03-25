import axios from 'axios';
import React, { useState, useEffect, Suspense, FC } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TipButton from '../../../component/reusables/tip';
import { Ans, Episode, EXMDevState, FullEpisodeInfo, PodcastDev } from '../../../interfaces';
import { NextPage } from 'next';
import Image from 'next/image';
import { dimColorString, hexToRGB, isTooLight, RGBobjectToString, RGBtoHex } from '../../../utils/ui';
import { currentThemeColor, podcastColor } from '../../../atoms';
import { useRecoilState } from 'recoil';
import FeaturedPodcast from '../../../component/home/featuredPodcast';
import Track from '../../../component/reusables/track';
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
const creatorHeaderStyling = `flex flex-col md:flex-row items-center justify-between`;
const creatorFlexCenteredStyling = `flex items-center gap-x-7`;
const creatorNicknameStyling = `select-text text-3xl font-medium tracking-wide text-white`;
const creatorLabelStyling = `select-text text-lg font-medium text-[#828282]`;
const creatorNicknameSmallStyling = `select-text font-medium tracking-wide text-white`;
const creatorLabelSmallStyling = `select-text text-sm font-medium text-[#828282]`;

const creatorTextHeaderTextStyling = `text-3xl font-bold text-white`;
const podcastCarouselStyling = `w-full mt-8 carousel gap-x-12 py-3`;
const flexCol = `flex flex-col`;

// 3. Custom Functions

export const resolveArDomainToArpage = (currentLabel: string) => `https://${currentLabel}.ar.page`;


export const sortByDate = (episodes: FullEpisodeInfo[], descending = false): FullEpisodeInfo[] => {
  return episodes.sort((a, b) => {
    if (descending) {
      return b.episode.uploadedAt - a.episode.uploadedAt;
    } else {
      return a.episode.uploadedAt - b.episode.uploadedAt;
    }
  });
};

// 4. Reusable Components
export const ProfileImage: FC<ProfileImageProps> = ({ currentLabel, avatar, address_color, size, linkToArPage }) => {
  const borderColor = address_color && isTooLight(hexToRGB(address_color), 0.6) ? "rgb(0, 0, 0)": "rgb(255, 255, 255)";
  const hex = address_color && isTooLight(hexToRGB(address_color), 0.6) ? "#000000": "#ffffff";
  const imageSize = size || 120;

  return (
    <Link
      href={linkToArPage ? resolveArDomainToArpage(currentLabel): `/creator/${currentLabel}`}
      style={{borderColor: borderColor, borderWidth: '4px', borderRadius: '999px'}}
    >
      {avatar && <Image width={imageSize} height={imageSize} alt={avatar} src={avatar} className="object-fit aspect-square" />}
      {!avatar && (
        <div style={{
          width: imageSize,
          height: imageSize,
          borderRadius: '999px',
          background: `linear-gradient(225deg, ${hex} 10%, ${address_color} 30%)`,
        }}></div>
      )}
    </Link>
  );
};

export const CreatorNamesSmall: FC<CreatorNamesProps> = ({ nickname, currentLabel }) => (
  <div className={flexCol}>
    <div className={creatorNicknameSmallStyling }>{nickname}</div>
    <div className={creatorLabelSmallStyling }>@{currentLabel}</div>
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

  const [currentThemeColor_, setCurrentThemeColor_] = useRecoilState(currentThemeColor);

  return (
    <a
      className="px-3 py-2 rounded-full text-sm ml-5 cursor-pointer"
      href={`https://${currentLabel}.ar.page`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: dimColorString(currentThemeColor_, 0.1),
        color: currentThemeColor_,
      }}
    >
      {t('creator.ans')}
    </a>
  );
};

const FeaturedPodcasts: FC<FeaturedPodcastProps> = ({ podcasts }) => {

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
        ): <>{t("creator.nopodcasts")}</>}
      </div>
    </div>
  );
};

const LatestEpisodes: FC<LatestEpisodesProps> = ({ episodes }) => {
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

const Creator404: FC<{ address: string }> = ({ address }) => {
  const { t } = useTranslation();

  return <div>{address} PLACEHOLDER, will add loading here later as well</div>
};

const Creator: NextPage<{ userInfo: Ans | null, address: string }> = ({ userInfo, address }) => {
  if (!userInfo) return <Creator404 {...{ address }} />

  const { user, avatar, currentLabel, address_color, nickname } = userInfo;

  const [podcasts, setPodcasts] = useState<PodcastDev[]>([]);
  const [episodes, setEpisodes] = useState<FullEpisodeInfo[]>([]);

  const [podcastColor_, setPodcastColor_] = useRecoilState(podcastColor)

  useEffect(() => {
    const fetchUserData = async () => {
      const podcasts = await axios.get('/api/exm/read');
      const data: EXMDevState = podcasts.data;
      if (data?.podcasts) {
        const usersPodcasts = data.podcasts.filter((podcast) => podcast.owner === address).map((podcast) => podcast);
        setPodcasts(usersPodcasts);
        const userEpisodes = usersPodcasts.map((podcast: PodcastDev) => podcast.episodes.map((episode) => ({episode, podcast}))).flat(1);
        setEpisodes(sortByDate(userEpisodes));
      };
    };
    fetchUserData();
  }, [address]);

  useEffect(() => {
    const color = RGBobjectToString(hexToRGB(address_color));
    setPodcastColor_(color);
  }, [address_color]);

  return (
    <div className="mt-12 h-full pb-40">
      <div className={creatorHeaderStyling}>
        <div className={creatorFlexCenteredStyling}>
          <ProfileImage {...{ currentLabel, avatar, address_color }} linkToArPage />
          <CreatorNames {...{ nickname, currentLabel }} />
        </div>
        <div className={creatorFlexCenteredStyling + " mr-6"}>
          <ViewANSButton {...{ currentLabel }} />
          <TipButton address={user} />
        </div>
      </div>
      <FeaturedPodcasts {...{ podcasts }} />
      <LatestEpisodes {...{ episodes }} />
    </div>
  );
};

// pages/blog/[slug].js
export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      '/creator/[address].tsx',
      // Object variant:
      // { params: { address } },
    ],
    fallback: true,
  };
};

export async function getStaticProps(context) {
  const { locale, params } = context;
  const { address } = params;
  let userInfo: Ans | null;

  if (address) {
    const data = await axios.get(`https://ans-resolver.herokuapp.com/resolve-as-arpage/${address}`);
    userInfo = data.data;
  };

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      address,
      userInfo,
    },
  };
};

export default Creator;