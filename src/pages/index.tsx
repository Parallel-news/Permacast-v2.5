import axios from 'axios';
import { NextPage } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useContext, useEffect, useState, memo } from "react";
import { useRecoilState } from "recoil";

import {
  Greeting,
  FeaturedEpisode,
  FeaturedPodcastsMobile,
  RecentlyAdded,
  FeaturedCreators,
} from "../component/featured";
import { switchFocus } from "../atoms/index.js";


const Home: NextPage = () => {

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [loading, setLoading] = useState(false);

  const [recentlyAdded_, setRecentlyAdded_] = useState([]);

  useEffect(() => {
    console.log("index.tsx useEffect");
    const getAllData_ = async () => {
      const result = await axios.get('/api/exm/dev-read')
      
      // setSecondaryData_(
      //   primaryData_.podcasts.filter((obj) => {
      //     if(switchFocus_){
      //       return obj.contentType === 'audio/'
      //     } else {
      //       return obj.contentType === 'video/'
      //     }
      //   })[0]
      // );
      // setRecentlyAdded_(
      //   primaryData_.podcasts.filter((obj) => {
      //     if(switchFocus_){
      //       return obj.contentType === 'audio/'
      //     }else{
      //       return obj.contentType === 'video/'
      //     }
      //   })
      // );
    };


  }, []);

  return (
    <div className="w-full pb-10 mb-10">
      <Greeting />
      {!loading && (
        <div
          className={`w-full h-[25px] flex flex-row ml-[6px] relative bottom-5`}
        >
          <div
            className={`h-full min-w-[30px] rounded-[20px] flex flex-row justify-center items-center mx-1 cursor-pointer ${
              switchFocus_
                ? "bg-white/70 hover:bg-white/80"
                : "bg-white/50 hover:bg-white/80"
            } transition-all duration-200`}
            onClick={() => {
              setSwitchFocus_(true);
              // setRecentlyAdded_(
              //   primaryData_.podcasts.filter((obj) => obj.contentType === "audio/")
              //   );
                // handler({x: 'req'})
            }}
          >
            <p className={`m-2 text-black/80 font-medium text-[13px]`}>
              Episodes
            </p>
          </div>

          <div
            className={`h-full min-w-[30px] rounded-[20px] flex flex-row justify-center items-center mx-1 cursor-pointer ${
              !switchFocus_
                ? "bg-white/70 hover:bg-white/80"
                : "bg-white/50 hover:bg-white/80"
            } transition-all duration-200`}
            onClick={() => {
              setSwitchFocus_(false);
              // setRecentlyAdded_(
              //   primaryData_.podcasts.filter((obj) => obj.contentType === "video/")
              // );
              // console.log(data_)
            }}
          >
            <p className={`m-2 text-black/80 font-medium text-[13px]`}>
              Videos
            </p>
          </div>
        </div>
      )}

      {/* { Object.keys(secondaryData_).length > 0 ? (
        <div className="hidden md:block">
          <FeaturedEpisode />
        </div>
      ) : <Loading />} */}

      {/* {Object.keys(secondaryData_).length > 0 ? (
        <div className="hidden md:grid w-full mt-8 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
          <FeaturedPodcasts podcasts={featuredPodcasts} />
        </div>
      ): <Loading />} */}

      {/* {Object.keys(secondaryData_).length > 0 ? (
        <FeaturedPodcastsMobile />
      ) : (
        <Loading />
      )} */}
      <div className="my-9 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
        <div className="xl:col-span-3 lg:col-span-2 md:col-span-1 mb-9">
          {/* {Object.keys(secondaryData_).length > 0 ? (
            <RecentlyAdded />
          ) : (
            <Loading />
          )} */}
        </div>
        {/* {Object.keys(secondaryData_).length > 0 ? (
          <div className="w-full">
            <FeaturedCreators />
          </div>
        ) : (
          <Loading />
        )} */}
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  }
}


// Home.getInitialProps = async () => {
//   // { query }: { query: { user: string; } })
//   try {
//       const res = await axios.get(``);
//       const userInfo = res.data;  // <-- Access one more data object here
//       return { pathFullInfo: userInfo };
//   } catch (error) {
//       console.log("attempting to use domain routing...")
//       return { pathFullInfo: false };
//   };
// };

export default Home