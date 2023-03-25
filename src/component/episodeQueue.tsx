import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import Track from './reusables/track';
import { useRecoilState } from 'recoil';
import { currentPodcastAtom, isQueueVisibleAtom, queueAtom } from '../atoms';
import { Episode } from '../interfaces';
import { PlusIcon } from '@heroicons/react/24/solid';

/**
 * Index
 * 1. Interfaces
 * 2. Stylings
 * 3. Custom Functions
 * 4. Reusable Components
 */

// 1. Interfaces 
export interface CrossIconProps {
  size: number;
  onClick: () => void;
};

// 2. Stylings
const episodeQueueStyling = "rounded-l-3xl w-72 text-white h-screen overflow-y-auto p-4 bg-zinc-800 default-animation";
const topTextWrapperStyling = "flex items-center justify-between mb-4 font-bold text-xl";
const crossStyling = "rotate-45 text-zinc-400 hover:text-white default-animation";

// 3. Custom Functions

// 4. reusables

export const CrossIcon: FC<CrossIconProps> = ({ size, onClick }) => (
  <button onClick={onClick}>
    <PlusIcon className={crossStyling} style={{width: size, height: size}} />
  </button>
);

const EpisodeQueue: FC = () => {

  const { t } = useTranslation();

  const [queue, setQueue] = useRecoilState(queueAtom);
  const [isQueueVisible, setIsQueueVisible] = useRecoilState(isQueueVisibleAtom);
  const [currentPodcast, setCurrentPodcast] = useRecoilState(currentPodcastAtom);

  const TopText: FC = () => (
    <div className={topTextWrapperStyling}>
      <div>{t("queue:currentlyplaying")}</div>
      <CrossIcon size={32} onClick={() => setIsQueueVisible(false)} />
    </div>
  );

  const QueueList: FC = () => (
    <div>
      {queue.map((episode: Episode, index: number) => (
        <div key={index} className="mb-2 relative">
          <Track episode={{episode: episode, podcast: currentPodcast}} episodeNumber={index + 1} includePlayButton />
        </div>
      )) || <p className="text-zinc-400">{t("queue.emptyqueue")}</p>}
    </div>
  );

  return (
    <div className={episodeQueueStyling}>
      <TopText />
      <QueueList />
    </div>
  );
};

export default EpisodeQueue;