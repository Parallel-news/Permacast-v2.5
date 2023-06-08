import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { useArconnect } from 'react-arconnect';
import { useRecoilState } from 'recoil';

import { useQuery } from '@tanstack/react-query';

import { titles, selection, searchInputAtom, loadingPage } from '@/atoms/index';
import { FullEpisodeInfo, Podcast } from '@/interfaces/index';
import { Track } from '@/component/reusables';
import { removeDuplicates } from '@/utils/filters';

import { Icon } from '@/component/icon';
import Pagination from '@/component/reusables/Pagination';
import PodcastGrid from '@/component/home/PodcastGrid';
import Loading from '@/component/reusables/loading';

import { getPodcastData } from '@/features/prefetching';
import searchQuery from '../api';
import ViewDropDown from '@/component/viewDropDown';

const searchContainerStyling = "text-white h-full pb-80"
const resultsStyling = "text-2xl text-white font-bold mb-6"
const startTypingStyling = "text-center text-white text-2xl"
const searchLoadingStyling = "text-3xl text-white font-bold mb-6"

interface SearchResultsProps {
  query: string;
};


// const Comp = () => {

//   // const {address, getPublickey, createsignature} = useArconnect();
//   const armojiData = fetchArmojiData({enabled: true, domain: "darwin"})
//   // const arnames = fetchArnamesData {enabled: address ? true: false, wallet: address})

//   return (
//     <div className="flex flex-col justify-center xl:justify-start items-center xl:items-start">
//       {armojiData.isFetching && (
//         <div></div>
//       )}
//       {armojiData.isError && (
//         <div></div>
//       )}
//       {armojiData?.data && armojiData.isFetched && !armojiData. isFetching && (
//         <div></div>
//       )}
//     </div>
//   )
// }

export default function SearchResults({ query }: SearchResultsProps) {

  const { t } = useTranslation();
  const [, _setLoadingPage] = useRecoilState(loadingPage);
  const [searchInput, setSearchInput] = useRecoilState(searchInputAtom);
  const [maxPages, setMaxPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const queryPodcastData = getPodcastData();
  const { data: state } = queryPodcastData;

  const MAX_ITEMS_PER_PAGE = 4;
  const index = MAX_ITEMS_PER_PAGE * (currentPage - 1);

  const { data: searchQueryData, isLoading: searchQueryIsLoading, isError: searchQueryIsError } = useQuery({
    queryKey: ['searchQuery', state?.podcasts, index, searchInput],
    queryFn: async () => {
      const result = await searchQuery(
        searchInput,
        index,
        index + MAX_ITEMS_PER_PAGE,
        state?.podcasts || []
      );
      const maxPodcastPages = Math.floor((result?.totalPodcasts || MAX_ITEMS_PER_PAGE * 2) / MAX_ITEMS_PER_PAGE) - 1;
      setMaxPages(maxPodcastPages > 0 ? maxPodcastPages : 1);
      return result;
    }
  });

  const finishedSearching = (searchQueryData && !searchQueryIsLoading);

  const PodcastsSearchResults = () => (
    <div>
      {searchQueryIsLoading && (
        <></>
      )}
      {searchQueryIsError && (
        <div>{t("search.error")}</div>
      )}
      {finishedSearching && (
        <>
        </>
      )}
    </div>
  );

  const EpisodeSearchResults = () => (
    <div className='mt-6'>
      <div className={resultsStyling}>{t("search.episodes")}</div>
      {/* {searchQuery.data.filteredEpisodes.map((episode: FullEpisodeInfo, index: number) => (
        <div className="mb-4">
          <Track {...{ episode }} key={index} includeDescription includePlayButton />
        </div>
      ))} */}
    </div>
  );

  return (
    <div className={searchContainerStyling}>
      {queryPodcastData.isLoading ? (
        <div className={searchLoadingStyling}>{t("search.loading")}</div>
      ): (
        <div>
          {!searchInput.length && <div className={startTypingStyling}>{t("search.starttyping")}</div>}
          {searchInput.length > 0 && (
            <>
              <div className={resultsStyling}>{t("search.podcasts")}</div>
              {/* <ViewDropDown /> */}
              <PodcastsSearchResults />
              <PodcastGrid podcasts={[...(searchQueryData?.foundPodcasts || [])]} />
              {/* <PodcastGrid podcasts={[...searchQueryData.foundPodcasts || []]} /> */}
              <div className="my-8"></div>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={maxPages}
                limitPagination={3}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};