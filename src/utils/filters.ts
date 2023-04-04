import { Episode, FullEpisodeInfo, Podcast } from "../interfaces";

export const removeDuplicates = (list: FullEpisodeInfo[]) => {
  const uniquePodcasts: FullEpisodeInfo[] = [];

  for (const obj of list) {
    const isDuplicate = uniquePodcasts.some(uniquePodcast => uniquePodcast.podcast.podcastName === obj.podcast.podcastName);

    if (!isDuplicate) {
      uniquePodcasts.push(obj);
    }
  }

  return uniquePodcasts;
};

export const convertPodcastsToEpisodes = (podcasts: Podcast[]) => podcasts
  .map((podcast: Podcast) => podcast.episodes
    .map((episode: Episode, index: number) => 
      ({podcast, episode: {...episode, order: index}})))
        .flat();