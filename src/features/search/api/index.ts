import axios from 'axios';
import Fuse from 'fuse.js';

import { Podcast, Episode, FullEpisodeInfo } from '@/interfaces/index';
import { removeDuplicates } from '@/utils/filters';
import { getPodcastData } from '@/features/prefetching';

// const searchQueryFn = async (query: string, start: number, limit: number) => {
//   const QUERY_PODCASTS_KEY = 'podcastsKey';
//   const QUERY_PODCASTS_TOTAL_KEY = 'podcastCountKey';
//   const QUERY_EPISODES_KEY = 'episodesKey';
//   const QUERY_EPISODES_TOTAL_KEY = 'episodesTotalKey';
//   const QUERY_CREATORS_KEY = 'creatorsKey';

//   const lq = query.toLowerCase();

//   const queries = [{
//     key: QUERY_PODCASTS_KEY,
//     query: `podcasts[[$contains($lowercase(podcastName), "${lq}")]][[${start}..${limit}]]`
//     //[$sort(createdAt)].[$sort(createdAt)]
//   }, {
//     key: QUERY_PODCASTS_TOTAL_KEY,
//     query: `$count(podcasts[[$contains($lowercase(podcastName), "${lq}")]])`
//     //.episodes[$contains($lowercase(episodeName), "${lq}")][$sort(uploadedAt)][[${start}..${limit}]] 
//   },
//   {
//     key: QUERY_EPISODES_KEY,
//     query: `podcasts.episodes[[$contains($lowercase(episodeName), "${lq}")]][[${start}..${limit}]]`
//   },
//   {
//     key: QUERY_EPISODES_TOTAL_KEY,
//     query: `$count(podcasts.episodes[[$contains($lowercase(episodeName), "${lq}")]])`
//   }];

//   const results = (await axios.post('/api/exm/read', {
//     queries,
//   })).data;

//   const podcasts: Podcast[] = results[QUERY_PODCASTS_KEY] || [];
//   const podcastsCount: number = results[QUERY_PODCASTS_TOTAL_KEY];
//   const episodes: Episode[] = results[QUERY_EPISODES_KEY] || [];
//   const episodesCount: number = results[QUERY_EPISODES_TOTAL_KEY];
//   const creators = results[QUERY_CREATORS_KEY];
//   return { podcasts, podcastsCount, episodes, episodesCount };
// };

// isCaseSensitive: false,
// includeScore: false,
// shouldSort: true,
// includeMatches: false,
// findAllMatches: false,
// minMatchCharLength: 1,
// location: 0,
// threshold: 0.6,
// distance: 100,
// useExtendedSearch: false,
// ignoreLocation: false,
// ignoreFieldNorm: false,
// fieldNormWeight: 1,

export const searchQueryPodcasts = (query: string, start: number, limit: number, podcasts: Podcast[]) => {
  if (!podcasts) return { foundPodcasts: [], foundPodcastsEpisodes: [] };

  const podcastOptions = {
    minMatchCharLength: 0.1,
    threshold: 0.2,
    keys: ["podcastName"]
  };
  
  const podcastFuse = new Fuse(podcasts, podcastOptions);
  const podcastResult = podcastFuse.search(query);
  const foundPodcasts = podcastResult.map(pod => pod.item).slice(start, limit);
  // const foundPodcastsEpisodes = episodeResult.filter((podcast) =>
  //   podcast.item.episodes.filter((episode: Episode) =>
  //     episode.episodeName.toLowerCase().includes(query)
  //   ).length
  // );

  const totalPodcasts: number = podcastResult?.length || 0;
  // console.log(totalPodcasts)
  // const foundEpisodes = episodes.sort((episodeA, episodeB) => episodeB.episode.uploadedAt - episodeA.episode.uploadedAt).splice(0, 3);
  // const sortedPodcasts: Podcast[] = podcasts.filter((podcast: Podcast) => podcast.episodes.length > 0 && !podcast.podcastName.includes("Dick")).splice(0, 6);


  return { foundPodcasts, totalPodcasts };
};

export const searchQueryEpisodes = (query: string, start: number, limit: number, podcasts: Podcast[]) => {
  const episodeOptions = {
    keys: ["episodes.episodeName"]
  };
  const newLimit = start + limit;
  const episodeFuse = new Fuse(podcasts, episodeOptions);
  const episodeResult = episodeFuse.search(query, { limit: newLimit });

  const foundEpisodes: FullEpisodeInfo[] = episodeResult
    .map((podcast) => podcast.item.episodes
      .map((episode: Episode, index: number) =>
        ({ podcast: podcast.item, episode: { ...episode, order: index } })))
    .flat().slice(start, newLimit);

  const totalEpisodes: number = foundEpisodes?.reduce((acc: number) => acc + 1, 0) || 0;
  return { foundEpisodes, totalEpisodes }
};

const searchQuery = async (query: string, start: number, limit: number, podcasts: Podcast[]) => {
  const { foundPodcasts, totalPodcasts } = searchQueryPodcasts(query, start, limit, podcasts);
  const { foundEpisodes, totalEpisodes } = searchQueryEpisodes(query, start, limit, podcasts);
  return { foundPodcasts, totalPodcasts, foundEpisodes, totalEpisodes }
};

export default searchQuery;