import { useRecoilState } from 'recoil';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { titles, allPodcasts, selection, searchInputAtom, loadingPage } from '../../atoms';
import { FullEpisodeInfo, Podcast } from '../../interfaces';
import Track from '../../component/reusables/track';
import { convertPodcastsToEpisodes, removeDuplicates } from '../../utils/filters';
import FeaturedPodcastCarousel from '../reusables/FeaturedPodcastCarousel';

const searchContainerStyling = "text-white h-full pb-80"
const resultsStyling = "text-2xl text-white font-bold mb-6"
const startTypingStyling = "text-center text-white text-2xl"
const searchLoadingStyling = "text-3xl text-white font-bold mb-6"

export default function SearchSet({ query }) {
  
    const { t } = useTranslation();
    const [titlesLoading, ] = useState(false);
    const [_titles, _setTitles] = useRecoilState(titles);
    const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);
    const [_selection, ] = useRecoilState(selection);
    const [searchInput, setSearchInput] = useRecoilState(searchInputAtom); 
    const [allEpisodes, setAllEpisodes] = useState<FullEpisodeInfo[]>([]);
    const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
    const [filteredEpisodes, setFilteredEpisodes] = useState<FullEpisodeInfo[]>([]);
    const [, _setLoadingPage] = useRecoilState(loadingPage)
  
    useEffect(() => { setSearchInput(query);  }, []);
    useEffect(() => {
      if (allPodcasts_.length) setAllEpisodes(convertPodcastsToEpisodes(allPodcasts_));
    }, [allPodcasts_]);
  
    useEffect(() => {
      const fetchFiltered = async () => {
        if (searchInput.length === 0 || allPodcasts_.length === 0 || allEpisodes.length === 0) return;
        
        let filteredPodcasts = allPodcasts_.filter((podcast: Podcast) => 
          podcast.podcastName.toLowerCase().includes(searchInput.toLowerCase()));
        
        let filteredEpisodes = removeDuplicates(allEpisodes.filter((episode: FullEpisodeInfo) => 
          episode.episode.episodeName.toLowerCase().includes(searchInput.toLowerCase())));
  
        setFilteredPodcasts(filteredPodcasts.splice(0, 20));
        setFilteredEpisodes(filteredEpisodes.splice(0, 20));
      };
  
      fetchFiltered();
      _setLoadingPage(false);
    }, [searchInput, allPodcasts_, allEpisodes]);

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
                  <FeaturedPodcastCarousel 
                    podcasts={filteredPodcasts}
                  />
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