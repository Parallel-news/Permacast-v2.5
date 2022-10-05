import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next'
import { ANS_TESTNET_MAP } from '../utils/arweave';
import { getCreator, getPodcasts, convertToPodcast } from '../utils/podcast';
import TipButton from '../component/reusables/tip';
import Track from '../component/track';
import { appContext } from '../utils/initStateGen.js';
// import { getCreator } from '../utils/creator';

export default function Creator (creatorAddress) {
  const { t } = useTranslation();
  const address = creatorAddress.match.params.creatorAddress 
  const appState = useContext(appContext);

  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState(); // ANS user goes here
  const [podcasts, setPodcasts] = useState([]);

  function convertE(words) {
    return words.filter((word) => word.toLowerCase().split("e"))
  }
  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      const creator = await getCreator(address);
      setCreator(creator);
      const unsortedPodcasts = await getPodcasts();
      const creatorPodcasts = unsortedPodcasts.filter(podcast => podcast.owner.toLowerCase() === address.toLowerCase());
      const convertedPodcasts = await Promise.all(creatorPodcasts.splice(0,6).map(podcast => convertToPodcast(podcast)));
      setPodcasts(convertedPodcasts);
      setLoading(false);
    };
    fetchData();
  }, [])

  return (
    <div className="mt-16">
      {loading ? (
        <>
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center">
              <div className="bg-gray-300/30 animate-pulse h-[120px] w-[120px] rounded-full px-12 mx-8"></div>
              <div className="bg-gray-300/30 animate-pulse rounded-full w-40 h-12 "></div>
            </div>
            <div className="w-80 h-12 rounded-full animate-pulse bg-gray-300/30"></div>
          </div>
          <div className="w-full h-16 rounded-full animate-pulse bg-gray-300/30 mt-8"></div>
          <div className="w-full h-16 rounded-full animate-pulse bg-gray-300/30 mt-8"></div>
        </>
      ): (
        <>
          <div className="flex items-center justify-between">
            <div className="ml-8 flex items-center">
              {creator?.avatar ? 
                <img src={"https://arweave.net/" + creator?.avatar} className="w-[120px] h-[120px] rounded-full object-cover" alt="" />
                :
                <div className={`w-[120px] h-[120px] rounded-full`} style={{backgroundColor: creator?.address_color || "#E5E7EB" }}></div>
              }
              <div className="ml-8 flex flex-col">
                <div className="text-3xl font-medium text-gray-100 select-text">
                  {creator?.nickname || creator?.user || t("creator.address") + " " + address?.slice(0, 4) + "..." + address?.slice(-4) + " " + t("creator.notfound")}
                </div>
                {creator?.currentLabel && 
                  <div className="text-xl font-medium text-gray-400 select-text">
                    @{creator?.currentLabel}.ar
                  </div>
                }
              </div>
            </div>
            <div className="flex items-center gap-x-7 mr-8">
              {creator?.currentLabel && (
                <a className="text-[rgb(255,255,0)]" href={`https://${creator?.currentLabel}/ar.page`} target="_blank" rel="noopener noreferrer">
                  {t('creator.ans')}
                </a>
              )}
              <TipButton tipColor='rgb(255, 255, 0)' />
            </div>
          </div>
          <div className="mt-8">
            <div className="text-xl font-bold text-white mb-8">{t("creator.podcasts")}</div>
            {podcasts.map((podcast, index) => (
              <div key={index} className="mb-6 p-2.5 border rounded-xl border-zinc-600">
                <Track episode={podcast} />
              </div>
            ))}
            {podcasts.length === 0 && (
              <div className="text-xl text-center font-bold text-white mb-8">{t("creator.nopodcasts")}</div>
            )}
            <div className="py-12"></div>
          </div>
        </>
      )}
    </div>
  )
}
