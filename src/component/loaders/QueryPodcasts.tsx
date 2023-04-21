import { FC, useEffect } from "react";
import axios from 'axios';
import { Episode, EXMDevState, FullEpisodeInfo, Podcast } from '../../interfaces';
import { allPodcasts } from '../../atoms';
import { useRecoilState } from "recoil";

const QueryPodcasts: FC = () => {
  const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);

  useEffect(() => {
    if (allPodcasts_.length !== 0) return;
    const fetchPodcasts = async () => {
      const data = (await axios.get('/api/exm/read')).data;
      const exmState: EXMDevState = data;
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