import { apiClient } from '../../../lib/api-client'
import { collectionExists, compileShowData } from '../utils'
import { CLAIM_FACTORY, MINT_NFT, NFT_INFO } from '../../../constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import { generateAuthentication } from '../../../utils/reusables'
import { CreateCollectionObject, CreateEpisodeNftObject, GetNftInfo, NftObject } from '../types'

export const getNftInfo = (): Promise<NftObject> => apiClient.get('/api/exm/collections/read')
export const getPodcastPayload = (): Promise<any> => apiClient.get('/api/exm/read')

/**
 * Fetch NFT Payload
 */

export function determineMintStatus({ enabled, pid } : GetNftInfo) {
  return useQuery({
    queryKey: [NFT_INFO],
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

  const res = await apiClient.post('/api/exm/collections/write', mintArgs)
  return res
}