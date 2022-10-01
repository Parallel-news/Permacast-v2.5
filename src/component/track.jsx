import { useContext } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import {  } from 'react-icons/fa';
import { Cooyub } from './reusables/icons';
import { appContext } from '../utils/initStateGen';
import { getButtonRGBs } from '../utils/ui';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

export default function Track({episode, episodeNumber=1, includeDescription=false, playButtonSize="20", color=""}) {
  const appState = useContext(appContext);
  const history = useHistory();
  const { cover, title, creatorName, description, podcastId, objectType } = episode;
  const { currentEpisode, playEpisode } = appState.queue;
  const { isPaused, setIsPaused } = appState.playback;
  
  const episodeIsCurrent = currentEpisode?.contentTx === episode.contentTx;
  const { player } = appState;
  const c = color ? color : episode?.rgb;
  // const id = objectType === 'episode' ? episodeId : podcastId;
  const url = `/podcast/${podcastId}` + (objectType === 'episode' ? `/${episodeNumber}` : '');

  const playCurrentTrack = () => {
    player.toggle()
    setIsPaused(!isPaused)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img className="w-14 h-14 rounded-lg cursor-pointer" src={cover} alt={title} onClick={() => history.push(url)} />
        <div className="ml-4 flex flex-col">
          <div className="cursor-pointer line-clamp-1 pr-2 text-sm" onClick={() => history.push(url)}>{title}</div>
          <div className="flex items-center">
            {creatorName && (
              <>
                <p className="text-zinc-400 text-[8px]">by</p>
                <div style={{backgroundColor: getButtonRGBs(c)?.backgroundColor}} className="ml-1.5 p-1 rounded-full cursor-pointer">
                  <div className="flex items-center min-w-max">
                    {/* <img className="h-6 w-6" src={cover} alt={title} /> */}
                    <Cooyub className="rounded-full" svgStyle="h-2 w-2" rectStyle="h-6 w-6" fill={'rgb(255, 130, 0)'} />
                    <p style={{color: getButtonRGBs(c)?.color}} className="text-[8px] pr-1 ml-1 ">@{creatorName}</p>
                  </div>
                </div>
              </>
            )}
            {includeDescription && description && (
              <div className="mx-1.5 w-full line-clamp-1 text-xs">
                {description}
              </div>
            )}
          </div>
        </div>
      </div>
      {playButtonSize != 0 && (
        <div onClick={() => episodeIsCurrent ? playCurrentTrack() : playEpisode(episode)}>
          <div className="cursor-pointer rounded-[34px] p-3" style={getButtonRGBs(c)}>
            {episodeIsCurrent && !isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>            
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  )
}