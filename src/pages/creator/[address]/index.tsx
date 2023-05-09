import axios from 'axios';
import Head from 'next/head';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState, useEffect, Suspense } from 'react';
import { useRecoilState } from 'recoil';
import { Ans, Episode, FullEpisodeInfo, Podcast } from '../../../interfaces';
import { hexToRGB, RGBobjectToString } from '../../../utils/ui';
import { allPodcasts, loadingPage, podcastColorAtom } from '../../../atoms';
import { Creator404, sortByDate } from '../../../component/creator';
import { ANS_TEMPLATE } from '../../../constants/ui';
import { ARWEAVE_READ_LINK } from '../../../constants';
import { shortenAddress } from 'react-arconnect';
import { PASoMProfile } from '../../../interfaces/pasom';
import Loading from '../../../component/creator/loading';
const CreatorPageComponentLazy = React.lazy(() => import('../../../component/creator').then(module => ({ default: module.CreatorPageComponent })));


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
  userInfo.user = address.length > 0 ? address : ''; 
  const isAddress = address.length === 43;

  try {
    const lookupAddress = !isAddress && address.includes('.ar') ? address.split('.')[0] : address
    const info = (await axios.get(`https://ans-resolver.herokuapp.com/resolve-as-arpage/${lookupAddress}`)).data;
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

  const { user, nickname, currentLabel, address_color, bio, avatar  } = userInfo;
  const [PASoMProfile, setPASoMProfile] = useState<PASoMProfile | undefined>();
  const creatorName = nickname || currentLabel || shortenAddress(user);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<FullEpisodeInfo[]>([]);
  const [_, setPodcastColor] = useRecoilState(podcastColorAtom);
  const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);
  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage)

  useEffect(() => {
    if (!userInfo) return;
    const color = RGBobjectToString(hexToRGB(address_color || "#000000"));
    setPodcastColor(color);
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) return;
    const fetchPASoM = async () => {
      const state = (await axios.get('/api/exm/PASoM/read')).data;
      const profiles: PASoMProfile[] = state.profiles;
      const profile = profiles.find((profile: PASoMProfile) => (profile.address === user));
      setPASoMProfile(profile);
    };
    fetchPASoM();
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) return;
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
  }, [allPodcasts_, userInfo]);

  useEffect(() => {
    const timer = setTimeout(() =>{_setLoadingPage(false);}, 1000);
    return () => clearTimeout(timer);
  }, [_loadingPage])

  const creator = {
    ...userInfo,
    PASoMProfile,
    podcasts,
    episodes,
  };

  if (!userInfo?.ANSuserExists && !userInfo?.userIsAddress) {
    return (
      <>
        <Head>
          <title>{`Creator Not Found`}</title> 
          <meta name="description" content={`Creator Not Found`} />
          <meta name="twitter:card" content="summary"></meta>
          <meta name="twitter:image" content={(avatar !== "") ? ARWEAVE_READ_LINK + avatar : "https://permacast.app/favicon.png"} />
          <meta name="twitter:title" content={`Permacast Creator`} />
          <meta name="twitter:url" content={`https://permacast.app/`} />
          <meta name="twitter:description" content={`None`} />
          
          <meta property="og:card" content="summary" />
          <meta property="og:image" content={(avatar !== "") ? ARWEAVE_READ_LINK + avatar : "https://permacast.app/favicon.png"} />
          <meta property="og:title" content={`Permacast Creator`} />
          <meta property="og:url" content={`https://permacast.app/`} />
          <meta property="og:description" content={`Creator Not Found`} /> 
        </Head>
        <Creator404 address={userInfo?.user} />
      </>
      
    )
  } else {
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
          <Suspense fallback={<Loading />}>
            <CreatorPageComponentLazy {...{ creator }}/>
          </Suspense>
      </>
    )
  }

};


export default Creator;