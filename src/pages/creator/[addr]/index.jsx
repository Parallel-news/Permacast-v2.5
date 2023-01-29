import React, { useState, useEffect, useContext } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { getCreator, getPodcasts, convertToPodcast } from '../../../utils/podcast';
import TipButton from '../../../component/reusables/tip';
import Track from '../../../component/track';


export default function Creator({creatorAddress}) {
  const { t } = useTranslation();
  const address = creatorAddress;

  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState(); // ANS user goes here
  const [podcasts, setPodcasts] = useState([]);

  function convertE(words) {
    return words.filter((word) => word.toLowerCase().split("e"))
  }
  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      // const creator = await getCreator(address);
      // setCreator(creator);
      // const unsortedPodcasts = await getPodcasts();
      // const creatorPodcasts = unsortedPodcasts.filter(podcast => podcast.owner.toLowerCase() === address.toLowerCase());
      // const convertedPodcasts = await Promise.all(creatorPodcasts.splice(0,6).map(podcast => convertToPodcast(podcast)));
      // setPodcasts(convertedPodcasts);
      // setLoading(false);
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
      ):(
        <>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:ml-8 flex items-center flex-col md:flex-row">
              
            </div>
            <div className="flex items-center gap-x-7 md:mr-8">
              {creator?.currentLabel && (
                <a className="text-[rgb(255,255,0)]" href={`https://${creator?.currentLabel}.ar.page`} target="_blank" rel="noopener noreferrer">
                  {t('creator.ans')}
                </a>
              )}
              <TipButton tipColor='rgb(255, 255, 0)' />
            </div>
          </div>
          <div className="mt-8">
            <div className="text-xl font-bold text-white mb-8">{t("creator.podcasts")}</div>
            <EpisodeModule podcasts={podcasts} />
            <div className="py-12"></div>
          </div>
        </>
      )}
    </div>
  )
}



// Creator.getInitialProps = async ({ query }) => {
//   // try {
//   //   if (!query.user) return
//   //   const res = await axios.get(`http://ans-stats.decent.land/profile/${query.user}`);
//   //   const userInfo = res.data;
//   //   return { pathFullInfo: userInfo };
//   // } catch (error) {
//   //   console.log("attempting to use domain routing...");
//   //   return { pathFullInfo: false };
//   // };
// };

// pages/blog/[slug].js
export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      '/creator/arweaveaddr',
      // Object variant:
      // { params: { slug: 'second-post' } },
    ],
    fallback: true,
  };
};

// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  }
}
