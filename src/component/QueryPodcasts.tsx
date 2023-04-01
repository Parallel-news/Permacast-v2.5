import { FC, useMemo } from "react";
import axios from 'axios';
import { Episode, EXMDevState, FullEpisodeInfo, Podcast } from '../interfaces';
import { allPodcasts } from '../atoms';
import { useRecoilState } from "recoil";

const QueryPodcasts: FC = () => {
  const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);

  useMemo(() => {
    if (allPodcasts_.length !== 0) return;
    console.log('initial load for QueryPodcasts.tsx');
    const fetchPodcasts = async () => {
      const exmState: EXMDevState = (await axios.get('/api/exm/read')).data;
      const { podcasts } = exmState;
      setAllPodcasts_(podcasts);
    }
    fetchPodcasts();
  }, []);

  return (
    <>
    </>
  );
};

export default QueryPodcasts;