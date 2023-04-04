import { Episode, FullEpisodeInfo, Podcast } from "../interfaces";

export const removeDuplicates = (list: FullEpisodeInfo[]) => {
  const uniquePodcasts: FullEpisodeInfo[] = [];

  for (const obj of list) {
    const isDuplicate = uniquePodcasts.some(uniquePodcast => uniquePodcast.podcast.podcastName === obj.podcast.podcastName);

    if (!isDuplicate) {
      uniquePodcasts.push(obj);
    };
  };

  return uniquePodcasts;
};

const MIN_CHARS = 40;

export const trimChars = (str: any) => (str || '').slice(0, MIN_CHARS);

export const matchFirstChars = (str1: string, str2: string) => str1.slice(0, MIN_CHARS) === str2.slice(0, MIN_CHARS);

export const findPodcast = (id: string, podcasts: Podcast[]) => 
  podcasts.find((podcast: Podcast) => (
    id === podcast.label ||
    id === podcast.pid ||
    matchFirstChars(id, podcast.pid)
  )
);

export const findEpisode = (id: string, episodes: Episode[]) =>
  episodes.find((episode: Episode) => (
    id === episode.eid ||
    matchFirstChars(id, episode.eid)
  )
);

export const convertPodcastsToEpisodes = (podcasts: Podcast[]) => podcasts
  .map((podcast: Podcast) => podcast.episodes
    .map((episode: Episode, index: number) => 
      ({podcast, episode: {...episode, order: index}})))
        .flat();