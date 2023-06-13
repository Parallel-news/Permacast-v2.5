import { Episode, FullEpisodeInfo, Podcast } from "../interfaces";
import { sleep } from "./ui";

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

const MIN_CHARS = 43;

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
  episodes.find((episode: Episode, index: number) => (
    id === episode.eid ||
    matchFirstChars(id, episode.eid)
  )
);

export const convertPodcastsToEpisodes = (podcasts: Podcast[]) => podcasts
  .map((podcast: Podcast) => podcast.episodes
    .map((episode: Episode, index: number) => 
      ({podcast, episode: {...episode, order: index}})))
        .flat();

export const fetchPodcast = async (podcasts: Podcast[], index: number, pid?: string) => {
  const podcastViaPID = podcasts.find(podcast => podcast.pid === pid);
  const podcastViaIndex = index !== 0 ? podcasts[index] : undefined;
  const podcast = podcastViaPID || podcastViaIndex;
  return podcast;
};

export const attemptIndexPodcastID = async (podcasts: Podcast[], index: number, pid?: string) => {
  let attempts = 3;
  
  for (let i = 0; i < attempts; i++) {
    const foundPod = await fetchPodcast(podcasts, index, pid);
    if (foundPod) {
      return foundPod.pid;
    } else {
      await sleep(3500);
      if (i === attempts - 1) {
        return null;
      };
    };
  };
};
