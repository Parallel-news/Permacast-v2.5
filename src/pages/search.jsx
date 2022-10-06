import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { appContext } from '../utils/initStateGen';
import Track from '../component/track';
import { useTranslation } from 'react-i18next';

export function Searchbar() {
  const appState = useContext(appContext);
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { input, setInput } = appState.search;

  return (
    <div>
      <form className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pr-10 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-zinc-600" />
        </div>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (!location.pathname.includes("search")) history.push("/search");
          }}
          className="input input-secondary block pl-10 py-2.5 md:py-[14px] text-xs md:text-base w-full placeholder-zinc-600 focus:placeholder-white rounded-lg md:rounded-full bg-zinc-900 text-zinc-100 outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          placeholder={t("search.placeholder")}
        />
      </form>
    </div>
  )
}

export default function Search() {
  const appState = useContext(appContext);
  const { input, titles } = appState.search;
  const { allPodcasts } = appState;
  const loading = appState.otherComponentsLoading.titles;
  const { t } = useTranslation();

  const filteredPodcasts = titles.filter((p) => {
    if (input === '') return;
    if (p.type === "eid") return;
    else return p.title.toLowerCase().includes(input.toLowerCase());
  })
  // console.log(filteredPodcasts);
  // TODO: add podcastId to episodes
  // const filteredEpisodes = titles.filter((p) => {
  //   if (input === '') return;
  //   if (p.type === "pid") return;
  //   else {
  //     const podcast = allPodcasts.podcastsactivity.find(p => p.episodes.find(e => e.eid === p.eid))
  //     return p.title.toLowerCase().includes(input.toLowerCase());
  //   }
  // })

  return (
    <div className="text-white h-full pb-80">
      {loading ? <div className="text-2xl text-white font-bold mb-6">{t("search.loading")}</div> : (
        <div>
          {input.length !== 0 ?
            (
              <>
                <div className="text-2xl text-white font-bold mb-6">{t("search.podcasts")}</div>
                {filteredPodcasts.length !== 0 ? (
                  <>
                    {filteredPodcasts?.map((filtered, idx) => (
                      <div key={idx} className="mb-6 p-2.5 border rounded-xl border-zinc-600">
                        <Track episode={filtered} includePlayButton={false} />
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-2xl text-white font-bold mb-12">{t("search.nopodcasts")}</div>
                )}
                {/* <div className="text-2xl text-white font-bold mb-6">{t("search.episodes")}</div> */}
                {/* {filteredEpisodes.length !== 0 ? (
                  <>
                    {filteredEpisodes?.map((filtered, idx) => (
                      <div key={idx} className="mb-6 p-2.5 border rounded-xl border-zinc-600">
                        <Track episode={filtered} episodeNumber={idx} />
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-2xl text-white font-bold mb-12">{t("search.noepisodes")}</div>
                )} */}
              </>
            )
            :
            (
              <div className="text-center text-white text-2xl">
                Start typing to search for podcasts or episodes...
              </div>
            )
          }
        </div>
      )}
    </div>
  )
}
