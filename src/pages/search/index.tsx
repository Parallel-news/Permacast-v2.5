import axios from 'axios';
import { useRecoilState } from 'recoil';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { getContractVariables } from '../../utils/contract';
import { EXM_READ_LINK } from '../../constants';
import { titles, allPodcasts, selection, searchInputAtom } from '../../atoms';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Episode, EXMDevState, FullEpisodeInfo, Podcast } from '../../interfaces';
import Track from '../../component/reusables/track';
import FeaturedPodcast, { featuredPocastCarouselStyling } from '../../component/home/featuredPodcast';

const searchContainerStyling = "text-white h-full pb-80"
const resultsStyling = "text-2xl text-white font-bold mb-6"
const startTypingStyling = "text-center text-white text-2xl"
const searchLoadingStyling = "text-3xl text-white font-bold mb-6"
const noPodcastsStyling = "text-2xl text-white font-normal mb-12"
const podcastOptionStyling = "mb-6 w-[35%] flex flex-row items-center"

const removeDuplicates = (list: FullEpisodeInfo[]) => {
  const uniquePodcasts: FullEpisodeInfo[] = [];

  for (const obj of list) {
    const isDuplicate = uniquePodcasts.some(uniquePodcast => uniquePodcast.podcast.podcastName === obj.podcast.podcastName);

    if (!isDuplicate) {
      uniquePodcasts.push(obj);
    }
  }

  return uniquePodcasts;
};


export default function Search() {

  const { t } = useTranslation();

  const [titlesLoading, ] = useState(false);
  const [_titles, _setTitles] = useRecoilState(titles);
  const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);
  const [_selection, ] = useRecoilState(selection);
  const [searchInput, _] = useRecoilState(searchInputAtom); 

  const [filteredEpisodes, setFilteredEpisodes] = useState<FullEpisodeInfo[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<FullEpisodeInfo[]>([]);

  useEffect(() => {
    const fetchFiltered = async () => {
      if (searchInput.length === 0) return;

      let filteredPodcasts = removeDuplicates(allPodcasts_.filter((podcast: FullEpisodeInfo) => 
        podcast.podcast.podcastName.toLowerCase().includes(searchInput.toLowerCase())));
      
      let filteredEpisodes = removeDuplicates(allPodcasts_.filter((episode: FullEpisodeInfo) => 
        episode.episode.episodeName.toLowerCase().includes(searchInput.toLowerCase())));

      setFilteredPodcasts(filteredPodcasts.splice(0, 20));
      setFilteredEpisodes(filteredEpisodes.splice(0, 20));
    };

    fetchFiltered();
  }, [searchInput]);

  return (
    <div className={searchContainerStyling}>
      {titlesLoading ? 
        <div className={searchLoadingStyling}>{t("search.loading")}</div> 
      :
      (
        <div>
          {searchInput.length === 0 ? <div className={startTypingStyling}>{t("search.starttyping")}</div>: (
            <div>
              <div className={resultsStyling}>{t("search.podcasts")}</div>
              <div className={featuredPocastCarouselStyling}>
                {filteredPodcasts.map((podcast: FullEpisodeInfo, index: number) => (
                  <FeaturedPodcast {...podcast.podcast } key={index} />
                ))}
              </div>
              <div className='mt-6'>
                <div className={resultsStyling}>{t("search.episodes")}</div>
                {filteredEpisodes.map((episode: FullEpisodeInfo, index: number) => (
                  <div className="mb-4">
                    <Track {...{episode}} key={index} includeDescription includePlayButton />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ]))
    },
  }
}