import { NftObject, RetrieveNftObject } from '../types'
import { apiClient } from '../../../lib/api-client'
import { findKey } from '../../../utils/reusables'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const getNftInfo = (): Promise<NftObject> => apiClient.get('/api/exm/readNft')

export const fetchCollectionInfo = async ({ pid }: RetrieveNftObject | null) => {
    const nftDb = await getNftInfo()
    const foundCollection = findKey(nftDb.factories, pid)
    return {
        collectionAddr: foundCollection
    }
}

export function usePosts() {
    return useQuery({
      queryKey: ["posts"],
      queryFn: async () => {
        const { data } = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        return data;
      },
    });
  }

// Another function that retrieve get and determines if there is a collection already
