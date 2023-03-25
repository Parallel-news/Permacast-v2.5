import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TipButton from '../../../component/reusables/tip';
import { Ans, EXMDevState, FullEpisodeInfo, PodcastDev } from '../../../interfaces';
import { NextPage } from 'next';
import { hexToRGB, RGBobjectToString } from '../../../utils/ui';
import { podcastColor } from '../../../atoms';
import { useRecoilState } from 'recoil';
import { Creator404, creatorFlexCenteredStyling, creatorHeaderStyling, CreatorNames, FeaturedPodcasts, LatestEpisodes, ProfileImage, sortByDate, ViewANSButton } from '../../../component/creator';

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


export default Creator;