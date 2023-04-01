import { FC, useMemo } from "react";
import axios from 'axios';
import { Episode, EXMDevState, FullEpisodeInfo, Podcast } from '../interfaces';
import { allPodcasts } from '../atoms';
import { useRecoilState } from "recoil";

const QueryPodcasts: FC = () => {
  const [_, setAllPodcasts_] = useRecoilState(allPodcasts);

  useMemo(() => {
    console.log('initial load for QueryPodcasts.tsx');
    const fetchPodcasts = async () => {
      const exmState: EXMDevState = (await axios.get('/api/exm/read')).data;
      const { podcasts } = exmState;
      const episodes: FullEpisodeInfo[] = podcasts
      .map((podcast: Podcast) => podcast.episodes
        .map((episode: Episode, index: number) => 
          ({podcast, episode: {...episode, order: index}})))
            .flat();
      setAllPodcasts_(episodes);
    };
    fetchPodcasts();
  }, []);

  return (
    <>
    </>
  );
};

export default QueryPodcasts;