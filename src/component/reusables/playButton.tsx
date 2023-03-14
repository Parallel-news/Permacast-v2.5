// import { getButtonRGBs, RGBobjectToString } from '../../utils/ui';
// import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
// import { useRecoilState } from 'recoil';
// import { FC } from 'react';
// import { Episode } from '../../interfaces';

// import React, { useState, useEffect } from "react";
// import { useTranslation } from "next-i18next";
// import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';

// import {
//   isTooLight,
//   RGBAstringToObject,
//   RGBAobjectToString,
//   dimColorString,
//   showShikwasaPlayer,
// } from "../../utils/ui";

// import { PlayButton } from "../reusables/icons";

// import {
//   switchFocus,
//   videoSelection,
//   queue,
//   player
// } from "../../atoms";

// import { PodcastDev } from "../../interfaces/index.js";
// import Link from "next/link";

// const PlayButton:FC<PlayButtonInterface> = ({episode, episodeNumber, color}) => {
  
//   // const { currentEpisode, playEpisode } = appState.queue;
//   // const { isPaused, setIsPaused } = appState.playback;
//   // const c = color ? color : episode?.rgb;

//   // const episodeIsCurrent = (currentEpisode?.contentTx === episode.contentTx) || (currentEpisode?.contentTx === episode?.eid);
//   // const { player } = appState;

//   // const playCurrentTrack = () => {
//   //   if (!player) return;
//   //   player.toggle()
//   //   setIsPaused(!isPaused)
//   // }

//   const playEpisode = (episode:any, eid: number|string) => {
//     // global method
//   }
  
//   const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);

//   const [vs_, setVS_] = useRecoilState(videoSelection);

//   return (
//     <div onClick={() => playEpisode(episode, episode.eid)}>
//       <div className="cursor-pointer rounded-[34px] p-3" > {/* style={getButtonRGBs(c)} */}
//         {false ? ( //episodeIsCurrent && !isPaused
//           <PauseIcon className="w-4 h-4 fill-current stroke-[3]" />
//         ) : (
//           <PlayIcon className="w-4 h-4 fill-current" />
//         )}
//       </div>
//     </div>
//   )
// }

const PlayButton = () => {}

export default PlayButton;