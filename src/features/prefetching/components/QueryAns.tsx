import axios from 'axios';
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { allANSUsersAtom } from '../../../atoms';
import { ANS_MAPPED_STATE_URL } from '../../../constants';

export default function QueryAns() {

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
}
