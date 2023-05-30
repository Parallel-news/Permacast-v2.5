import { useQuery } from "@tanstack/react-query";
import { ALL_PODCASTS } from "../../../constants";
import { apiClient } from "../../../lib/api-client";


export const getPodcastPayload = (): Promise<any> => apiClient.get('/api/exm/read')

export function getPodcastData () {
  return useQuery({
    queryKey: [ALL_PODCASTS],
    queryFn: async () => {
      const payload = await getPodcastPayload()
      return {
        podcasts: payload.podcasts
      }
    },
    enabled: true
  })
}

