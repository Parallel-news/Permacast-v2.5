import axios from 'axios';
import { FC, useEffect } from "react";

import { allANSUsersAtom, allPodcasts } from '../../atoms';
import { useRecoilState } from "recoil";
import { ANS_MAPPED_STATE_URL } from '../../constants';

const QueryANS: FC = () => {

  const [allANSUsers, setAllANSUsers] = useRecoilState(allANSUsersAtom);

  useEffect(() => {
    if (allANSUsers.length !== 0) return;
    const fetchPodcasts = async () => {
      const users = (await axios.get(ANS_MAPPED_STATE_URL)).data;
      setAllANSUsers(users);
    }
    fetchPodcasts();
  }, []);

  return (
    <>
    </>
  );
};

export default QueryANS;