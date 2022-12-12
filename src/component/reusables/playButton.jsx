import { useContext } from 'react';
import { appContext } from '../../utils/initStateGen';
import { getButtonRGBs } from '../../utils/ui';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { useRecoilState } from 'recoil';
import { primaryData, secondaryData, switchFocus, videoSelection } from '../../atoms';


export default function PlayButton({episode, episodeNumber="1", color=""}) {
  const appState = useContext(appContext);
  
  const { currentEpisode, playEpisode } = appState.queue;
  const { isPaused, setIsPaused } = appState.playback;
  const c = color ? color : episode?.rgb;

  const episodeIsCurrent = (currentEpisode?.contentTx === episode.contentTx) || (currentEpisode?.contentTx === episode?.eid);
  const { player } = appState;

  const playCurrentTrack = () => {
    if (!player) return;
    player.toggle()
    setIsPaused(!isPaused)
  }

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [primaryData_, setPrimaryData_] = useRecoilState(primaryData);
  const [secondaryData_, setSecondaryData_] = useRecoilState(secondaryData);
  const [vs_, setVS_] = useRecoilState(videoSelection);

  return (
    <div onClick={() => 
      {if(switchFocus_){
          appState.queue.playEpisode(episode, episode.eid)
      }else{
          setVS_(['https://arweave.net/'+episode.contentTx, {}])
        }
      }
    // episodeIsCurrent ? playCurrentTrack() : playEpisode(episode, episodeNumber)
    }>
      <div className="cursor-pointer rounded-[34px] p-3" style={getButtonRGBs(c)}>
        {episodeIsCurrent && !isPaused ? (
          <PauseIcon className="w-4 h-4 fill-current stroke-[3]" />
        ) : (
          <PlayIcon className="w-4 h-4 fill-current" />
        )}
      </div>
    </div>
  )
}
