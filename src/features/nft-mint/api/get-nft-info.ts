import { apiClient } from '../../../lib/api-client'
import { collectionExists, compileShowData, existsClaimableFactories } from '../utils'
import { CLAIM_FACTORY, MINT_NFT, NFT_INFO, SUBMIT_REQUESTS } from '../../../constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import { generateAuthentication } from '../../../utils/reusables'
import { CreateCollectionObject, CreateEpisodeNftObject, GetNftInfo, MintBatchEpisodeObject, NftObject } from '../types'

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
      console.log("nftPayload: ", nftPayload)
      console.log("podcasts: ", podcasts)
      
      const [isMinted, showData, claimableFactories] = await Promise.all([
        collectionExists({ pid: pid, nftPayload: nftPayload }),
        compileShowData({ pid: pid, podcasts: podcasts.podcasts, nftPayload: nftPayload }),
        existsClaimableFactories(nftPayload)
      ])

      const t = [true]
      return {
        ...isMinted,
        ...showData,
        ...claimableFactories
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

export const mintEpisode = async({eid, target, jwk_n, sig} : CreateEpisodeNftObject) => {

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

export function useBatchMint() {
  return useMutation({
    mutationFn: mintBatchEpisodes,
    onSuccess: data => data
  });
}

export const mintBatchEpisodes = async({payload, jwk_n, sig} : MintBatchEpisodeObject) => {

  const mintArgs = {
    "function": SUBMIT_REQUESTS,
    "jwk_n": jwk_n,
    "payload": payload,
    "sig": sig
  }

  const res = await apiClient.post('/api/exm/collections/write', mintArgs)
  return res
}