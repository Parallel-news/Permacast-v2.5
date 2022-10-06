import { useContext } from 'react';
import { appContext } from '../../utils/initStateGen';
import { getButtonRGBs } from '../../utils/ui';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';


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

  return (
    <div onClick={() => episodeIsCurrent ? playCurrentTrack() : playEpisode(episode, episodeNumber)}>
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
