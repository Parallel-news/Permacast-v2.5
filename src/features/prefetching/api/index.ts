import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import { ALL_PODCASTS } from "@/constants/index";
import { Podcast } from "@/interfaces/index";


export const getPodcastPayload = (): Promise<any> => apiClient.get('/api/exm/read');

export function getPodcastData () {
  return useQuery({
    queryKey: [ALL_PODCASTS],
    queryFn: async () => {
      const payload = await getPodcastPayload();
      const podcasts = payload.podcasts as Podcast[];
      return { podcasts };
    },
    enabled: true
  })
}

