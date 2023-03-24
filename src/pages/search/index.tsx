import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Track from '../../component/track';
import { useTranslation } from 'next-i18next';
import { titles, allPodcasts, selection, input } from '../../atoms';
import { useRecoilState } from 'recoil';
import { getContractVariables } from '../../utils/contract';
import axios from 'axios';
import { ARWEAVE_READ_LINK, EXM_READ_LINK } from '../../constants';
import { PodcastOption, podcastOptionHoverStyling } from '../../component/uploadEpisode/uploadEpisodeTools';

export default function Search({podcasts}) {

  // Flatten and Modify Episodes/Podcasts into 1 Array
  let mediaArr: any[] = []
  podcasts.forEach((podcast) => {
    podcast.name = podcast.podcastName
    podcast.category = "Podcast"
    mediaArr.push(podcast)
    podcast.episodes.forEach((episode) => {
      episode.name = episode.episodeName
      episode.pid = podcast.pid
      episode.minifiedCover = podcast.minifiedCover
      episode.category = "Episode"
      mediaArr.push(episode)
    })
  })

  console.log("MA: ", mediaArr)
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


  const filteredPodcasts = _input ? 
  mediaArr.filter((item) => {
    if (_input === '') return [];
    else return item.name.toLowerCase().includes(_input.toLowerCase());
  })
  :
  [];
  console.log("filteredPodcasts: ", filteredPodcasts)
  return (
    <div className="text-white h-full pb-80">
      {titlesLoading ? <div className="text-3xl text-white font-bold mb-6">{t("search.loading")}</div> : (
        <div>
          {_input.length !== 0 ?
            (
              <>
                <div className="text-2xl text-white font-bold mb-6">Results</div>
                {filteredPodcasts.length > 0 ?
                filteredPodcasts.map((item, index) => (
                  <div key={index} className={`mb-6 w-[25%] flex flex-row items-center ${podcastOptionHoverStyling}`}>
                    <PodcastOption 
                        imgSrc={ARWEAVE_READ_LINK+item.minifiedCover}
                        title={item.name}
                        disableClick={true}
                    />
                    <p className='text-neutral-400'>{item.category}</p>
                  </div>
                )) 
                : (
                  <div className="text-2xl text-white font-normal mb-12">{t("search.nopodcasts")}</div>
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


//<Track episode={filtered} includePlayButton={false} />
