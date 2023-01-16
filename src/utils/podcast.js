import { WEBSITE_URL, API_MAP, ANS_TESTNET_MAP, MESON_ENDPOINT } from "./arweave";
import FastAverageColor from 'fast-average-color';

export async function getColor (url) {
  const fac = new FastAverageColor();
  let color = await fac.getColorAsync(url);
  return color.rgb;
}

export async function convertToEpisode(podcast, episode, useColor=true) {
  const rgb = useColor ? await getColor(MESON_ENDPOINT + '/' + podcast.cover) : 'rgb(0,0,20)';

  return {
    cover: podcast?.cover?.includes(MESON_ENDPOINT) ? podcast?.cover: MESON_ENDPOINT + '/' + podcast?.cover,
    title: episode.episodeName,
    description: episode.description,
    episodesCount: podcast?.episodes?.length || podcast?.episodesCount || null,
    firstTenEpisodes: () => null,
    getEpisodes: () => null,
    creatorName: podcast?.author || podcast?.creatorName || null,
    creatorAddress: podcast?.owner || podcast?.creatorAddress || null,
    creatorEmail: podcast?.creatorEmail || podcast?.email || null,
    creatorANS: podcast?.creatorANS || podcast?.ansOwnerLabel || null,
    createdAt: episode.uploadedAt,
    explicit: podcast?.explicit || null,
    visible: episode.visible,
    language: podcast?.language || null,
    contentUrl: MESON_ENDPOINT + '/' + episode.contentTx,
    contentTx: episode.contentTx,
    podcastId: podcast?.podcastId || podcast?.pid || null,
    mediaType: episode.type,
    objectType: 'episode',
    superAdmins: podcast?.superAdmins || null,
    rgb: useColor ? rgb: podcast?.rgb,
  };
}

export async function convertSearchItem(podcast, useColor=true) {
  const rgb = await getColor(MESON_ENDPOINT + '/' + podcast.cover) 
  return {
    cover: MESON_ENDPOINT + '/' + podcast.cover,
    title: podcast.title,
    podcastId: podcast.id,
    type: podcast.type,
    rgb: rgb,
  }
}

export async function convertToPodcast(podcast) {
  const rgb = await getColor(MESON_ENDPOINT + '/' + podcast.cover) 

  return {
    cover: MESON_ENDPOINT + '/' + podcast.cover,
    title: podcast.podcastName,
    description: podcast.description,
    episodesCount: podcast.episodes.length,
    firstTenEpisodes: (useColor=false) => podcast.episodes.splice(0, 10).map(e => convertToEpisode(podcast, e, useColor)),
    getEpisodes: (start, end, useColor=false) => podcast.episodes.splice(start, end).map(e => convertToEpisode(podcast, e, useColor)),
    creatorName: podcast.author,
    creatorAddress: podcast.owner,
    creatorEmail: podcast.email,
    creatorANS: podcast.ansOwnerLabel,
    createdAt: podcast.createdAt,
    explicit: podcast.explicit,
    visible: podcast.isVisible,
    language: podcast.language,
    contentUrl: null,
    contentTx: null,
    podcastId: podcast.pid,
    mediaType: null,
    objectType: 'podcast',
    superAdmins: podcast.superAdmins,
    rgb: rgb,
  }
}

export function filters(t) {
  return [
    {type: "podcastsactivity", desc: t("sorting.podcastsactivity")},
    {type: "episodescount", desc: t("sorting.episodescount")}
  ]
}

export function filterTypes(filters) { 
  return filters.map(f => f.type)
}

export const getPodcasts = async () => {
  const json = await (
    await fetch(API_MAP.podcasts)
  ).json();
  return json.res;
};

export const getPodcastEpisodes = async (podcastId) => {

  const response = await fetch(API_MAP.episodes + podcastId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', }
  });

  const episodes = (await response.json())["episodes"];
  return episodes;
};

// only accepts podcasts object from the getPodcasts() function 
export const getPodcast = (podcasts, podcastId) => {
  let filteredPodcasts = podcasts.filter(
    obj => !(obj && Object.keys(obj).length === 0)
  );

  const podcast = filteredPodcasts.find(podcast => podcast.pid === podcastId)
  return podcast;
};


export const fetchPodcastTitles = async () => {
  const json = await (
    await fetch(API_MAP.mapping)
  ).json();
  return json.res;
};

export const sortPodcasts = async (filters) => {
  let url = `${WEBSITE_URL}/feeds/podcasts/sort/`;
  let result = [];
  
  // Basically, this sandwiches all possible filter requests into one
  await Promise.all(filters.map(async (filter) => {
    result[filter] = await fetch(url+filter).then(res => res.json()).then(json => json.res);
  }))

  return result;
};


// accepts a podcast object from the getPodcast() function
export const findCreator = async (creatorAddress, podcasts) => {
  let creatorPodcasts = podcasts.filter(podcast => podcast.owner === creatorAddress);
  return creatorPodcasts;
};

export const getCreator = async (address, signalObj) => {
  const re = /([a-zA-Z0-9_-]{43})/;
  if (!address.match(re)) return;
  const creator = await fetch(`/ans/profile/${address}`, signalObj);
  return creator.json();
};
