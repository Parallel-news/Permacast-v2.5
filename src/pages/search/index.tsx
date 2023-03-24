import axios from 'axios';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { getContractVariables } from '../../utils/contract';
import { ARWEAVE_READ_LINK, EXM_READ_LINK } from '../../constants';
import { titles, allPodcasts, selection, input } from '../../atoms';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PodcastOption, podcastOptionHoverStyling } from '../../component/uploadEpisode/uploadEpisodeTools';

const searchContainerStyling = "text-white h-full pb-80"
const resultsStyling = "text-2xl text-white font-bold mb-6"
const startTypingStyling = "text-center text-white text-2xl"
const searchLoadingStyling = "text-3xl text-white font-bold mb-6"
const noPodcastsStyling = "text-2xl text-white font-normal mb-12"
const podcastOptionStyling = "mb-6 w-[35%] flex flex-row items-center"

export default function Search({podcasts}) {

  // Flatten and Modify Episodes/Podcasts into 1 Array
  let mediaArr: any[] = []
  podcasts.forEach((podcast) => {
    podcast.name = podcast.podcastName
    podcast.category = "Show"
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

  const [titlesLoading, ] = useState(false);
  const [_titles, _setTitles] = useRecoilState(titles);
  const [ , _setAllPodcasts] = useRecoilState(allPodcasts);
  const [_selection, ] = useRecoilState(selection);
  const [_input, ] = useRecoilState(input); 
  const { t } = useTranslation();

  let filteredPodcasts = _input ? 
  mediaArr.filter((item) => {
      if (_input === '') return [];
      else return item.name.toLowerCase().includes(_input.toLowerCase());
    })
  :
    [];

  // Limit to filteredPodcasts to 50 items
  filteredPodcasts = filteredPodcasts.length > 50 ? filteredPodcasts.slice(0, 50) : filteredPodcasts

  return (
    <div className={searchContainerStyling}>
      {titlesLoading ? 
        <div className={searchLoadingStyling}>{t("search.loading")}</div> 
      : 
      (
        <div>
          {/*Search Field Populated*/}
          {_input.length !== 0 ?
            (
              <>
                <div className={resultsStyling}>Results</div>
                {filteredPodcasts.length > 0 ?
                filteredPodcasts.slice(0, 50).map((item, index) => (
                  <Link href={item.url}>
                    <div key={index} className={`${podcastOptionStyling} ${podcastOptionHoverStyling}`}>
                      <PodcastOption 
                          imgSrc={ARWEAVE_READ_LINK+item.minifiedCover}
                          title={item.name}
                          disableClick={true}
                      />
                      <p className='text-neutral-400 mx-3'>{item.category}</p>
                    </div>
                  </Link>
                )) 
                : (
                  <div className={noPodcastsStyling}>{t("search.nopodcasts")}</div>
                )}
              </>
            )
            :
            (
              <div className={startTypingStyling}>
                Start typing to search for podcasts or episodes...
              </div>
            )
          }
        </div>
      )}
    </div>
  )
}

export async function getStaticProps({ locale }) {
  const { contractAddress } = getContractVariables();
  const res = await axios.post(EXM_READ_LINK+contractAddress)
  let podcasts = res.data?.podcasts
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      podcasts
    },
  }
}