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
import { FeaturedPodcasts, LatestEpisodes, Naming, ProfileImage, sortByDate, ViewANSButton } from '../../../component/components';



const creatorHeaderStyling = `flex flex-col md:flex-row items-center justify-between`;
const creatorFlexCenteredStyling = `flex items-center gap-x-7`;

export default function Creator ({ userInfo, address }) {
  // if (!userInfo) return <Creator404 {...{ address }} />
  const { t } = useTranslation();

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
          <ProfileImage {...{ currentLabel, avatar, address_color }} />
          <Naming {...{ nickname, currentLabel }} />
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


export async function getServerSideProps({ query, locale }) {
  const { address } = query;
  let userInfo: Ans | null;
  console.log({...(await serverSideTranslations(locale, ['common'])),})
  if (address) {
    try {
      const data = await axios.get(`https://ans-resolver.herokuapp.com/resolve-as-arpage/${address}`);
      userInfo = data.data;  
    } catch {
      userInfo = null;
    };
  };

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      address,
      userInfo,
    },
  };
};
