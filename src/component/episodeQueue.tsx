import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';
import { useRecoilState } from 'recoil';
import { PlusIcon } from '@heroicons/react/24/solid';

import Track from './reusables/track';

import { isQueueVisibleAtom, queueAtom } from '../atoms';
import { FullEpisodeInfo } from '../interfaces';
import { DEFAULT_BACKGROUND_COLOR } from '../constants/ui';

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
const episodeQueueStyling = "rounded-l-3xl w-72 text-white h-screen overflow-y-auto p-4 default-animation absolute z-50 bottom-0 right-0";
const topTextWrapperStyling = "flex items-center justify-between mb-4 font-bold text-xl";
const crossStyling = "rotate-45 text-zinc-400 hover:text-white default-animation";

// 3. Custom Functions

// 4. reusables

export const CrossIcon: FC<CrossIconProps> = ({ size, onClick }) => (
  <button onClick={onClick}>
    <PlusIcon className={crossStyling} style={{ width: size, height: size }} />
  </button>
);

const EpisodeQueue: FC = () => {

  const { t } = useTranslation();

  const [queue, setQueue] = useRecoilState(queueAtom);
  const [isQueueVisible, setIsQueueVisible] = useRecoilState(isQueueVisibleAtom);

  const TopText: FC = () => (
    <div className={topTextWrapperStyling}>
      <div>{t("queue.currentlyplaying")}</div>
      <CrossIcon size={32} onClick={() => setIsQueueVisible(false)} />
    </div>
  );

  const QueueList: FC = () => (
    <div>
      {queue.map((episode: FullEpisodeInfo, index: number) => (
        <div key={index} className="mb-2 relative">
          <Track {...{ episode }} includePlayButton />
        </div>
      )) || <p className="text-zinc-400">{t("queue.emptyqueue")}</p>}
    </div>
  );

  return (
    <div className={episodeQueueStyling} style={{ backgroundColor: DEFAULT_BACKGROUND_COLOR }}>
      <TopText />
      <QueueList />
    </div>
  );
};

export default EpisodeQueue;