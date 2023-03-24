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
import Link from 'next/link';

export default function Search({podcasts}) {

  // Flatten and Modify Episodes/Podcasts into 1 Array
  let mediaArr: any[] = []
  podcasts.forEach((podcast) => {
    podcast.name = podcast.podcastName
    podcast.category = "Podcast"
    podcast.url = `podcast/${podcast.pid}`
    mediaArr.push(podcast)
    podcast.episodes.forEach((episode) => {
      episode.name = episode.episodeName
      episode.pid = podcast.pid
      episode.minifiedCover = podcast.minifiedCover
      episode.category = "Episode"
      episode.url = `episode/${podcast.pid}/${episode.eid}`
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

  const filteredPodcasts = _input ? 
  mediaArr.filter((item) => {
    if (_input === '') return [];
    else return item.name.toLowerCase().includes(_input.toLowerCase());
  })
  :
  [];

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
                  <Link href={item.url}>
                    <div key={index} className={`mb-6 w-[25%] flex flex-row items-center ${podcastOptionHoverStyling}`}>
                      <PodcastOption 
                          imgSrc={ARWEAVE_READ_LINK+item.minifiedCover}
                          title={item.name}
                          disableClick={true}
                      />
                      <p className='text-neutral-400'>{item.category}</p>
                    </div>
                  </Link>
                )) 
                : (
                  <div className="text-2xl text-white font-normal mb-12">{t("search.nopodcasts")}</div>
                )}
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
