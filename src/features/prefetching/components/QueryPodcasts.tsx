
import axios from 'axios';
import { useEffect } from "react";
import { EXMState } from "../../../interfaces";
import { allPodcasts } from "../../../atoms";
import { useRecoilState } from "recoil";
import { getPodcastData } from "../api";

export default function QueryPodcasts() {

      const [allPodcasts_, setAllPodcasts_] = useRecoilState(allPodcasts);

      const queryPodcastData = getPodcastData()
      const payload = queryPodcastData.data

      
      if(!queryPodcastData.isLoading) {
          console.log(payload)
      } else {
          console.log("Loading...")
      }
    
      /*
      CONSTRUCTION:
      1. Get rid of useEffect to begin calls. No need for a prefetch
    
      3. Create React Query API Calls That Prefetch & Fetch that could be used in different components? 
    
      4. Replace all instances of allPodcasts_ in app for the react query
    
    
    
    
      */
      useEffect(() => {
        if (allPodcasts_.length !== 0) return;
        const fetchPodcasts = async () => {
          const data = (await axios.get('/api/exm/read')).data;
          const exmState: EXMState = data;
          const { podcasts } = exmState;
          console.log("Fetchening 2")
          setAllPodcasts_(podcasts)
        }
        fetchPodcasts();
        
      }, []);
    
      console.log("Fetchening 1")
      
      return (
        <>
        </>
      );
}