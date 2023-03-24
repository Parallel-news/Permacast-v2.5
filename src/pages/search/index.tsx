import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Track from '../../component/track';
import { useTranslation } from 'next-i18next';
import { titles, allPodcasts, selection, input } from '../../atoms';
import { useRecoilState } from 'recoil';
import { getContractVariables } from '../../utils/contract';

export default function Search({podcasts}) {
  console.log("search podcasts: ", podcasts)
  const [titlesLoading, setTitlesLoading] = useState(false);
  const [error, setError] = useState("");
  const [_titles, _setTitles] = useRecoilState(titles);
  const [ , _setAllPodcasts] = useRecoilState(allPodcasts);
  const [_selection, ] = useRecoilState(selection);
  const [_input, ] = useRecoilState(input); 
  const { t } = useTranslation();

  // const filters = [
  //   { type: "episodescount", desc: t("sorting.episodescount") },
  //   { type: "podcastsactivity", desc: t("sorting.podcastsactivity") }
  // ];
  // const filterTypes = filters.map(f => f.type);

  // Fetch Titles
  useEffect(() => {
    // const titlesContr = new AbortController();

    // setTitlesLoading(true);
    // cacheTitles({signal: titlesContr.signal})
    // .then(tit => _setTitles(tit))
    // .catch(e => setError(error));
    // setTitlesLoading(false);

    // return () => titlesContr.abort();
  }, []);

  // Fetch Podcasts
  useEffect(() => {
    // const podcastsContr = new AbortController();

    // sortPodcasts(filterTypes, {signal: podcastsContr.signal})
    // .then(sortedPodcasts => {
    //   _setAllPodcasts(sortedPodcasts[filterTypes[_selection]]);
    // })
    // .catch(e => setError(e));

    // return () => podcastsContr.abort();
  }, []);


  const filteredPodcasts = _titles ? 
  _titles.filter((p) => {
    if (_input === '') return;
    if (p.type === "eid") return;
    else return p.title.toLowerCase().includes(_input.toLowerCase());
  })
  :
  "";
  
  return (
    <div className="text-white h-full pb-80">
      {titlesLoading ? <div className="text-2xl text-white font-bold mb-6">{t("search.loading")}</div> : (
        <div>
          {_input.length !== 0 ?
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

// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
  const { contractAddress } = getContractVariables();
  const res = await axios.post(EXM_READ_LINK+contractAddress)
  const podcasts = res.data?.podcasts
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      podcasts
    },
  }
}
/*
  const { contractAddress } = getContractVariables();
  const res = await axios.post(EXM_READ_LINK+contractAddress)
  const podcasts = res.data?.podcasts

*/


