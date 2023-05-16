import { CreateCollectionObject, GetNftInfo, NftObject, RetrieveNftObject } from '../types'
import { apiClient } from '../../../lib/api-client'
import { findKey, generateAuthentication } from '../../../utils/reusables'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { defaultSignatureParams, useArconnect } from 'react-arconnect'
import { CLAIM_FACTORY, USER_SIG_MESSAGES } from '../../../constants'

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

//UNDER CONSTRUCTION
//Now test to make sure it can save to the blockchain

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
  console.log(res)
  return res
}

// Another function that retrieve get and determines if there is a collection already
