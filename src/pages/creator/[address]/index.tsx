import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Ans, Episode, EXMDevState, FullEpisodeInfo, Podcast } from '../../../interfaces';
import { NextPage } from 'next';
import { hexToRGB, RGBobjectToString } from '../../../utils/ui';
import { podcastColorAtom } from '../../../atoms';
import { useRecoilState } from 'recoil';
import { Creator404, CreatorPageComponent, sortByDate } from '../../../component/creator';
import { DUMMY_ANS, EXM_ANS_CONTRACT_ADDRESS, EXM_READ_LINK } from '../../../constants';

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
  let userInfo: Ans = DUMMY_ANS;
  userInfo.address_color = "#000000";
  userInfo.user = address;
  const isAddress = address.length === 43;

  try {
    const info = (await axios.get(`https://ans-resolver.herokuapp.com/resolve-as-arpage/${address}`)).data;
    if (info?.user) {
      userInfo = info;
      userInfo.ANSuserExists = true;
    } else {
      const EXM = (await axios.get(EXM_READ_LINK + EXM_ANS_CONTRACT_ADDRESS)).data;
      const { balances } = EXM;
      const allDomains = balances.map((balance) => balance.ownedDomains).flat();
      const foundBalance = balances.find((balance) => balance.address === address);
      const foundDomain = allDomains.find((domain) => domain.domain === address);

      if (foundBalance || foundDomain) {
        const source = foundBalance || foundDomain;
        const { domain, color } = source;
        userInfo.ANSuserExists = true;
        userInfo.user = address;
        userInfo.nickname = domain;
        userInfo.address_color = color;
        userInfo.currentLabel = domain;
      } else {
        userInfo.userIsAddress = isAddress ? true: false;
        userInfo.ANSuserExists = false;
      };
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
  if (!userInfo?.ANSuserExists) return <Creator404 address={userInfo?.user || ''} />;

  const { user, address_color } = userInfo;

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<FullEpisodeInfo[]>([]);

  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);

  useEffect(() => {
    const color = RGBobjectToString(hexToRGB(address_color || "#000000"));
    setPodcastColor(color);

    const fetchUserData = async () => {
      const state: EXMDevState = (await axios.get('/api/exm/read')).data;
      if (state?.podcasts) {
        const { podcasts } = state;
        const usersPodcasts = podcasts.filter((podcast: Podcast) => podcast.owner === user).map((podcast) => podcast);
        setPodcasts(usersPodcasts);
        const userEpisodes = usersPodcasts.map((podcast: Podcast) => 
          podcast.episodes.map((episode: Episode) => ({episode, podcast}))
        ).flat(1);
        setEpisodes(sortByDate(userEpisodes));
      };
    };
    fetchUserData();
  }, [userInfo]);

  const creator = {
    ...userInfo,
    podcasts,
    episodes,
  };

  return <CreatorPageComponent {...{ creator }} />;
};


export default Creator;