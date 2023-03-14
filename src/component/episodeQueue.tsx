import { FC, Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import Track from './reusables/track';
import { useRecoilState } from 'recoil';
import { currentPodcast, queue } from '../atoms';
import { Episode } from '../interfaces';

const EpisodeQueue: FC = () => {
  
  const { t } = useTranslation();

  const [queue_, setQueue_] = useRecoilState(queue);
  const [currentPodcast_, setCurrentPodcast_] = useRecoilState(currentPodcast);

  return (
    <div className="rounded-l-3xl w-72 text-white h-screen overflow-y-auto p-4 bg-zinc-800">
      {queue_.map((episode: Episode, index: number) => (
        <Fragment key={index}>
          {index === 0 && <div className="text-zinc-500 mb-4">{t("queue.currentlyplaying")}</div>}
          {index === 1 && <div className="text-zinc-500 mb-4">{t("queue.upnext")}</div>}
          <div className="grid grid-rows-3 mb-[-80px]">
            {/* @ts-ignore */}
            <Track episode={{episode: episode, podcast: currentPodcast_}} episodeNumber={index+1} />
          </div>
        </Fragment>
      ))}
      {queue_.length === 0 && (
        <div>
          <p className="text text-zinc-400">{t("queue.emptyqueue")}</p>
        </div>
      )}
    </div>
  )
}

export default EpisodeQueue;