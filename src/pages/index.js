import React, { useContext, useEffect, useState, memo } from "react";

import { useRecoilState } from "recoil";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { appContext } from "../utils/initStateGen.js";
import {
  Greeting,
  FeaturedEpisode,
  FeaturedPodcastsMobile,
  RecentlyAdded,
  FeaturedCreators,
} from "../component/featured";
import { primaryData, secondaryData, switchFocus } from "../atoms/index.js";

import { useRouter } from "next/router";

export default function Home() {

  const areEqual = (prevProps, nextProps) => {
    return prevProps.recentlyAdded === nextProps.recentlyAdded;
  };

  const [switchFocus_, setSwitchFocus_] = useRecoilState(switchFocus);
  const [primaryData_, ] = useRecoilState(primaryData);
  const [secondaryData_, setSecondaryData_] = useRecoilState(secondaryData);
  const [loadedData, setLoadedData] = useState(false);

  const [recentlyAdded_, setRecentlyAdded_] = useState([]);
  const Loading = () => (
    <div className="w-full h-[100px] rounded-3xl mt-2 animate-pulse bg-gray-300/30"></div>
  );

  useEffect(() => {
    console.log("home.jsx useEffect");
    const getAllData_ = () => {
      setSecondaryData_(
        primaryData_.podcasts.filter((obj) => {
          if(switchFocus_){
            return obj.contentType === 'audio/'
          } else {
            return obj.contentType === 'video/'
          }
        })[0]
      );
      setRecentlyAdded_(
        primaryData_.podcasts.filter((obj) => {
          if(switchFocus_){
            return obj.contentType === 'audio/'
          }else{
            return obj.contentType === 'video/'
          }
        })
      );
    };


    if(primaryData_.podcasts && !loadedData) {
      try {
        getAllData_();
        setLoadedData(true);
       } catch (e) {
         console.log(e);
       }
    }
  
  }, [primaryData_, loadedData]);

  return (
    <div className="w-full pb-10 mb-10">
      {/* {Object.keys(secondaryData_).length > 0 ? <Greeting /> : <Loading />} */}
      {!loadedData && (
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
              setRecentlyAdded_(
                primaryData_.podcasts.filter((obj) => obj.contentType === "audio/")
                );
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
              setRecentlyAdded_(
                primaryData_.podcasts.filter((obj) => obj.contentType === "video/")
              );
              // console.log(data_)
            }}
          >
            <p className={`m-2 text-black/80 font-medium text-[13px]`}>
              Videos
            </p>
          </div>
        </div>
      )}

      { Object.keys(secondaryData_).length > 0 ? (
        <div className="hidden md:block">
          <FeaturedEpisode />
        </div>
      ) : <Loading />}

      {/* {Object.keys(secondaryData_).length > 0 ? (
        <div className="hidden md:grid w-full mt-8 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
          <FeaturedPodcasts podcasts={featuredPodcasts} />
        </div>
      ): <Loading />} */}

      {Object.keys(secondaryData_).length > 0 ? (
        <FeaturedPodcastsMobile />
      ) : (
        <Loading />
      )}
      <div className="my-9 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-x-12">
        <div className="xl:col-span-3 lg:col-span-2 md:col-span-1 mb-9">
          {Object.keys(secondaryData_).length > 0 ? (
            <RecentlyAdded />
          ) : (
            <Loading />
          )}
        </div>
        {Object.keys(secondaryData_).length > 0 ? (
          <div className="w-full">
            <FeaturedCreators />
          </div>
        ) : (
          <Loading />
        )}
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
