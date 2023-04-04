import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Ans, Episode, EXMDevState, FullEpisodeInfo, Podcast } from '../../../interfaces';
import { NextPage } from 'next';
import { hexToRGB, RGBobjectToString } from '../../../utils/ui';
import { allPodcasts, podcastColorAtom } from '../../../atoms';
import { useRecoilState } from 'recoil';
import { Creator404, CreatorPageComponent, sortByDate } from '../../../component/creator';
import { ANS_TEMPLATE } from '../../../constants/ui';
import { removeDuplicates } from '../../../utils/filters';

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
  let userInfo: Ans = ANS_TEMPLATE;
  userInfo.address_color = "#000000";
  userInfo.user = address;
  const isAddress = address.length === 43;

  try {
    const info = (await axios.get(`https://ans-resolver.herokuapp.com/resolve-as-arpage/${address}`)).data;
    if (info?.user) {
      userInfo = info;
      userInfo.ANSuserExists = true;
    } else {
      userInfo.nickname = address;
      userInfo.currentLabel = address;
      userInfo.userIsAddress = isAddress ? true: false;
      userInfo.ANSuserExists = false;
    };
  } catch (error) {
    console.log(error);
  };

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      userInfo
    },
  };
};

const Creator: NextPage<{ userInfo: Ans }> = ({ userInfo }) => {
  if (!userInfo?.ANSuserExists && !userInfo?.userIsAddress) return <Creator404 address={userInfo?.user || ''} />;

  const { user, address_color } = userInfo;

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<FullEpisodeInfo[]>([]);

  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);

  useEffect(() => {
    const color = RGBobjectToString(hexToRGB(address_color || "#000000"));
    setPodcastColor(color);
  }, [userInfo]);

  useEffect(() => {
    if (!allPodcasts_) return;
    const fetchUserData = async () => {
      const fullEpisodes: FullEpisodeInfo[] = allPodcasts_
        .map((podcast: Podcast) => podcast.episodes
          .map((episode: Episode, index: number) => 
            ({podcast, episode: {...episode, order: index}})))
              .flat();
      const usersPodcasts = removeDuplicates(fullEpisodes)
        .filter((podcast: FullEpisodeInfo) => podcast.podcast.owner === user)
          .map((podcast) => podcast.podcast)
            .splice(0, 20);
      setPodcasts(usersPodcasts);
      const userEpisodes = usersPodcasts.map((podcast: Podcast) => 
        podcast.episodes.map((episode: Episode) => ({episode, podcast}))
      ).flat(1).splice(0, 3);
      setEpisodes(sortByDate(userEpisodes));
    };
    fetchUserData();
  }, [allPodcasts_])

  const creator = {
    ...userInfo,
    podcasts,
    episodes,
  };

  return <CreatorPageComponent {...{ creator }} />;
};


export default Creator;