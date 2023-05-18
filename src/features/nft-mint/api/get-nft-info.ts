import { CLAIM_FACTORY } from '../../../constants'
import { apiClient } from '../../../lib/api-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { findKey, generateAuthentication } from '../../../utils/reusables'
import { CreateCollectionObject, GetNftInfo, NftObject, RetrieveNftObject, compiledShowObject } from '../types'
import { Podcast } from '../../../interfaces'

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

export const compileShowData = async({pid, podcasts}: compiledShowObject) => {
  const podcast = podcasts.find(obj => obj.pid === pid)
  return {
    name: podcast.podcastName,
    cover: podcast.cover
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
        compileShowData({ pid: pid, podcasts: podcasts.podcasts })
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
