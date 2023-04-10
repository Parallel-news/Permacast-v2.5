import axios from 'axios';
import Head from 'next/head';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Ans, Episode, FullEpisodeInfo, Podcast } from '../../../interfaces';
import { hexToRGB, RGBobjectToString } from '../../../utils/ui';
import { allPodcasts, podcastColorAtom } from '../../../atoms';
import { Creator404, CreatorPageComponent, sortByDate } from '../../../component/creator';
import { ANS_TEMPLATE } from '../../../constants/ui';
import { ARWEAVE_READ_LINK } from '../../../constants';
import { shortenAddress } from 'react-arconnect';
import { PASoMProfile } from '../../../interfaces/pasom';

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
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      userInfo,
    },
  };
};

const Creator: NextPage<{ userInfo: Ans }> = ({ userInfo }) => {
  if (!userInfo?.ANSuserExists && !userInfo?.userIsAddress) return <Creator404 address={userInfo?.user || ''} />

  const { user, nickname, currentLabel, address_color, bio, avatar } = userInfo;

  const [PASoMProfile, setPASoMProfile] = useState<PASoMProfile | undefined>();

  const creatorName = nickname || currentLabel || shortenAddress(user);

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<FullEpisodeInfo[]>([]);

  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);

  useEffect(() => {
    const color = RGBobjectToString(hexToRGB(address_color || "#000000"));
    setPodcastColor(color);
  }, [userInfo]);

  useEffect(() => {
    const fetchPASoM = async () => {
      const state = (await axios.get('/api/exm/PASoM/read')).data;
      const profiles: PASoMProfile[] = state.profiles;
      const profile = profiles.find((profile: PASoMProfile) => (profile.address === user));
      setPASoMProfile(profile);
    };
    fetchPASoM();
  }, []);

  useEffect(() => {
    if (!allPodcasts_) return;
    const fetchUserData = async () => {
      const podcasts: Podcast[] = allPodcasts_.filter((podcast: Podcast) => podcast.owner === user);
      const userEpisodes = podcasts.map((podcast: Podcast) => 
        podcast.episodes.map((episode: Episode) => ({episode, podcast}))
      ).flat(1).splice(-3, 3);
      setPodcasts(podcasts);
      const sortedEpisodes = sortByDate(userEpisodes)
      setEpisodes(sortedEpisodes.slice().reverse());
    };
    fetchUserData();
  }, [allPodcasts_]);

  const creator = {
    ...userInfo,
    PASoMProfile,
    podcasts,
    episodes,
  };

  return (
    <>
      <Head>
        <title>{`${creatorName} | Creator`}</title> 
        <meta name="description" content={`${bio}`} />
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:image" content={(avatar !== "") ? ARWEAVE_READ_LINK + avatar : "https://permacast.app/favicon.png"} />
        <meta name="twitter:title" content={`${creatorName} | Permacast Creator`} />
        <meta name="twitter:url" content={`https://permacast.app/`} />
        <meta name="twitter:description" content={`${bio}`} />
        
        <meta property="og:card" content="summary" />
        <meta property="og:image" content={(avatar !== "") ? ARWEAVE_READ_LINK + avatar : "https://permacast.app/favicon.png"} />
        <meta property="og:title" content={`${creatorName} | Permacast Creator`} />
        <meta property="og:url" content={`https://permacast.app/`} />
        <meta property="og:description" content={`${bio}`} /> 
      </Head>
      <CreatorPageComponent {...{ creator }}/>
    </>
  )
};


export default Creator;