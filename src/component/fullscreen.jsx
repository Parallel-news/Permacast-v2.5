import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPlay } from "react-icons/fa";

import { MESON_ENDPOINT } from "../utils/arweave";
import { getButtonRGBs, isTooLight } from "../utils/ui";
import { appContext } from '../utils/initStateGen.js';

export default function Fullscreen({episode}) {
  const appState = useContext(appContext);
  const history = useHistory();
  // const { t } = useTranslation();
  // const episode = {
  //   title: "All things crypto",
  //   episode: "1",
  //   cover: 'https://spec00-bfjkccdkhkiixxx-06-znmpfs.mesontracking.com/Fz6HG21u7ENc4RTIkOWjv0h29TlfqMC8LstdOTy4e9M_m_access_key_knppwrwiic'
  // };

  return (
    <div className="absolute h-full w-full z-[20] bg-black" onClick={console.log/*`url("${episode?.cover}")`}}> */}>
      <img className="absolute h-full w-full blur-lg opacity-30 object-cover" src={episode?.cover} alt={episode?.title} />
      <div className="absolute mt-28 w-full text-center select-text">
        <img className="w-[25%] cursor-pointer mx-auto" src={episode?.cover} alt={episode?.title} />
        <div className="mt-5 text-3xl font-bold text-white">Episode {episode?.episode}</div>
        <div className="mt-5 text-xl text-gray-300">{episode?.title}</div>
      </div>
    </div>
  )
}