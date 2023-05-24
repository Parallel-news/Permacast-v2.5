import { Episode } from "../../../interfaces"
import { findKey } from "../../../utils/reusables"
import { RetrieveNftObject, compiledShowObject } from "../types"

export const collectionExists = async ({ pid, nftPayload }: RetrieveNftObject | null) => {
    const foundCollection = findKey(nftPayload.factories, pid)
    return {
        collectionAddr: foundCollection
    }
}

export const compileShowData = async({pid, podcasts, nftPayload}: compiledShowObject) => {
    const podcast = podcasts.find(obj => obj.pid === pid) //Grab all podcasts
    const mintedEpisodes = podcast.episodes.map(episode => nftPayload.records.find(record => record.eid === episode.eid)) //which ones minted?
    let countMinted = 0
    const jointEpisodes = podcast.episodes.map((episode, index) => { //create new payload showing mint status
        if (mintedEpisodes[index]) {
          countMinted += 1
          return { ...episode, minted: true };
        } else {
          return { ...episode, minted: false };
        }
    })
    return {
      name: podcast.podcastName,
      cover: podcast.cover,
      episodes: jointEpisodes,
      allMinted: countMinted === podcast.episodes.length
    }
}

export const grabEpisodeData = (episodes: Episode[], eid: string) => {
  const episode = episodes.map((episode) => episode.eid === eid)
  return episode
}   