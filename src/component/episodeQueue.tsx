import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Track from './track';

const EpisodeQueue: FC = () => {
  
  const { t } = useTranslation();

  return (
    <div className="rounded-l-3xl w-72 text-white h-screen overflow-y-auto p-4 bg-zinc-900">
      {/* {appState.queue.get().map((episode, index) => (
        <Fragment key={index}>
          {index === 0 && <div className="text-zinc-500 mb-4">{t("queue.currentlyplaying")}</div>}
          {index === 1 && <div className="text-zinc-500 mb-4">{t("queue.upnext")}</div>}
          <div className="grid grid-rows-3 mb-[-80px]">
            <Track episode={episode} episodeNumber={index+1} />
          </div>
        </Fragment>
      ))} */}
      {/* {appState.queue.get().length === 0 && (
        <div>
          <p className="text text-center text-zinc-400">{t("queue.emptyqueue")}</p>
        </div>
      )} */}
    </div>
  )
}

export default EpisodeQueue;