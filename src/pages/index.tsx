import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { Suspense, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';

import { loadingPage } from '@/atoms/index';

import { FullEpisodeInfo } from '@/interfaces/index';
import { getContractVariables, getPASOMContract } from '@/utils/contract';
import { getPodcastData } from '@/features/prefetching';
import { sortHomepageInfo } from '@/utils/filters';
import { HOMAPAGE_STATS_KEY } from '@/constants/query-keys';
import { EXM_READ_LINK } from '../constants';

const FeaturedPodcastCarousel = React.lazy(() => import('@/component/reusables/FeaturedPodcastCarousel'));
// const GetFeatured = React.lazy(() => import('../component/home/getFeatured'))
const Track = React.lazy(() => import('@/component/reusables/track'))
//const Loading = React.lazy(() => import('../component/reusables/loading'))
const FeaturedCreators = React.lazy(() => import('@/component/creator/featuredCreators'))
const FeaturedPodcast = React.lazy(() => import('@/component/home/featuredPodcast'))
const FeaturedChannelModal = React.lazy(() => import('@/component/home/featuredChannelModal'))
const Greeting = React.lazy(() => import("@/component/featured").then(module => ({ default: module.Greeting })));;
const Loading = React.lazy(() => import('@/component/reusables/loading'));

interface HomeProps {
  isProduction: boolean,
  contractAddress?: string,
  featuredContractAddress?: string,
  PASoMContractAddress?: string,
};

const Home: NextPage<HomeProps> = ({ isProduction, contractAddress, featuredContractAddress, PASoMContractAddress }) => {

  const { t } = useTranslation();
  const [, _setLoadingPage] = useRecoilState(loadingPage);

  useEffect(() => {
    _setLoadingPage(false)
  }, []);

  const { isFetched: podcastsFetched, data: EXMstate } = getPodcastData();

  const stateQuery = useQuery({
    queryKey: [HOMAPAGE_STATS_KEY],
    queryFn: () => sortHomepageInfo(EXMstate.podcasts),
    enabled: podcastsFetched
  });

  const { data: homeData, isLoading: isHomepageLoading, isSuccess } = stateQuery;

  {/* {isVisible && <FeaturedChannelModal {...{ isVisible, setIsVisible }} />} */}

  const HomeLoader = () => {
    return (
      <div className="w-full pb-10 mb-10">
        <Greeting />

        {isProduction !== true &&
          <div className="select-text">
            <p className='text-yellow-500 font-bold'>Heads up: isProduction !== "true"</p>
            <div className="text-teal-300 flex gap-x-1">EXM Main Address: <p className="underline font-medium">{contractAddress}</p></div>
            <div className="text-indigo-300 flex gap-x-1">EXM Feature Channel Address: <p className="underline font-medium">{featuredContractAddress}</p></div>
            <div>(PRODUCTION) PASoM Contract Address: {PASoMContractAddress}</div>
          </div>
        }

        <Loading />
        <div className="my-9 flexCol xl:flex-row md:justify-between space-y-10 xl:space-y-0">
          <Loading className="w-[100%] xl:w-[71%]" />
          <Loading className="w-full xl:w-[27%]" />
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<HomeLoader />}>
      <div className="w-full pb-10 mb-10">
        <Greeting />
        {(isProduction !== true && contractAddress && PASoMContractAddress) &&
          <div className="select-text">
            <div className='text-yellow-500 font-bold'>Heads up: isProduction !== "true"</div>
            <div className="text-teal-300 flex gap-x-1">EXM Main Address: <a href={EXM_READ_LINK + (contractAddress)} target="_blank" ref="noreferrer noopener" className="underline font-medium">{contractAddress}</a></div>
            <div className="text-pink-300 flex gap-x-1">(PRODUCTION) PASoM Contract Address: <a href={EXM_READ_LINK + PASoMContractAddress} target="_blank" ref="noreferrer noopener">{PASoMContractAddress}</a></div>
          </div>
        }
        {isHomepageLoading ? <Loading /> : (isSuccess && <FeaturedPodcastCarousel podcasts={homeData.sortedPodcasts} />)}
        <div className="my-9 flexCol xl:flex-row md:justify-between space-y-10 xl:space-y-0">
          <div className="w-[100%] xl:w-[71%]">
            {isHomepageLoading ? (
              <Loading />
            ) : (
              <>
                <h2 className="text-zinc-400 text-lg mb-3">{t("home.recentlyadded")}</h2>
                <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
                  {homeData.sortedEpisodes.map((episode: FullEpisodeInfo, index: number) => (
                    <Track {...{ episode }} openFullscreen includeDescription includePlayButton includeContentType key={index} />
                  ))}
                </div>
              </>
            )}
          </div>
          {isHomepageLoading ? (
            <Loading className="w-full xl:w-[27%]" />
          ) : (
            <div className="w-full xl:w-[27%]">
              <FeaturedCreators addresses={homeData.featuredCreators} />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export async function getStaticProps({ locale }) {
  const { isProduction, contractAddress } = getContractVariables();
  let featuredContractAddress = "we'll integrate it later";
  let PASoMContractAddress = '';

  if (!isProduction) {
    // ({ contractAddress: featuredContractAddress } = getFeaturedChannelsContract());
    ({ contractAddress: PASoMContractAddress } = getPASOMContract());
  };

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      // contractAddress: !isProduction ? contractAddress : '',
      // featuredContractAddress,
      // PASoMContractAddress: PASoMContractAddress,
    },
  };
};

export default Home
