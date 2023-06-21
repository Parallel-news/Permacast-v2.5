import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ALL_PODCASTS, UNIX_SORTED_PODCASTS } from "@/constants/index";
import { Podcast } from "@/interfaces/index";
import { detectTimestampType } from "@/utils/reusables";


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

export function getVisiblePodcast () {
  return useQuery({
    queryKey: [UNIX_SORTED_PODCASTS],
    queryFn: async () => {
      const payload = await getPodcastPayload();
      const podcasts = payload.podcasts as Podcast[];
      const visiblePodcast = podcasts.filter((podcast) => podcast.isVisible === true)
      return { podcasts: visiblePodcast };
    },
    enabled: true
  })
}

