import axios from "axios";
import { EXMState, Episode, FullEpisodeInfo, Podcast } from "../interfaces";
import { sleep, sortDuplicateStrings } from "./ui";

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
      ({ podcast, episode: { ...episode, order: index } })))
  .flat();

export const fetchPodcast = async (index: number, pid?: string) => {
  const state: EXMState = (await axios.get('/api/exm/read')).data;
  const podcastViaPID = state.podcasts.find(podcast => podcast.pid === pid);
  const podcastViaIndex = index !== 0 ? state.podcasts[index] : undefined;

  return { podcastViaPID, podcastViaIndex };
};

export const attemptIndexPodcastID = async (index: number, pid?: string) => {
  let attempts = 3;

  for (let i = 0; i < attempts; i++) {
    const { podcastViaPID, podcastViaIndex } = await fetchPodcast(index, pid);
    const foundPod = podcastViaIndex || podcastViaPID;
    console.log('foundPod', foundPod)
    console.log('pid and index', pid, index)
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

export const sortHomepageInfo = async (podcasts: Podcast[]) => {
  const episodes: FullEpisodeInfo[] = podcasts
    .map((podcast: Podcast) => podcast.episodes
      .map((episode: Episode, index: number) => {
        if (episode.isVisible) {
          return ({ podcast, episode: { ...episode, order: index } })
        }
      }
      ))
    .flat();
  const sortedEpisodes = episodes.sort(
    (episodeA, episodeB) => episodeB.episode.uploadedAt - episodeA.episode.uploadedAt
  ).splice(0, 3);

  const sortedPodcasts: Podcast[] = podcasts.filter(
    (podcast: Podcast) => podcast.episodes.length > 0 && !podcast.podcastName.includes("Dick")
  ).splice(0, 6);

  const allCreators = podcasts.sort(
    (podcastA: Podcast, podcastB: Podcast) => podcastB.episodes.length - podcastA.episodes.length
  ).map((podcast: Podcast) => podcast.owner);

  const featuredCreators = sortDuplicateStrings(allCreators).splice(0, 3);

  return { sortedEpisodes, sortedPodcasts, featuredCreators };
};
