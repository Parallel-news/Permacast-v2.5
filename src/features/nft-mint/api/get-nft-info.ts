import { CreateCollectionObject, GetNftInfo, NftObject, RetrieveNftObject } from '../types'
import { apiClient } from '../../../lib/api-client'
import { findKey, generateAuthentication } from '../../../utils/reusables'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { defaultSignatureParams, useArconnect } from 'react-arconnect'
import { USER_SIG_MESSAGES } from '../../../constants'

export const getNftInfo = (): Promise<NftObject> => apiClient.get('/api/exm/collections/read')

export const fetchCollectionInfo = async ({ pid }: RetrieveNftObject | null) => {
    const nftDb = await getNftInfo()
    const foundCollection = findKey(nftDb.factories, pid)
    return {
        collectionAddr: foundCollection
    }
}

export function useNftInfo({ enabled, pid } : GetNftInfo) {
  return useQuery({
    queryKey: ['nftInfo'],
    queryFn: () => fetchCollectionInfo({pid: pid}),
    enabled: enabled
  });
}

export const createNftCollection = async ({pid, getPublicKey, createSignature} : CreateCollectionObject) => {
  const { sig, jwk_n } = await generateAuthentication({getPublicKey, createSignature})
  console.log("sig: ", sig)
  console.log("jwk: ", jwk_n)
  return false
}

//mutation needed to post to address

// Another function that retrieve get and determines if there is a collection already
