import { apiClient } from '../../../lib/api-client'
import { CLAIM_FACTORY, MINT_NFT } from '../../../constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import { findKey, generateAuthentication } from '../../../utils/reusables'
import { CreateCollectionObject, CreateEpisodeNftObject, GetNftInfo, NftObject, RetrieveNftObject, compiledShowObject } from '../types'

export const getNftInfo = (): Promise<NftObject> => apiClient.get('/api/exm/collections/read')
export const getPodcastPayload = (): Promise<any> => apiClient.get('/api/exm/read')

/**
 * Fetch NFT Payload
 */
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

export function determineMintStatus({ enabled, pid } : GetNftInfo) {
  return useQuery({
    queryKey: ['nftInfo'],
    queryFn: async () => {

      const [nftPayload, podcasts] = await Promise.all([
        getNftInfo(),
        getPodcastPayload()
      ])

      const [isMinted, showData] = await Promise.all([
        collectionExists({ pid: pid, nftPayload: nftPayload }),
        compileShowData({ pid: pid, podcasts: podcasts.podcasts, nftPayload: nftPayload })
      ])

      return {
        ...isMinted,
        ...showData
      }
      
    },
    enabled: enabled
  });
}

/**
 * Check NFT Stage - Mint Collection vs Mint Episode
 */

/**
 * Create an NFT Collection
 */
export function useCreateCollection() {
  return useMutation({
    mutationFn: createNftCollection,
    onSuccess: data => data
  });
}

export const createNftCollection = async ({pid, getPublicKey, createSignature} : CreateCollectionObject) => {

  const { sig, jwk_n } = await generateAuthentication({getPublicKey, createSignature})

  const collectionArgs = {
    "function": CLAIM_FACTORY,
    "jwk_n": jwk_n,
    "cid": pid,
    "sig": sig
  }

  const res = await apiClient.post('/api/exm/collections/write', collectionArgs)
  return res
}

/**
 * Mint an Episode
 */
export function useMintEpisode() {
  return useMutation({
    mutationFn: mintEpisode,
    onSuccess: data => data
  });
}

export const mintEpisode = async({eid, target, getPublicKey, createSignature} : CreateEpisodeNftObject) => {

  const { sig, jwk_n } = await generateAuthentication({getPublicKey, createSignature})

  const mintArgs = {
    "function": MINT_NFT,
    "jwk_n": jwk_n,
    "eid": eid,
    "target": target,
    "sig": sig
  }
  console.log("Mint Payload:", mintArgs)
  const res = await apiClient.post('/api/exm/collections/write', mintArgs)
  return res
}